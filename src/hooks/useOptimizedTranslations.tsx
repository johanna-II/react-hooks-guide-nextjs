'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { useServerTranslations } from '@/contexts/ServerTranslationContext';
import { koreanTexts } from '@/lib/korean-texts';

// Translation cache
const globalTranslationCache = new Map<string, string>();

// 타입 정의를 위한 인터페이스
interface TranslateFunction {
  (key: string, defaultText?: string): string;
  rich: (key: string, values: Record<string, (chunks: React.ReactNode) => React.ReactNode>) => React.ReactNode[];
}

export function useOptimizedTranslations(): TranslateFunction {
  const locale = useLocale();
  const serverTranslations = useServerTranslations();
  const [clientTranslations, setClientTranslations] = useState<Record<string, string>>({});
  const batchQueueRef = useRef<Set<string>>(new Set());
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 배치 번역 처리
  const processBatch = useCallback(async () => {
    if (locale === 'ko' || batchQueueRef.current.size === 0) return;

    const keys = Array.from(batchQueueRef.current);
    batchQueueRef.current.clear();

    // Filter only texts that need translation
    const textsToTranslate: Record<string, string> = {};
    keys.forEach(key => {
      const text = koreanTexts[key];
      if (text && !globalTranslationCache.has(`${locale}:${key}`)) {
        textsToTranslate[key] = text;
      }
    });

    if (Object.keys(textsToTranslate).length === 0) return;

    try {
      const response = await fetch('/api/translate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: textsToTranslate,
          targetLang: locale === 'en' ? 'EN' : 'JA'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const translations = data.translations;

        // Update cache and state
        Object.entries(translations).forEach(([key, translation]) => {
          globalTranslationCache.set(`${locale}:${key}`, translation as string);
        });

        setClientTranslations(prev => ({ ...prev, ...translations }));
      }
    } catch (error) {
      console.error('Batch translation error:', error);
    }
  }, [locale]);

  // Translation function
  const t = useCallback((key: string, defaultText?: string): string => {
    // 한국어는 원본 반환
    if (locale === 'ko') {
      return koreanTexts[key] || defaultText || key;
    }

    // 1. 서버 번역 확인
    if (serverTranslations?.translations && serverTranslations.translations[key]) {
      return serverTranslations.translations[key];
    }

    // 2. 클라이언트 번역 확인
    if (clientTranslations[key]) {
      return clientTranslations[key];
    }

    // 3. 글로벌 캐시 확인
    const cacheKey = `${locale}:${key}`;
    if (globalTranslationCache.has(cacheKey)) {
      return globalTranslationCache.get(cacheKey)!;
    }

    // 4. 배치 큐에 추가
    if (!batchQueueRef.current.has(key)) {
      batchQueueRef.current.add(key);

      // 배치 타이머 설정 (50ms 디바운스)
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }
      batchTimerRef.current = setTimeout(processBatch, 50);
    }

    // 5. 번역 중에는 원본 반환
    return koreanTexts[key] || defaultText || key;
  }, [locale, serverTranslations, clientTranslations, processBatch]);

  // Rich text 지원
  (t as TranslateFunction).rich = useCallback((key: string, values: Record<string, (chunks: React.ReactNode) => React.ReactNode>) => {
    const text = t(key);
    
    // HTML 태그 파싱 및 컴포넌트 적용
    const parts = text.split(/(<[^>]+>.*?<\/[^>]+>)/);
    
    return parts.map((part, index) => {
      const tagMatch = part.match(/<(\w+)>(.*?)<\/\1>/);
      if (tagMatch && values[tagMatch[1]]) {
        return <React.Fragment key={index}>{values[tagMatch[1]](tagMatch[2])}</React.Fragment>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  }, [t]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }
    };
  }, []);

  return t as TranslateFunction;
}
