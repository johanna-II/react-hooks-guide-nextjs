import { useTranslations as useNextIntlTranslations } from 'next-intl';

import type React from 'react';

type TranslationValues = Record<string, string | number | Date>;
type RichTranslationValues = Record<
  string,
  string | number | Date | ((chunks: React.ReactNode) => React.ReactNode)
>;

/**
 * 정적 번역 파일 기반의 번역 훅
 * next-intl의 useTranslations를 래핑하여 사용
 */
export function useTranslations() {
  const t = useNextIntlTranslations();

  const translateFn = (
    key: string,
    valuesOrDefault?: TranslationValues | string,
    defaultValue?: string
  ) => {
    try {
      if (typeof valuesOrDefault === 'object') {
        const value = t(key, valuesOrDefault);
        return value || defaultValue || key;
      } else {
        const value = t(key);
        return value || valuesOrDefault || key;
      }
    } catch (_error) {
      return typeof valuesOrDefault === 'string' ? valuesOrDefault : defaultValue || key;
    }
  };

  translateFn.rich = (key: string, values: RichTranslationValues) => {
    try {
      return t.rich(key, values);
    } catch (_error) {
      return key;
    }
  };

  return translateFn;
}

/**
 * 네임스페이스 기반 번역 훅
 * 특정 섹션의 번역만 가져올 때 사용
 */
export function useTranslationsNamespace(namespace: string) {
  const t = useNextIntlTranslations(namespace);

  return (key: string, defaultValue?: string) => {
    try {
      const value = t(key);
      return value || defaultValue || key;
    } catch (_error) {
      return defaultValue || key;
    }
  };
}

/**
 * HTML이 포함된 번역을 위한 훅
 */
export function useHTMLTranslations() {
  const t = useTranslations();

  return (key: string, defaultValue?: string) => {
    const text = t(key, defaultValue);
    return text;
  };
}
