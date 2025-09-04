import { NextResponse } from 'next/server';

import { checkDeepLAPIKey } from '@/lib/deepl-debug';

/**
 * DeepL API status and usage check endpoint
 */
export async function GET() {
  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL;

  if (!apiKey) {
    return NextResponse.json({
      error: 'API key not configured',
      status: 'error',
    });
  }

  const keyInfo = checkDeepLAPIKey(apiKey);

  // DeepL Usage API call (Pro account only)
  try {
    const usageResponse = await fetch('https://api.deepl.com/v2/usage', {
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
      },
    });

    if (usageResponse.ok) {
      const usage = await usageResponse.json();
      return NextResponse.json({
        status: 'ok',
        keyType: keyInfo.type,
        recommendedEndpoint: keyInfo.endpoint,
        currentEndpoint: apiUrl,
        usage: {
          characterCount: usage.character_count,
          characterLimit: usage.character_limit,
          percentageUsed: Math.round((usage.character_count / usage.character_limit) * 100),
        },
      });
    }
  } catch {
    // silently fail
  }

  // free account or error
  return NextResponse.json({
    status: 'ok',
    keyType: keyInfo.type,
    recommendedEndpoint: keyInfo.endpoint,
    currentEndpoint: apiUrl,
    usage:
      keyInfo.type === 'free'
        ? {
            message: 'Free plan: 500,000 characters/month',
            note: 'Usage API not available for free accounts',
          }
        : {
            error: 'Could not fetch usage data',
          },
  });
}
