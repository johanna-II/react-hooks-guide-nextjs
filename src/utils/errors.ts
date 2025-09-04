/**
 * 에러 처리 유틸리티
 * 일관된 에러 처리 및 로깅
 */

/**
 * 사용자 정의 에러 클래스
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * 에러 타입 가드
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * 에러를 안전하게 문자열로 변환
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

/**
 * 에러 로깅 함수
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const message = getErrorMessage(error);

  console.error(`[${timestamp}]${context ? ` [${context}]` : ''} Error:`, {
    message,
    error,
    stack: error instanceof Error ? error.stack : undefined,
  });
}

/**
 * 비동기 함수 에러 처리 래퍼
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options?: {
    fallback?: unknown;
    onError?: (error: unknown) => void;
    context?: string;
  }
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, options?.context);
      options?.onError?.(error);

      if (options?.fallback !== undefined) {
        return options.fallback;
      }

      throw error;
    }
  }) as T;
}

/**
 * 재시도 로직을 포함한 비동기 함수 실행
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoff?: boolean;
    onRetry?: (error: unknown, attempt: number) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, backoff = true, onRetry } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
        onRetry?.(error, attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

/**
 * 타임아웃을 가진 Promise 실행
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutError = new AppError('Operation timed out', 'TIMEOUT')
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(timeoutError), timeoutMs)),
  ]);
}
