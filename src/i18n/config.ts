import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { isValidLocale } from './types';

export default getRequestConfig(async (context) => {
  const locale = context.requestLocale || context.locale;

  const resolvedLocale =
    typeof locale === 'object' && locale && 'then' in locale ? await locale : locale;

  if (!resolvedLocale || !isValidLocale(resolvedLocale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${resolvedLocale}.json`)).default;
  } catch {
    notFound();
  }

  return {
    locale: resolvedLocale,
    messages,
    timeZone: 'Asia/Seoul',
    now: new Date(),
  };
});
