import { NextResponse } from 'next/server';

import { getDeepLClient } from '@/lib/deepl-client';
import { deepLDebugger } from '@/lib/deepl-debug';
import { persistentCache } from '@/lib/persistent-cache';
import { capitalizeEnglishSentences } from '@/utils/text-formatting';

import type { NextRequest } from 'next/server';

// 런타임에 환경변수 읽기
function getDeepLConfig() {
  return {
    apiKey: process.env.DEEPL_API_KEY,
    apiUrl: process.env.DEEPL_API_URL,
  };
}

interface TranslationRequest {
  text: string;
  targetLang: 'EN' | 'JA';
  sourceLang?: 'KO';
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, apiUrl } = getDeepLConfig();

    if (!apiKey) {
      return NextResponse.json({ error: 'Translation service not configured' }, { status: 500 });
    }

    const body: TranslationRequest = await request.json();
    const { text, targetLang, sourceLang = 'KO' } = body;

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 영구 캐시 확인
    const cacheKey = `${sourceLang}:${targetLang}:${text}`;
    const cached = await persistentCache.get(cacheKey);

    if (cached) {
      deepLDebugger.recordRequest(0, true); // 캐시 히트 기록
      return NextResponse.json({
        translation: cached,
        cached: true,
        source: 'persistent',
      });
    }

    // DeepL API 호출 전 문자 수 체크
    if (text.length > 5000) {
      return NextResponse.json(
        {
          error: 'Text too long. Maximum 5000 characters per request.',
        },
        { status: 400 }
      );
    }

    // DeepL Client로 번역
    const deeplClient = getDeepLClient(apiKey, apiUrl);

    let translation = await deeplClient.translate({
      text,
      targetLang: targetLang === 'EN' ? 'EN-US' : targetLang,
      sourceLang,
      preserveFormatting: true,
      tagHandling: 'html',
    });

    // 영어 번역인 경우 문장 첫 글자 대문자 처리
    if (targetLang === 'EN') {
      translation = capitalizeEnglishSentences(translation);
    }

    // 영구 캐시에 저장
    await persistentCache.set(cacheKey, translation);

    // 디버그 정보 기록
    deepLDebugger.recordRequest(text.length, false);

    return NextResponse.json({
      translation,
      cached: false,
      source: 'deepl',
    });
  } catch (error) {
    console.error('Translation error:', error);

    // Rate limit 에러 처리
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 캐시 상태 확인
export async function GET() {
  const stats = await persistentCache.getStats();
  const debugStats = deepLDebugger.getStats();

  return NextResponse.json({
    cache: stats,
    usage: debugStats,
    config: {
      apiKeyType: process.env.DEEPL_API_KEY?.endsWith(':fx') ? 'free' : 'pro',
      endpoint: process.env.DEEPL_API_URL || 'auto',
    },
  });
}
