/**
 * Custom Hooks 통합 export
 * 일관된 import 경로 제공
 */

// 상태 관리 Hooks
export { useCounter } from './useCounter';
export { useToggle } from './useToggle';
export { useTimer } from './useTimer';

// 성능 최적화 Hooks
export { useDebounce } from './useDebounce';
export { useThrottle, useThrottledCallback } from './useThrottle';
export { usePrevious } from './usePrevious';

// 비동기 작업 Hooks
export { useAsync } from './useAsyncError';
export { useErrorBoundary } from './useErrorBoundary';

// DOM 관련 Hooks
export { useIntersectionObserver } from './useIntersectionObserver';
export { useScrollToSection } from './useScrollToSection';
export { useSwipe } from './useSwipe';

// 번역 관련 Hooks
export { useOptimizedTranslations } from './useOptimizedTranslations';

// 타입 re-export
export type {
  UseCounterReturn,
  UseTimerReturn,
  UseToggleReturn,
  SwipeDirection,
  SwipeState,
  SwipeHandlers,
} from '@/types/hooks';
