'use client';

import { useState, useCallback } from 'react';
import { logError } from '@/utils/errors';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseAsyncOptions<T = unknown> {
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
  retries?: number;
  retryDelay?: number;
}

/**
 * useAsync - 비동기 작업 관리 Hook
 * 에러 처리, 로딩 상태, 재시도 로직 포함
 * 
 * @example
 * ```tsx
 * const { execute, data, error, isLoading } = useAsync(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * });
 * ```
 */
export function useAsync<T = unknown, P = void>(
  asyncFunction: (params?: P) => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false
  });

  const execute = useCallback(
    async (params?: P) => {
      setState({ data: null, error: null, isLoading: true });

      let retries = options.retries || 0;
      let lastError: Error | null = null;

      while (retries >= 0) {
        try {
          const result = await asyncFunction(params);
          setState({ data: result, error: null, isLoading: false });
          options.onSuccess?.(result);
          return result;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          logError(lastError, 'useAsync');
          
          if (retries > 0) {
            await new Promise(resolve => 
              setTimeout(resolve, options.retryDelay || 1000)
            );
            retries--;
          } else {
            setState({ data: null, error: lastError, isLoading: false });
            options.onError?.(lastError);
            throw lastError;
          }
        }
      }
    },
    [asyncFunction, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    execute,
    reset,
    ...state
  };
}
