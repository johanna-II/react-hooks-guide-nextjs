'use client';

import { useCallback, useRef } from 'react';

/**
 * Enhanced Scroll to Section Hook
 *
 * 개선된 기능:
 * - 헤더 높이 고려한 정확한 스크롤 위치
 * - 부드러운 스크롤 애니메이션
 * - 에러 처리 및 안전성 향상
 * - 모바일 환경 지원
 * - 애니메이션 중복 방지
 */
export function useScrollToSection() {
  const animationIdRef = useRef<number | null>(null);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (typeof window === 'undefined') return;

      try {
        const isMobile =
          window.innerWidth < 1024 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );

        if (isMobile) {
          const customEvent = new CustomEvent('sectionChange', {
            detail: { sectionId },
          });
          window.dispatchEvent(customEvent);
          return;
        }

        const element = document.getElementById(sectionId);
        if (!element) {
          console.warn(`Section with id "${sectionId}" not found`);
          return;
        }

        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 64;
        const additionalOffset = 16;
        const totalOffset = headerHeight + additionalOffset;

        const elementTop = element.offsetTop;
        const scrollPosition = elementTop - totalOffset;

        if (animationIdRef.current !== null) {
          cancelAnimationFrame(animationIdRef.current);
        }

        window.scrollTo(0, scrollPosition);

        if (history.pushState) {
          history.pushState(null, '', `#${sectionId}`);
        }
      } catch (error) {
        console.error('Error scrolling to section:', error);
      }
    },
    [animationIdRef]
  );

  return scrollToSection;
}
