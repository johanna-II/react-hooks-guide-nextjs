import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { isValidLocale } from './types';

// next-intl 설정 - 실시간 번역을 위해 빈 메시지 객체 사용
export default getRequestConfig(async (context) => {
  // Next.js 15에서는 requestLocale이 Promise로 제공됨
  const locale = context.requestLocale || context.locale;
  
  // locale이 Promise인 경우 await
  const resolvedLocale = typeof locale === 'object' && locale && 'then' in locale 
    ? await locale 
    : locale;
  
  // 유효하지 않은 로케일이면 404
  if (!resolvedLocale || !isValidLocale(resolvedLocale)) {
    notFound();
  }

  return {
    locale: resolvedLocale,
    messages: {}, // 빈 메시지 - DeepL 실시간 번역 사용
    // 추가 설정 옵션
    timeZone: 'Asia/Seoul',
    now: new Date()
  };
});
