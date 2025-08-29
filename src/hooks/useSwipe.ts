import { useRef, useEffect } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  angleThreshold?: number;
}

export const useSwipe = (
  elementRef: React.RefObject<HTMLElement | null>,
  options: SwipeOptions = {}
) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 80,
    angleThreshold = 2 // 수평 이동이 수직 이동의 2배 이상
  } = options;

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isSwipingRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, input, textarea, select, a, [data-interactive]');
      
      if (!isInteractive) {
        const touch = e.touches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
        touchStartTime.current = Date.now();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === 0) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;
      
      if (!isSwipingRef.current && Math.abs(deltaX) > 10) {
        if (Math.abs(deltaX) > Math.abs(deltaY) * angleThreshold) {
          isSwipingRef.current = true;
          e.preventDefault();
        }
      }
      
      if (isSwipingRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === 0) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX.current - touchEndX;
      const diffY = touchStartY.current - touchEndY;
      const swipeDuration = Date.now() - touchStartTime.current;
      const velocity = Math.abs(diffX) / swipeDuration;
      
      if ((velocity > 0.3 && Math.abs(diffX) > 30) || Math.abs(diffX) > threshold) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            onSwipeLeft?.();
          } else {
            onSwipeRight?.();
          }
        } else {
          if (diffY > 0) {
            onSwipeUp?.();
          } else {
            onSwipeDown?.();
          }
        }
      }
      
      touchStartX.current = 0;
      touchStartY.current = 0;
      isSwipingRef.current = false;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, angleThreshold]);
};
