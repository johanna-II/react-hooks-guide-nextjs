/**
 * DeepL API 클라이언트
 */

import { deepLDebugger } from './deepl-debug';

interface TranslateOptions {
  text: string;
  targetLang: string;
  sourceLang?: string;
  preserveFormatting?: boolean;
  tagHandling?: 'html' | 'xml';
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

class DeepLClient {
  constructor(
    private apiKey: string,
    private apiUrl?: string
  ) {}

  async translate(options: TranslateOptions): Promise<string> {
    const {
      text,
      targetLang,
      sourceLang,
      preserveFormatting = true,
      tagHandling = 'html',
    } = options;

    const formData = new URLSearchParams();
    formData.append('auth_key', this.apiKey);
    formData.append('text', text);
    formData.append('target_lang', targetLang);

    if (sourceLang) {
      formData.append('source_lang', sourceLang);
    }

    if (preserveFormatting) {
      formData.append('preserve_formatting', '1');
    }

    if (tagHandling) {
      formData.append('tag_handling', tagHandling);
    }

    const response = await fetch(this.apiUrl || 'https://api.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data: DeepLResponse = await response.json();

    if (!data.translations || data.translations.length === 0) {
      throw new Error('No translation returned from DeepL');
    }

    // 디버그 정보 기록
    deepLDebugger.recordRequest(text.length, false);

    return data.translations[0].text;
  }

  async translateBatch(
    texts: string[],
    targetLang: string,
    sourceLang?: string
  ): Promise<string[]> {
    // DeepL API는 한 번에 여러 텍스트를 번역할 수 있습니다
    const formData = new URLSearchParams();
    formData.append('auth_key', this.apiKey);

    // 여러 텍스트를 추가
    texts.forEach((text) => {
      formData.append('text', text);
    });

    formData.append('target_lang', targetLang);

    if (sourceLang) {
      formData.append('source_lang', sourceLang);
    }

    formData.append('preserve_formatting', '1');
    formData.append('tag_handling', 'html');

    const response = await fetch(this.apiUrl || 'https://api.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data: DeepLResponse = await response.json();

    if (!data.translations || data.translations.length !== texts.length) {
      throw new Error('Invalid translation response from DeepL');
    }

    // 디버그 정보 기록
    const totalChars = texts.reduce((sum, text) => sum + text.length, 0);
    deepLDebugger.recordRequest(totalChars, false);

    return data.translations.map((t) => t.text);
  }
}

export function getDeepLClient(apiKey: string, apiUrl?: string): DeepLClient {
  return new DeepLClient(apiKey, apiUrl);
}
