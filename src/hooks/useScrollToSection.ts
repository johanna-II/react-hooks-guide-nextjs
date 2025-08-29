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
  
  const scrollToSection = useCallback((sectionId: string) => {
    if (typeof window === 'undefined') return;

    try {
      // 모바일 환경 감지
      const isMobile = window.innerWidth < 1024 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // 모바일에서는 스크롤 대신 섹션 변경 이벤트 발생
        const customEvent = new CustomEvent('sectionChange', { 
          detail: { sectionId } 
        });
        window.dispatchEvent(customEvent);
        return;
      }

      // 데스크톱 환경에서는 기존 스크롤 로직 사용
      const element = document.getElementById(sectionId);
      if (!element) {
        console.warn(`Section with id "${sectionId}" not found`);
        return;
      }

      // 헤더 높이 고려한 오프셋 계산
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 64; // 헤더 높이 동적 계산
      const additionalOffset = 16; // 추가 여백
      const totalOffset = headerHeight + additionalOffset;

      // 요소의 위치 계산
      const elementTop = element.offsetTop;
      const scrollPosition = elementTop - totalOffset;

      // 이전 애니메이션 취소
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // 즉시 스크롤 (애니메이션 없이)
      window.scrollTo(0, scrollPosition);

      // URL 해시 업데이트 (선택사항)
      if (history.pushState) {
        history.pushState(null, '', `#${sectionId}`);
      }

    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
  }, [animationIdRef]);

  return scrollToSection;
}
