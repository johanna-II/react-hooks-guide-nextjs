import { NextRequest, NextResponse } from 'next/server';
import { getDeepLClient } from '@/lib/deepl-client';
import { capitalizeEnglishSentences } from '@/utils/text-formatting';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = process.env.DEEPL_API_URL;

// Translation cache (server memory)
const translationCache = new Map<string, string>();

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

    // Check cache
    const cacheKey = `${sourceLang}:${targetLang}:${text}`;
    const cached = translationCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ 
        translation: cached,
        cached: true 
      });
    }

    // DeepL Client로 번역
    const deeplClient = getDeepLClient(DEEPL_API_KEY, DEEPL_API_URL);
    
    let translation = await deeplClient.translate({
      text,
      targetLang: targetLang === 'EN' ? 'EN-US' : targetLang,
      sourceLang,
      preserveFormatting: true,
      tagHandling: 'html'
    });

    // 영어 번역인 경우 문장 첫 글자 대문자 처리
    if (targetLang === 'EN') {
      translation = capitalizeEnglishSentences(translation);
    }

    // Save to cache
    translationCache.set(cacheKey, translation);

    // Cache size limit (1000 items)
    if (translationCache.size > 1000) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey) {
        translationCache.delete(firstKey);
      }
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

// Check translation status
export async function GET() {
  return NextResponse.json({
    status: DEEPL_API_KEY ? 'configured' : 'not configured',
    cacheSize: translationCache.size
  });
}
