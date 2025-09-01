import { koreanTexts } from '@/lib/korean-texts';
import { getDeepLClient } from '@/lib/deepl-client';
import { capitalizeEnglishSentences } from '@/utils/text-formatting';
import { cache } from 'react';

// 서버사이드 번역 캐시
const translationCache = new Map<string, Record<string, string>>();

/**
 * 서버사이드에서 모든 텍스트를 미리 번역
 * React의 cache 함수로 래핑하여 동일 요청에서 중복 호출 방지
 */
export const getServerTranslations = cache(async (locale: 'en' | 'ja') => {
  const cacheKey = locale;
  
  // 메모리 캐시 확인
  if (translationCache.has(cacheKey)) {
    console.log(`[Server Translation] Using cache for ${locale}`);
    return translationCache.get(cacheKey)!;
  }

  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL;

  console.log('[Server Translation] Environment check:', {
    locale,
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiUrl: apiUrl || 'not set',
    nodeEnv: process.env.NODE_ENV,
    isValidKey: apiKey && apiKey !== 'your_deepl_api_key_here' && apiKey.length > 10
  });

  if (!apiKey || apiKey === 'your_deepl_api_key_here') {
    console.log('[Server Translation] DeepL API key not configured, returning empty object');
    return {}; // 빈 객체 반환 (클라이언트에서 처리)
  }

  try {
    const deeplClient = getDeepLClient(apiKey, apiUrl);
    const targetLang = locale === 'en' ? 'EN-US' : 'JA';

    // 모든 텍스트를 배열로 변환
    const entries = Object.entries(koreanTexts);
    const keys = entries.map(([key]) => key);
    const texts = entries.map(([, text]) => text);

    // 배치 번역 실행
    console.log(`Translating ${texts.length} texts to ${targetLang}...`);
    const startTime = Date.now();
    
    const translatedTexts = await deeplClient.translateBatch(
      texts,
      targetLang,
      'KO'
    );

    // Convert results to object
    const translations: Record<string, string> = {};
    keys.forEach((key, index) => {
      // 영어 번역인 경우 문장 첫 글자 대문자 처리
      const translatedText = locale === 'en' 
        ? capitalizeEnglishSentences(translatedTexts[index])
        : translatedTexts[index];
      translations[key] = translatedText;
    });

    const duration = Date.now() - startTime;
    console.log(`Translation completed in ${duration}ms`);

    // Save to cache
    translationCache.set(cacheKey, translations);

    // Set cache expiration time (1 hour)
    setTimeout(() => {
      translationCache.delete(cacheKey);
    }, 60 * 60 * 1000);

    return translations;
  } catch (error) {
    console.error('Server translation error:', error);
    return {}; // 오류 시 빈 객체 반환 (클라이언트에서 처리)
  }
});

/**
 * 특정 키들만 번역
 */
export const getServerTranslationsByKeys = cache(async (
  locale: 'en' | 'ja',
  keys: string[]
) => {
  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL;

  if (!apiKey) {
    const result: Record<string, string> = {};
    keys.forEach(key => {
      result[key] = koreanTexts[key] || key;
    });
    return result;
  }

  try {
    const deeplClient = getDeepLClient(apiKey, apiUrl);
    const targetLang = locale === 'en' ? 'EN-US' : 'JA';

    // 요청된 키의 텍스트만 추출
    const textsToTranslate = keys.map(key => koreanTexts[key] || key);

    // 배치 번역
    const translatedTexts = await deeplClient.translateBatch(
      textsToTranslate,
      targetLang,
      'KO'
    );

    // Map results
    const translations: Record<string, string> = {};
    keys.forEach((key, index) => {
      translations[key] = translatedTexts[index];
    });

    return translations;
  } catch (error) {
    console.error('Partial server translation error:', error);
    const result: Record<string, string> = {};
    keys.forEach(key => {
      result[key] = koreanTexts[key] || key;
    });
    return result;
  }
});
