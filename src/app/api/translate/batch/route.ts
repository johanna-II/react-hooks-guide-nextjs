import { NextRequest, NextResponse } from 'next/server';
import { getDeepLClient } from '@/lib/deepl-client';
import { capitalizeEnglishSentences } from '@/utils/text-formatting';

// 런타임에 환경변수 읽기
function getDeepLConfig() {
  return {
    apiKey: process.env.DEEPL_API_KEY,
    apiUrl: process.env.DEEPL_API_URL
  };
}

// 배치 번역 캐시
const batchCache = new Map<string, Map<string, string>>();

interface BatchTranslationRequest {
  texts: Record<string, string>; // { key: text }
  targetLang: 'EN' | 'JA';
  sourceLang?: 'KO';
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, apiUrl } = getDeepLConfig();
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Translation service not configured' },
        { status: 500 }
      );
    }

    const body: BatchTranslationRequest = await request.json();
    const { texts, targetLang, sourceLang = 'KO' } = body;

    if (!texts || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate cache key
    const cacheKey = `${sourceLang}:${targetLang}`;
    
    // 언어별 캐시 확인
    if (!batchCache.has(cacheKey)) {
      batchCache.set(cacheKey, new Map());
    }
    const langCache = batchCache.get(cacheKey)!;

    // Collect cached translation results
    const results: Record<string, string> = {};
    const keysToTranslate: string[] = [];
    const textsToTranslate: string[] = [];

    for (const [key, text] of Object.entries(texts)) {
      if (langCache.has(text)) {
        const cachedTranslation = langCache.get(text)!;
        // 영어 번역인 경우 캐시된 결과도 대문자 처리 확인
        results[key] = targetLang === 'EN' 
          ? capitalizeEnglishSentences(cachedTranslation)
          : cachedTranslation;
      } else {
        keysToTranslate.push(key);
        textsToTranslate.push(text);
      }
    }

    // Execute batch translation if there are texts to translate
    if (textsToTranslate.length > 0) {
      const deeplClient = getDeepLClient(apiKey, apiUrl);
      
      try {
        const translatedTexts = await deeplClient.translateBatch(
          textsToTranslate,
          targetLang === 'EN' ? 'EN-US' : targetLang,
          sourceLang
        );

        // Save results and cache
        translatedTexts.forEach((translatedText, index) => {
          const key = keysToTranslate[index];
          const originalText = textsToTranslate[index];
          
          // 영어 번역인 경우 문장 첫 글자 대문자 처리
          const processedText = targetLang === 'EN' 
            ? capitalizeEnglishSentences(translatedText) 
            : translatedText;
          
          results[key] = processedText;
          langCache.set(originalText, processedText);
        });
      } catch (error) {
        console.error('Batch translation error:', error);
        return NextResponse.json(
          { error: 'Translation failed', details: error },
          { status: 500 }
        );
      }
    }

    // Cache size limit (5000 items per language)
    if (langCache.size > 5000) {
      const entriesToDelete = langCache.size - 5000;
      const iterator = langCache.entries();
      for (let i = 0; i < entriesToDelete; i++) {
        const { value } = iterator.next();
        if (value) {
          langCache.delete(value[0]);
        }
      }
    }

    return NextResponse.json({ 
      translations: results,
      cached: Object.keys(results).length - keysToTranslate.length,
      translated: keysToTranslate.length
    });

  } catch (error) {
    console.error('Batch translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
