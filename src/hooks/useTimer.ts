import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  interval?: number;
  onTick?: (count: number) => void;
  autoStart?: boolean;
}

export const useTimer = (options: UseTimerOptions = {}) => {
  const { interval = 1000, onTick, autoStart = false } = options;
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCount((prev) => {
          const newCount = prev + 1;
          onTick?.(newCount);
          return newCount;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, interval, onTick]);

  const start = useCallback(() => setIsActive(true), []);
  const stop = useCallback(() => setIsActive(false), []);
  const reset = useCallback(() => {
    setCount(0);
    setIsActive(false);
  }, []);

  const toggle = useCallback(() => setIsActive((prev) => !prev), []);

  return { count, isActive, start, stop, reset, toggle };
};
