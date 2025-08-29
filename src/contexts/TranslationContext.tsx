'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/types';

interface TranslationContextType {
  translate: (key: string, defaultText: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  translate: (_, defaultText) => defaultText,
  isLoading: false
});

// 번역 캐시 (브라우저 메모리)
const clientCache = new Map<string, string>();

// 한국어 원본 텍스트 맵핑
const koreanTexts: Record<string, string> = {
  // Hero section
  'hero.title': 'HOOKS',
  'hero.subtitle': 'React의 <span>미래</span>를 만나다',
  'hero.description': 'React Hooks의 모든 것을 배우고, React 19의 혁신적인 기능들을 체험해보세요. 실시간 데모와 함께하는 인터랙티브 학습 가이드입니다.',

  // Navigation
  'navigation.home': '홈',
  'navigation.hooks': 'React Hooks',
  'navigation.optimization': '최적화',
  'navigation.patterns': '고급 패턴',

  // Common
  'common.loading': '로딩 중...',
  'common.error': '오류가 발생했습니다',
  'common.retry': '다시 시도',
  'common.close': '닫기',
  'common.open': '열기',
  'common.save': '저장',
  'common.cancel': '취소',
  'common.delete': '삭제',
  'common.edit': '수정',
  'common.add': '추가',
  'common.search': '검색',
  'common.filter': '필터',
  'common.sort': '정렬',
  'common.reset': '초기화',
  'common.submit': '제출',
  'common.back': '뒤로',
  'common.next': '다음',
  'common.previous': '이전',
  'common.confirm': '확인',
  'common.yes': '예',
  'common.no': '아니오',

  // Guide
  'guide.completeGuide': 'Complete Guide',
  'guide.beginnerTitle': '🎯 초보자를 위한 React Hooks 완벽 가이드',
  'guide.whatIsHook': 'Hook이란?',
  'guide.whatIsHookDesc': 'Hook은 함수형 컴포넌트에서 React의 상태와 생명주기 기능을 사용할 수 있게 해주는 함수입니다. 클래스 컴포넌트 없이도 React의 모든 기능을 활용할 수 있게 되었습니다.',
  'guide.whyUseHooks': '왜 Hook을 사용할까?',
  'guide.whyUseHooksDesc': 'Hook을 사용하면 컴포넌트 간에 상태 로직을 재사용하기 쉽고, 복잡한 컴포넌트를 더 쉽게 이해할 수 있습니다.',
  'guide.hookAdvantages': 'Hook의 장점',
  'guide.hookAdvantagesDesc': '클래스 컴포넌트의 this 바인딩 문제가 없고, 컴포넌트를 더 작은 함수로 나누어 테스트하기 쉽습니다.',

  // Hooks
  'hooks.useState.title': 'useState',
  'hooks.useState.description': '컴포넌트의 상태를 관리하는 가장 기본적인 Hook입니다.',
  'hooks.useEffect.title': 'useEffect',
  'hooks.useEffect.description': '부수 효과를 수행하고 생명주기를 관리합니다.',
  'hooks.useCallback.title': 'useCallback',
  'hooks.useCallback.description': '함수를 메모이제이션하여 불필요한 재생성을 방지합니다.',
  'hooks.useMemo.title': 'useMemo',
  'hooks.useMemo.description': '계산 비용이 높은 값을 메모이제이션합니다.',
  'hooks.useRef.title': 'useRef',
  'hooks.useRef.description': 'DOM 요소나 값에 대한 참조를 유지합니다.',

  // Demo
  'demo.title': '데모',
  'demo.description': '실제 동작하는 예제를 확인해보세요',
  'demo.runDemo': '데모 실행',
  'demo.viewCode': '코드 보기',
  'demo.result': '결과',

  // Mobile
  'mobile.startButton': '시작하기',
  'mobile.swipeHint': '또는 좌측으로 스와이프',
  'mobile.beginnerHooks': '초보자를 위한 React Hooks',
  'mobile.meetFuture': 'React의 미래를 만나다',
  'mobile.learnEverything': 'React Hooks의 모든 것을 배우고, React 19의 혁신적인 기능들을 체험해보세요.',

  // Form
  'form.title': 'Form Actions 데모',
  'form.description': '이 데모는 React 19의 새로운 Form Actions 기능을 시뮬레이션합니다. 실제 Form Actions에서는 useActionState와 useFormStatus를 사용합니다.',
  'form.name': '이름',
  'form.email': '이메일',
  'form.message': '메시지',
  'form.namePlaceholder': '이름을 입력하세요',
  'form.emailPlaceholder': '이메일을 입력하세요',
  'form.messagePlaceholder': '메시지를 입력하세요',
  'form.submit': '제출',
  'form.submitting': '제출 중...',
  'form.successMessage': '폼이 성공적으로 제출되었습니다!',
  'form.errorMessage': '필수 필드를 모두 입력해주세요.',
  'form.required': '필수',

  // Why Hooks
  'whyHooks.title': 'Hooks가 필요한 이유',
  'whyHooks.items.stateful.title': '상태 로직 재사용',
  'whyHooks.items.stateful.desc': 'HOCs나 render props 없이 컴포넌트 간 상태 로직을 쉽게 공유',
  'whyHooks.items.simpleComponents.title': '더 단순한 컴포넌트',
  'whyHooks.items.simpleComponents.desc': '함수형 컴포넌트는 클래스 컴포넌트보다 이해와 테스트가 쉽다',
  'whyHooks.items.bundleSize.title': '번들 크기 개선',
  'whyHooks.items.bundleSize.desc': '함수형 컴포넌트는 클래스 컴포넌트보다 미니파이가 효율적',
  'whyHooks.items.noBinding.title': '바인딩 문제 해결',
  'whyHooks.items.noBinding.desc': '이벤트 핸들러에서 \'this\' 바인딩을 걱정할 필요가 없다',
  'whyHooks.items.composition.title': '더 나은 조합',
  'whyHooks.items.composition.desc': 'Hook을 통해 하나의 컴포넌트를 더 작은 함수로 분할 가능',
  'whyHooks.items.futureReady.title': '미래를 위한 준비',
  'whyHooks.items.futureReady.desc': 'React 팀은 새로운 기능을 함수형 컴포넌트에 집중'
};

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale;
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // 번역 함수
  const translateText = useCallback(async (text: string, targetLang: 'EN' | 'JA') => {
    const cacheKey = `${targetLang}:${text}`;

    // 클라이언트 캐시 확인
    if (clientCache.has(cacheKey)) {
      return clientCache.get(cacheKey)!;
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang })
      });

      if (!response.ok) {
        console.error('Translation API error:', response.status);
        return text; // 번역 실패 시 원본 반환
      }

      const data = await response.json();
      const translation = data.translation;

      // 캐시 저장
      clientCache.set(cacheKey, translation);

      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // 오류 시 원본 반환
    }
  }, []);

  // 번역 가져오기 함수
  const translate = useCallback((key: string, defaultText?: string): string => {
    // 한국어는 원본 반환
    if (locale === 'ko') {
      return koreanTexts[key] || defaultText || key;
    }

    // 이미 번역된 텍스트가 있으면 반환
    if (translations[key]) {
      return translations[key];
    }

    // 번역할 텍스트 결정
    const textToTranslate = koreanTexts[key] || defaultText || key;
    const targetLang = locale === 'en' ? 'EN' : 'JA';

    // 비동기 번역 시작 (결과는 나중에 업데이트)
    if (!clientCache.has(`${targetLang}:${textToTranslate}`)) {
      translateText(textToTranslate, targetLang).then(translated => {
        setTranslations(prev => ({ ...prev, [key]: translated }));
      });
    }

    // 번역 중에는 원본 반환
    return textToTranslate;
  }, [locale, translations, translateText]);

  // 초기 번역 로드
  useEffect(() => {
    if (locale === 'ko') return;

    const loadTranslations = async () => {
      setIsLoading(true);
      const targetLang = locale === 'en' ? 'EN' : 'JA';
      const translationPromises: Promise<[string, string]>[] = [];

      // 모든 키에 대해 번역 요청
      for (const [key, text] of Object.entries(koreanTexts)) {
        translationPromises.push(
          translateText(text, targetLang).then(translated => [key, translated])
        );
      }

      try {
        const results = await Promise.all(translationPromises);
        const translationMap = Object.fromEntries(results);
        setTranslations(translationMap);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale, translateText]);

  return (
    <TranslationContext.Provider value={{ translate, isLoading }}>
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

  return {
    // 기본 번역
    (key: string): string => translate(key),

    // Rich text 지원
    rich: (key: string, values: Record<string, (chunks: React.ReactNode) => React.ReactNode>) => {
      const text = translate(key);

      // HTML 태그 파싱 및 컴포넌트 적용
      const parts = text.split(/(<[^>]+>.*?<\/[^>]+>)/);

      return parts.map((part, index) => {
        const tagMatch = part.match(/<(\w+)>(.*?)<\/\1>/);
        if (tagMatch && values[tagMatch[1]]) {
          return values[tagMatch[1]](tagMatch[2]);
        }
        return part;
      });
    }
};
}
