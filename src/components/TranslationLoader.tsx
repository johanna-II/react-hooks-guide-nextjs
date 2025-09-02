'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

import { useOptimizedTranslations } from '@/hooks/useOptimizedTranslations';
import { koreanTexts } from '@/lib/korean-texts';

interface TranslationLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function TranslationLoader({ children, fallback }: TranslationLoaderProps) {
  const locale = useLocale();
  const t = useOptimizedTranslations();
  const [isLoading, setIsLoading] = useState(locale !== 'ko');
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    // 한국어는 번역 불필요
    if (locale === 'ko') {
      setIsLoading(false);
      return;
    }

    // 중요한 UI 텍스트만 우선 확인 (전체 텍스트의 일부만 체크)
    const criticalKeys = [
      'title',
      'subtitle',
      'whyHooksTitle',
      'navigationTitle',
      'useState',
      'useEffect',
      'useContext',
      'useRef',
      'optimizationTitle',
      'advancedTitle',
    ];

    // 모든 텍스트 키 수집
    const allKeys = Object.keys(koreanTexts);
    const totalKeys = allKeys.length;
    let translatedCount = 0;
    let criticalTranslatedCount = 0;

    // 번역 상태 확인
    const checkTranslations = () => {
      translatedCount = 0;
      criticalTranslatedCount = 0;

      // 각 키에 대해 번역 확인
      allKeys.forEach((key) => {
        const translated = t(key);
        if (translated !== koreanTexts[key]) {
          translatedCount++;
          if (criticalKeys.includes(key)) {
            criticalTranslatedCount++;
          }
        }
      });

      const progress = Math.round((translatedCount / totalKeys) * 100);
      setLoadProgress(progress);

      // 중요한 번역이 모두 완료되면 로딩 해제 (70% 이상 완료 시)
      if (criticalTranslatedCount === criticalKeys.length || progress >= 70) {
        setIsLoading(false);
      }
    };

    // 초기 확인
    checkTranslations();

    // 번역이 완료되지 않았다면 주기적으로 확인
    const interval = setInterval(() => {
      checkTranslations();
    }, 100); // 100ms마다 확인

    // 타임아웃 설정 (최대 5초)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [locale, t]);

  // 한국어거나 번역 완료 시 children 렌더링
  if (!isLoading) {
    return children;
  }

  // 로딩 중일 때 fallback 또는 기본 로딩 UI 표시
  return (
    fallback || (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            {/* 원형 프로그레스 */}
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - loadProgress / 100)}`}
                className="text-blue-500 transition-all duration-300"
              />
            </svg>
            {/* 퍼센트 표시 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold">{loadProgress}%</span>
            </div>
          </div>
          <p className="text-slate-400">
            {locale === 'en' ? 'Loading translations...' : '翻訳を読み込んでいます...'}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            {locale === 'en' ? 'Please wait a moment' : 'しばらくお待ちください'}
          </p>
        </div>
      </div>
    )
  );
}
