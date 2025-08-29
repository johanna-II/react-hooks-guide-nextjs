// 지원하는 언어 목록
export const locales = ['ko', 'en', 'ja'] as const;
export type Locale = (typeof locales)[number];

// 기본 언어
export const defaultLocale: Locale = 'ko';

// 로케일 유효성 검사 함수
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// 언어별 메타데이터
export interface LocaleMetadata {
  code: Locale;
  name: string;
  flag: string;
}

export const localeMetadata: Record<Locale, LocaleMetadata> = {
  ko: { code: 'ko', name: '한국어', flag: '🇰🇷' },
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' }
};

// 번역 메시지 타입 (추후 실제 메시지 구조에 맞춰 확장)
export interface Messages {
  navigation: {
    home: string;
    hooks: string;
    optimization: string;
    patterns: string;
  };
  hooks: {
    useState: {
      title: string;
      description: string;
    };
    useEffect: {
      title: string;
      description: string;
    };
    useCallback: {
      title: string;
      description: string;
    };
    useMemo: {
      title: string;
      description: string;
    };
    useRef: {
      title: string;
      description: string;
    };
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    open: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    sort: string;
    reset: string;
    submit: string;
    back: string;
    next: string;
    previous: string;
    confirm: string;
    yes: string;
    no: string;
  };
  demo: {
    title: string;
    description: string;
    runDemo: string;
    viewCode: string;
    result: string;
  };
}
