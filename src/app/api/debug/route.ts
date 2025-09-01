import { NextResponse } from 'next/server';

export async function GET() {
  const envInfo = {
    // 환경변수 존재 여부만 확인 (값은 노출하지 않음)
    deepl: {
      hasApiKey: !!process.env.DEEPL_API_KEY,
      apiKeyLength: process.env.DEEPL_API_KEY?.length || 0,
      apiKeyPrefix: process.env.DEEPL_API_KEY?.substring(0, 5) + '...' || 'not set',
      apiUrl: process.env.DEEPL_API_URL || 'not set',
      isValidKey: process.env.DEEPL_API_KEY && 
                  process.env.DEEPL_API_KEY !== 'your_deepl_api_key_here' &&
                  process.env.DEEPL_API_KEY.length > 10
    },
    vercel: {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'not set',
      isProduction: process.env.NODE_ENV === 'production'
    },
    // 런타임 정보
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime()
    }
  };

  // 번역 API 테스트
  let translationTest = { status: 'not tested' };
  try {
    const testResponse = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '안녕하세요',
        targetLang: 'EN'
      })
    });
    
    if (testResponse.ok) {
      const data = await testResponse.json();
      translationTest = {
        status: 'success',
        translation: data.translation,
        cached: data.cached
      };
    } else {
      translationTest = {
        status: 'failed',
        statusCode: testResponse.status,
        error: await testResponse.text()
      };
    }
  } catch (error) {
    translationTest = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: envInfo,
    translationTest
  });
}
