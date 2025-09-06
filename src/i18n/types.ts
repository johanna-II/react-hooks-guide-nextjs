export const locales = ['ko', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export interface LocaleMetadata {
  code: Locale;
  name: string;
  flag: string;
}

export const localeMetadata: Record<Locale, LocaleMetadata> = {
  ko: { code: 'ko', name: '한국어', flag: '🇰🇷' },
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
};

// Translation message types (extend according to actual message structure)
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
