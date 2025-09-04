/**
 * 성능 관련 유틸리티 함수
 * 디바운스, 쓰로틀, 메모이제이션 등
 */

/**
 * 디바운스 함수
 * @param fn - 디바운스할 함수
 * @param delay - 지연 시간(ms)
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 쓰로틀 함수
 * @param fn - 쓰로틀할 함수
 * @param limit - 제한 시간(ms)
 * @returns 쓰로틀된 함수
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 메모이제이션 함수
 * @param fn - 메모이제이션할 함수
 * @param getKey - 캐시 키 생성 함수
 * @returns 메모이제이션된 함수
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);

    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result as ReturnType<T>);

    return result;
  }) as T;
}

/**
 * RAF(RequestAnimationFrame) 쓰로틀
 * 애니메이션 성능 최적화용
 */
export function rafThrottle<T extends (...args: unknown[]) => unknown>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function rafThrottled(...args: Parameters<T>) {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  };
}

/**
 * 성능 측정 래퍼
 * @param fn - 측정할 함수
 * @param label - 성능 측정 레이블
 */
export function measurePerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  label: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();

    try {
      const result = fn(...args);

      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          console.info(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
        });
      }

      const duration = performance.now() - start;
      console.info(`[Performance] ${label}: ${duration.toFixed(2)}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[Performance] ${label} failed after ${duration.toFixed(2)}ms`);
      throw error;
    }
  }) as T;
}
