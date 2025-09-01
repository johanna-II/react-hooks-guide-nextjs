// Node.js Agent type
interface HttpsAgent {
  destroy(): void;
}

// Node.js에서만 사용되는 Agent
let httpsAgent: HttpsAgent | undefined;

// Suppress ESLint warnings for this block
/* eslint-disable @typescript-eslint/no-require-imports */
if (typeof window === 'undefined') {
  try {
    const { Agent } = require('https');
    httpsAgent = new Agent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 10,
      maxFreeSockets: 5,
      timeout: 60000,
      scheduling: 'lifo'
    });
  } catch {
    // Edge runtime에서는 https 모듈을 사용할 수 없음
    // Edge runtime에서는 native fetch 사용
  }
}
/* eslint-enable @typescript-eslint/no-require-imports */

// Fetch with Keep-Alive support
const fetchWithAgent = async (url: string, options: RequestInit) => {
  // Next.js Edge Runtime이나 브라우저에서는 keepalive 옵션 사용
  return fetch(url, { ...options, keepalive: true });
};

export interface DeepLTranslateOptions {
  text: string;
  targetLang: 'EN' | 'EN-US' | 'EN-GB' | 'JA';
  sourceLang?: 'KO';
  preserveFormatting?: boolean;
  tagHandling?: 'html' | 'xml';
}

export interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

class DeepLClient {
  public apiKey: string;
  private apiUrl: string;
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private readonly minRequestInterval = 100; // 100ms between requests

  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || 'https://api-free.deepl.com/v2/translate';
  }

  async translate(options: DeepLTranslateOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.executeTranslation(options);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        // Rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
          await new Promise(resolve => 
            setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
          );
        }

        await request();
        this.lastRequestTime = Date.now();
      }
    }

    this.isProcessing = false;
  }

  private async executeTranslation(
    options: DeepLTranslateOptions,
    retryCount = 0
  ): Promise<string> {
    const maxRetries = 3;
    
    try {
      const formData = new URLSearchParams({
        text: options.text,
        target_lang: options.targetLang,
        source_lang: options.sourceLang || 'KO',
        preserve_formatting: options.preserveFormatting ? '1' : '0',
        tag_handling: options.tagHandling || 'html'
      });

      const response = await fetchWithAgent(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'DeepL-React-Client/1.0'
        },
        body: formData.toString()
      });

      // Handle rate limiting with exponential backoff
      if (response.status === 429 || response.status === 503) {
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          // Rate limited. Retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.executeTranslation(options, retryCount + 1);
        }
        throw new Error(`DeepL API rate limit exceeded after ${maxRetries} retries`);
      }

      // Handle server errors with retry
      if (response.status >= 500) {
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s
          console.warn(`Server error ${response.status}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.executeTranslation(options, retryCount + 1);
        }
        throw new Error(`DeepL API server error: ${response.status}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepL API error ${response.status}: ${errorText}`);
      }

      const data: DeepLResponse = await response.json();
      return data.translations[0].text;
      
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred during translation');
    }
  }

  // Batch translation for efficiency (최대 50개씩)
  async translateBatch(
    texts: string[],
    targetLang: 'EN' | 'EN-US' | 'EN-GB' | 'JA',
    sourceLang: 'KO' = 'KO'
  ): Promise<string[]> {
    const MAX_BATCH_SIZE = 50; // DeepL API 제한
    const results: string[] = [];
    
    // 50개씩 나누어 처리
    for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
      const batch = texts.slice(i, i + MAX_BATCH_SIZE);
      const formData = new URLSearchParams();
      
      batch.forEach(text => formData.append('text', text));
      formData.append('target_lang', targetLang);
      formData.append('source_lang', sourceLang);
      formData.append('preserve_formatting', '1');
      formData.append('tag_handling', 'html');

      try {
        const response = await fetchWithAgent(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'DeepL-React-Client/1.0'
          },
          body: formData.toString()
        });

        if (response.status === 429) {
          // Rate limit - 잠시 대기 후 재시도
          await new Promise(resolve => setTimeout(resolve, 2000));
          i -= MAX_BATCH_SIZE; // 같은 배치 재시도
          continue;
        }

        if (!response.ok) {
          throw new Error(`DeepL API error: ${response.status}`);
        }

        const data: DeepLResponse = await response.json();
        results.push(...data.translations.map(t => t.text));
        
        // 다음 배치 전 짧은 대기
        if (i + MAX_BATCH_SIZE < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Batch translation failed:', error);
        // Fallback to individual translations
        const fallbackResults = await Promise.all(
          batch.map(text => 
            this.translate({ text, targetLang, sourceLang })
          )
        );
        results.push(...fallbackResults);
      }
    }
    
    return results;
  }

  // Cleanup method
  destroy() {
    if (httpsAgent) {
      httpsAgent.destroy();
    }
  }
}

// Singleton instance
let deeplClient: DeepLClient | null = null;

export function getDeepLClient(apiKey: string, apiUrl?: string): DeepLClient {
  if (!deeplClient || deeplClient.apiKey !== apiKey) {
    if (deeplClient) {
      deeplClient.destroy();
    }
    
    // API URL 자동 감지
    let finalApiUrl = apiUrl;
    if (!finalApiUrl || finalApiUrl === 'https://api-free.deepl.com/v2/translate') {
      // API 키 형식으로 무료/유료 구분
      // 무료 API 키는 :fx 로 끝남
      if (apiKey.endsWith(':fx')) {
        finalApiUrl = 'https://api-free.deepl.com/v2/translate';
      } else {
        // 403 오류가 발생했으므로 유료 API로 전환
        finalApiUrl = 'https://api.deepl.com/v2/translate';
      }
      // Using detected DeepL API endpoint
    }
    
    deeplClient = new DeepLClient(apiKey, finalApiUrl);
  }
  return deeplClient;
}
