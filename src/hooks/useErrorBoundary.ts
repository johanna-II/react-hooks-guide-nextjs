'use client';

import { useState, useCallback } from 'react';

/**
 * useErrorBoundary - React Error Boundary를 Hook으로 사용
 *
 * @example
 * ```tsx
 * const { resetError, captureError } = useErrorBoundary();
 *
 * try {
 *   somethingRisky();
 * } catch (error) {
 *   captureError(error);
 * }
 * ```
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error: unknown) => {
    const errorObject = error instanceof Error ? error : new Error(String(error));

    setError(errorObject);

    // Error Boundary로 전파
    throw errorObject;
  }, []);

  if (error) {
    throw error;
  }

  return { resetError, captureError };
}
