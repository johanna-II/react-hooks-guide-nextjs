'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useThrottle - 값 쓰로틀링 Hook
 *
 * @param value - 쓰로틀링할 값
 * @param limit - 제한 시간(ms)
 * @returns 쓰로틀링된 값
 *
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 100);
 * ```
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRun.current >= limit) {
          setThrottledValue(value);
          lastRun.current = Date.now();
        }
      },
      limit - (Date.now() - lastRun.current)
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * useThrottledCallback - 콜백 쓰로틀링 Hook
 *
 * @param callback - 쓰로틀링할 콜백 함수
 * @param limit - 제한 시간(ms)
 * @returns 쓰로틀링된 콜백 함수
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false);
  const lastArgs = useRef<Parameters<T> | undefined>(undefined);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;

        setTimeout(() => {
          inThrottle.current = false;
          if (lastArgs.current) {
            throttledCallback(...lastArgs.current);
            lastArgs.current = undefined;
          }
        }, limit);
      } else {
        lastArgs.current = args;
      }
    },
    [callback, limit]
  );

  return throttledCallback as T;
}
