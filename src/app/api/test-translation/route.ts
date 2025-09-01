import { NextResponse } from 'next/server';
import { getDeepLClient } from '@/lib/deepl-client';

export async function GET() {
  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL;
  
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'API key not configured',
      apiKey: 'Not set',
      apiUrl: apiUrl || 'Not set'
    });
  }
  
  try {
    const testText = 'Hook의 장점';
    
    const response = await fetch(apiUrl || 'https://api.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'text': testText,
        'target_lang': 'EN',
        'source_lang': 'KO'
      })
    });
    
    const responseText = await response.text();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      apiKeyLength: apiKey.length,
      apiKeyEnding: apiKey.slice(-5),
      apiUrl: apiUrl || 'Auto-detected',
      response: responseText,
      headers: Object.fromEntries(response.headers.entries())
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyLength: apiKey.length,
      apiKeyEnding: apiKey.slice(-5),
      apiUrl: apiUrl || 'Not set'
    });
  }
}
