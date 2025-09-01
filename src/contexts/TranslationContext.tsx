'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/types';
import { koreanTexts } from '@/lib/korean-texts';
import { useServerTranslations } from './ServerTranslationContext';

interface TranslationContextType {
  translate: (key: string, defaultText?: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  translate: (_, defaultText) => defaultText || ''
});

// Translation cache (browser memory)
const clientCache = new Map<string, string>();

// 마지막 요청 시간 추적
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 500; // 최소 0.5초 간격

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale;
  const serverContext = useServerTranslations();
  const [translations, setTranslations] = useState<Record<string, string>>(
    serverContext?.translations || {}
  );
  const pendingTranslationsRef = useRef<Set<string>>(new Set());

    // Translation function (with retry logic)
  const translateText = useCallback(async (text: string, targetLang: 'EN' | 'JA', retryCount = 0): Promise<string> => {
    const cacheKey = `${targetLang}:${text}`;
    
    // 클라이언트 캐시 확인
    if (clientCache.has(cacheKey)) {
      return clientCache.get(cacheKey)!;
    }

    try {
      // 요청 간 최소 간격 유지
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
      }
      lastRequestTime = Date.now();

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang })
      });

      if (response.status === 429 && retryCount < 3) {
        // 429 에러 시 지수 백오프로 재시도
        const delay = Math.pow(2, retryCount) * 1000; // 1초, 2초, 4초
        // Rate limited. Retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return translateText(text, targetLang, retryCount + 1);
      }

      if (!response.ok) {
        console.error('Translation API error:', response.status);
        return text; // Return original on translation failure
      }

      const data = await response.json();
      const translation = data.translation;
      
      // Save to cache
      clientCache.set(cacheKey, translation);
      
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // 오류 시 원본 반환
    }
  }, []);

  // Translation request queue
  const translationQueueRef = useRef<Set<string>>(new Set());

  // Get translation function
  const translate = useCallback((key: string, defaultText?: string): string => {
    // 한국어는 원본 반환
    if (locale === 'ko') {
      return koreanTexts[key] || defaultText || key;
    }

    // 이미 번역된 텍스트가 있으면 반환
    if (translations[key]) {
      return translations[key];
    }

    // Determine text to translate
    const textToTranslate = koreanTexts[key] || defaultText || key;
    const targetLang = locale === 'en' ? 'EN' : 'JA';
    const cacheKey = `${targetLang}:${textToTranslate}`;

    // Return immediately if in cache
    if (clientCache.has(cacheKey)) {
      return clientCache.get(cacheKey)!;
    }

    // 렌더링 중에는 큐에만 추가하고 상태 업데이트하지 않음
    if (!pendingTranslationsRef.current.has(key) && !translationQueueRef.current.has(key)) {
      translationQueueRef.current.add(key);
    }

    // Return original while translating
    return textToTranslate;
  }, [locale, translations]);

  // Process translation queue
  useEffect(() => {
    if (locale === 'ko' || translationQueueRef.current.size === 0) return;

    const processQueue = async () => {
      const targetLang = locale === 'en' ? 'EN' : 'JA';
      const keysToTranslate = Array.from(translationQueueRef.current);
      
      // 큐 비우기
      translationQueueRef.current.clear();
      
      // 기존 pending에 추가
      keysToTranslate.forEach(key => pendingTranslationsRef.current.add(key));

      // 각 키에 대해 번역 요청
      for (const key of keysToTranslate) {
        const textToTranslate = koreanTexts[key] || key;
        const cacheKey = `${targetLang}:${textToTranslate}`;
        
        // Translate only if not in cache
        if (!clientCache.has(cacheKey)) {
          try {
            const translated = await translateText(textToTranslate, targetLang);
            setTranslations(prev => ({ ...prev, [key]: translated }));
          } catch (error) {
            console.warn(`Translation failed for ${key}:`, error);
          }
        } else {
          // Get from cache
          setTranslations(prev => ({ ...prev, [key]: clientCache.get(cacheKey)! }));
        }
      }

      // pending에서 제거
      keysToTranslate.forEach(key => pendingTranslationsRef.current.delete(key));
    };

    // 다음 렌더링 사이클에서 처리
    const timeoutId = setTimeout(processQueue, 0);
    return () => clearTimeout(timeoutId);
  }, [locale, translateText]);

  // 언어 변경 시 번역 캐시 초기화
  useEffect(() => {
    if (locale === 'ko') {
      setTranslations({});
      pendingTranslationsRef.current.clear();
      translationQueueRef.current.clear();
    }
  }, [locale]);

  return (
    <TranslationContext.Provider value={{ translate }}>
      {children}
    </TranslationContext.Provider>
  );
}

// 커스텀 훅
export function useTranslate() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslate must be used within TranslationProvider');
  }
  return context.translate;
}

// next-intl 호환 래퍼
export function useDeepLTranslations() {
  const translate = useTranslate();
  
  // 메인 함수를 반환하되, rich 메서드를 추가
  const t = (key: string, defaultText?: string): string => translate(key, defaultText || '');
  
  // Rich text 지원 메서드 추가
  t.rich = (key: string, values: Record<string, (chunks: React.ReactNode) => React.ReactNode>) => {
    const text = translate(key, '');
    
    // HTML 태그 파싱 및 컴포넌트 적용
    const parts = text.split(/(<[^>]+>.*?<\/[^>]+>)/);
    
    return parts.map((part, index) => {
      const tagMatch = part.match(/<(\w+)>(.*?)<\/\1>/);
      if (tagMatch && values[tagMatch[1]]) {
        return <React.Fragment key={index}>{values[tagMatch[1]](tagMatch[2])}</React.Fragment>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };
  
  return t;
}
