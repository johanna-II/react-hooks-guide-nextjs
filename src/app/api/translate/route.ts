import { NextRequest, NextResponse } from 'next/server';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2/translate';

// 번역 캐시 (서버 메모리)
const translationCache = new Map<string, string>();

// 캐시 TTL: 24시간
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface TranslationRequest {
  text: string;
  targetLang: 'EN' | 'JA';
  sourceLang?: 'KO';
}

export async function POST(request: NextRequest) {
  try {
    if (!DEEPL_API_KEY) {
      return NextResponse.json(
        { error: 'Translation service not configured' },
        { status: 500 }
      );
    }

    const body: TranslationRequest = await request.json();
    const { text, targetLang, sourceLang = 'KO' } = body;

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 캐시 확인
    const cacheKey = `${sourceLang}:${targetLang}:${text}`;
    const cached = translationCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ 
        translation: cached,
        cached: true 
      });
    }

    // DeepL API 호출
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text,
        target_lang: targetLang,
        source_lang: sourceLang,
        preserve_formatting: '1',
        tag_handling: 'html'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepL API error:', error);
      return NextResponse.json(
        { error: 'Translation failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const translation = data.translations[0].text;

    // 캐시 저장
    translationCache.set(cacheKey, translation);

    // 캐시 크기 제한 (1000개)
    if (translationCache.size > 1000) {
      const firstKey = translationCache.keys().next().value;
      translationCache.delete(firstKey);
    }

    return NextResponse.json({ 
      translation,
      cached: false 
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 번역 상태 확인
export async function GET() {
  return NextResponse.json({
    status: DEEPL_API_KEY ? 'configured' : 'not configured',
    cacheSize: translationCache.size
  });
}
