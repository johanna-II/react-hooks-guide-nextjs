import { cache } from 'react';

import { getDeepLClient } from '@/lib/deepl-client';
import { koreanTexts } from '@/lib/korean-texts';
import { persistentCache } from '@/lib/persistent-cache';
import { capitalizeEnglishSentences } from '@/utils/text-formatting';

// 서버사이드 번역 캐시 (메모리 캐시)
const translationCache = new Map<string, Record<string, string>>();

/**
 * 서버사이드에서 모든 텍스트를 미리 번역
 * React의 cache 함수로 래핑하여 동일 요청에서 중복 호출 방지
 */
export const getServerTranslations = cache(async (locale: 'en' | 'ja') => {
  const cacheKey = `server_translations:${locale}`;

  // 메모리 캐시 확인
  const cached = translationCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  // Vercel KV 캐시 확인
  try {
    const kvCached = await persistentCache.get(cacheKey);
    if (kvCached) {
      const translations = JSON.parse(kvCached);
      translationCache.set(cacheKey, translations);
      return translations;
    }
  } catch (error) {
    console.error('Failed to get from Vercel KV cache:', error);
  }

  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL;

  if (!apiKey || apiKey === 'your_deepl_api_key_here') {
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
    const translatedTexts = await deeplClient.translateBatch(texts, targetLang, 'KO');

    // Convert results to object
    const translations: Record<string, string> = {};
    keys.forEach((key, index) => {
      // 영어 번역인 경우 문장 첫 글자 대문자 처리
      const translatedText =
        locale === 'en'
          ? capitalizeEnglishSentences(translatedTexts[index])
          : translatedTexts[index];
      translations[key] = translatedText;
    });

    // 메모리 캐시에 저장
    translationCache.set(cacheKey, translations);

    // Vercel KV에 저장 (1시간 TTL)
    try {
      await persistentCache.set(cacheKey, JSON.stringify(translations));
    } catch (error) {
      console.error('Failed to save to Vercel KV cache:', error);
    }

    // 메모리 캐시 만료 시간 설정 (1시간)
    setTimeout(
      () => {
        translationCache.delete(cacheKey);
      },
      60 * 60 * 1000
    );

    return translations;
  } catch (error) {
    console.error('Server translation error:', error);
    return {}; // 오류 시 빈 객체 반환 (클라이언트에서 처리)
  }
});

/**
 * 특정 키들만 번역
 */
export const getServerTranslationsByKeys = cache(async (locale: 'en' | 'ja', keys: string[]) => {
  const cacheKey = `server_translations_keys:${locale}:${keys.sort().join(',')}`;

  // 메모리 캐시 확인
  const cached = translationCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  // Vercel KV 캐시 확인
  try {
    const kvCached = await persistentCache.get(cacheKey);
    if (kvCached) {
      const translations = JSON.parse(kvCached);
      translationCache.set(cacheKey, translations);
      return translations;
    }
  } catch (error) {
    console.error('Failed to get from Vercel KV cache:', error);
  }

  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL;

  if (!apiKey) {
    const result: Record<string, string> = {};
    keys.forEach((key) => {
      result[key] = koreanTexts[key] || key;
    });
    return result;
  }

  try {
    const deeplClient = getDeepLClient(apiKey, apiUrl);
    const targetLang = locale === 'en' ? 'EN-US' : 'JA';

    // 요청된 키의 텍스트만 추출
    const textsToTranslate = keys.map((key) => koreanTexts[key] || key);

    // 배치 번역
    const translatedTexts = await deeplClient.translateBatch(textsToTranslate, targetLang, 'KO');

    // Map results
    const translations: Record<string, string> = {};
    keys.forEach((key, index) => {
      translations[key] = translatedTexts[index];
    });

    // 메모리 캐시에 저장
    translationCache.set(cacheKey, translations);

    // Vercel KV에 저장 (1시간 TTL)
    try {
      await persistentCache.set(cacheKey, JSON.stringify(translations));
    } catch (error) {
      console.error('Failed to save to Vercel KV cache:', error);
    }

    // 메모리 캐시 만료 시간 설정 (1시간)
    setTimeout(
      () => {
        translationCache.delete(cacheKey);
      },
      60 * 60 * 1000
    );

    return translations;
  } catch (error) {
    console.error('Partial server translation error:', error);
    const result: Record<string, string> = {};
    keys.forEach((key) => {
      result[key] = koreanTexts[key] || key;
    });
    return result;
  }
});
