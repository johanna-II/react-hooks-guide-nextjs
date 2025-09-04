/**
 * DeepL API 디버깅 유틸리티
 * API 사용량 추적 및 문제 진단
 */

interface APIUsageStats {
  totalCharacters: number;
  requestCount: number;
  cacheHits: number;
  cacheMisses: number;
  lastReset: Date;
}

class DeepLDebugger {
  private static instance: DeepLDebugger;
  private stats: APIUsageStats = {
    totalCharacters: 0,
    requestCount: 0,
    cacheHits: 0,
    cacheMisses: 0,
    lastReset: new Date(),
  };

  private constructor() {
    // 매일 자정에 통계 리셋
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilReset = tomorrow.getTime() - now.getTime();
    setTimeout(() => {
      this.resetStats();
      // 이후 24시간마다 리셋
      setInterval(() => this.resetStats(), 24 * 60 * 60 * 1000);
    }, timeUntilReset);
  }

  static getInstance(): DeepLDebugger {
    if (!DeepLDebugger.instance) {
      DeepLDebugger.instance = new DeepLDebugger();
    }
    return DeepLDebugger.instance;
  }

  recordRequest(characterCount: number, wasCache: boolean = false) {
    if (wasCache) {
      this.stats.cacheHits++;
    } else {
      this.stats.cacheMisses++;
      this.stats.totalCharacters += characterCount;
      this.stats.requestCount++;
    }

    // 콘솔에 현재 상태 출력
    if (process.env.NODE_ENV === 'development') {
      console.info('DeepL API Usage:', {
        ...this.stats,
        avgCharsPerRequest:
          this.stats.requestCount > 0
            ? Math.round(this.stats.totalCharacters / this.stats.requestCount)
            : 0,
        cacheHitRate:
          this.stats.cacheHits + this.stats.cacheMisses > 0
            ? Math.round(
                (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses)) * 100
              )
            : 0,
      });
    }
  }

  getStats() {
    return { ...this.stats };
  }

  private resetStats() {
    this.stats = {
      totalCharacters: 0,
      requestCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      lastReset: new Date(),
    };
    console.info('DeepL usage stats reset');
  }

  // API 키 정보 확인
  static checkAPIKey(apiKey: string): {
    type: 'free' | 'pro';
    endpoint: string;
  } {
    if (apiKey.endsWith(':fx')) {
      return {
        type: 'free',
        endpoint: 'https://api-free.deepl.com/v2/translate',
      };
    }
    return {
      type: 'pro',
      endpoint: 'https://api.deepl.com/v2/translate',
    };
  }
}

export const deepLDebugger = DeepLDebugger.getInstance();
export const checkDeepLAPIKey = DeepLDebugger.checkAPIKey;
