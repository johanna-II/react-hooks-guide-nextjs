/**
 * Vercel KV를 사용한 영구 캐시 구현
 * 서버 재시작 후에도 번역 캐시 유지
 */

import { kv } from '@vercel/kv';

interface CacheData {
  value: string;
  timestamp: number;
}

class PersistentCache {
  private readonly CACHE_PREFIX = 'translation_cache:';
  private readonly CACHE_TTL = 30 * 24 * 60 * 60; // 30일 (초 단위)
  private memoryCache: Map<string, CacheData> = new Map();
  private initialized = false;

  async init() {
    if (this.initialized) return;

    // Vercel KV 환경 변수 확인
    const hasKVConfig = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

    if (!hasKVConfig) {
      console.warn('Vercel KV not configured, using memory-only cache');
      this.memoryCache = new Map();
      this.initialized = true;
      return;
    }

    try {
      // Vercel KV에서 모든 캐시 키 가져오기
      const keys = await kv.keys(`${this.CACHE_PREFIX}*`);

      // 각 키의 데이터를 메모리 캐시에 로드
      for (const key of keys) {
        const data = await kv.get<CacheData>(key);
        if (data) {
          const cacheKey = key.replace(this.CACHE_PREFIX, '');
          this.memoryCache.set(cacheKey, data);
        }
      }

      // 30일 이상 된 캐시 제거
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      for (const [key, data] of this.memoryCache.entries()) {
        if (now - data.timestamp > thirtyDays) {
          this.memoryCache.delete(key);
          await kv.del(`${this.CACHE_PREFIX}${key}`);
        }
      }

      console.info(`Loaded ${this.memoryCache.size} cached translations from Vercel KV`);
    } catch (error) {
      console.error('Failed to initialize Vercel KV cache:', error);
      this.memoryCache = new Map();
    }

    this.initialized = true;
  }

  async get(key: string): Promise<string | null> {
    await this.init();

    // 메모리 캐시에서 먼저 확인
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem) {
      return memoryItem.value;
    }

    // Vercel KV가 설정되지 않은 경우 메모리 캐시만 사용
    const hasKVConfig = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    if (!hasKVConfig) {
      return null;
    }

    // Vercel KV에서 확인
    try {
      const data = await kv.get<CacheData>(`${this.CACHE_PREFIX}${key}`);
      if (data) {
        // 메모리 캐시에도 저장
        this.memoryCache.set(key, data);
        return data.value;
      }
    } catch (error) {
      console.error('Failed to get from Vercel KV:', error);
    }

    return null;
  }

  async set(key: string, value: string) {
    await this.init();

    const cacheData: CacheData = {
      value,
      timestamp: Date.now(),
    };

    // 메모리 캐시에 저장
    this.memoryCache.set(key, cacheData);

    // Vercel KV가 설정된 경우에만 저장
    const hasKVConfig = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    if (hasKVConfig) {
      try {
        await kv.setex(`${this.CACHE_PREFIX}${key}`, this.CACHE_TTL, cacheData);
      } catch (error) {
        console.error('Failed to save to Vercel KV:', error);
      }
    }
  }

  async getStats() {
    await this.init();

    let totalSize = 0;
    for (const [, data] of this.memoryCache) {
      totalSize += JSON.stringify(data).length;
    }

    return {
      itemCount: this.memoryCache.size,
      sizeInBytes: totalSize,
      sizeInMB: (totalSize / 1024 / 1024).toFixed(2),
    };
  }

  async clear() {
    await this.init();

    // 메모리 캐시 클리어
    this.memoryCache.clear();

    // Vercel KV가 설정된 경우에만 KV 캐시도 클리어
    const hasKVConfig = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    if (hasKVConfig) {
      try {
        // Vercel KV에서 모든 캐시 키 삭제
        const keys = await kv.keys(`${this.CACHE_PREFIX}*`);
        if (keys.length > 0) {
          await kv.del(...keys);
        }
      } catch (error) {
        console.error('Failed to clear Vercel KV cache:', error);
      }
    }

    console.info('Cache cleared successfully');
  }
}

export const persistentCache = new PersistentCache();
