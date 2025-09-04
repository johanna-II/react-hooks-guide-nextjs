'use client';

import { useState, useCallback } from 'react';

import type { UseCounterReturn } from '@/types/hooks';

interface UseCounterOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * useCounter - 카운터 상태 관리 Hook
 *
 * @param options - 카운터 설정 옵션
 * @returns 카운터 상태와 액션 함수들
 *
 * @example
 * ```tsx
 * const { count, increment, decrement, reset } = useCounter({
 *   initialValue: 0,
 *   min: 0,
 *   max: 10
 * });
 * ```
 */
export const useCounter = (options: UseCounterOptions = {}): UseCounterReturn => {
  const { initialValue = 0, min = -Infinity, max = Infinity, step = 1 } = options;

  const [count, setCount] = useState(() => Math.max(min, Math.min(initialValue, max)));

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = prev + step;
      return next > max ? prev : next;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const next = prev - step;
      return next < min ? prev : next;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(Math.max(min, Math.min(initialValue, max)));
  }, [initialValue, min, max]);

  const setValue = useCallback(
    (value: number) => {
      const validValue = Math.max(min, Math.min(value, max));
      setCount(validValue);
    },
    [min, max]
  );

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    min,
    max,
    step,
  };
};
