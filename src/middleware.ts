import createMiddleware from 'next-intl/middleware';

import { locales, defaultLocale } from './i18n/types';

export default createMiddleware({
  locales,

  defaultLocale,

  localeDetection: true,

  localePrefix: 'always',
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/',
  ],
};
