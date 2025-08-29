'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { localeMetadata, type Locale } from '@/i18n/types';
import { memo, useCallback, useMemo } from 'react';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = memo<LanguageSwitcherProps>(({ className = '' }) => {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  // 현재 경로에서 로케일 부분을 제거한 경로 계산
  const pathnameWithoutLocale = useMemo(() => {
    const segments = pathname.split('/');
    return segments.slice(2).join('/') || '';
  }, [pathname]);

  // 언어 변경 핸들러
  const handleLanguageChange = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return; // 같은 언어면 무시
      
      // 새로운 로케일로 경로 생성
      const newPath = `/${newLocale}${pathnameWithoutLocale ? `/${pathnameWithoutLocale}` : ''}`;
      router.push(newPath);
    },
    [locale, pathnameWithoutLocale, router]
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Object.values(localeMetadata).map((meta) => (
        <button
          key={meta.code}
          onClick={() => handleLanguageChange(meta.code)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium
            transition-all duration-200 
            ${
              locale === meta.code
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }
          `}
          aria-label={`${meta.name}로 언어 변경`}
          aria-current={locale === meta.code ? 'true' : 'false'}
        >
          <span className="mr-1.5">{meta.flag}</span>
          <span>{meta.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;
