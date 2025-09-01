'use client';

import { useRef, useEffect } from 'react';

/**
 * usePrevious - 이전 값을 추적하는 Hook
 * 
 * @param value - 추적할 값
 * @returns 이전 값
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * 
 * console.log(`Current: ${count}, Previous: ${prevCount}`);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
