/**
 * Custom Hooks 통합 export
 * 일관된 import 경로 제공
 */

export { useCounter } from './useCounter';
export { useTimer } from './useTimer';
export { useToggle } from './useToggle';

export { useDebounce } from './useDebounce';
export { usePrevious } from './usePrevious';
export { useThrottle, useThrottledCallback } from './useThrottle';

export { useAsync } from './useAsyncError';
export { useErrorBoundary } from './useErrorBoundary';

export { useIntersectionObserver } from './useIntersectionObserver';
export { useScrollToSection } from './useScrollToSection';
export { useSwipe } from './useSwipe';

export { useHTMLTranslations, useTranslations, useTranslationsNamespace } from './useTranslations';

export type {
  SwipeDirection,
  SwipeHandlers,
  SwipeState,
  UseCounterReturn,
  UseTimerReturn,
  UseToggleReturn,
} from '@/types/hooks';
