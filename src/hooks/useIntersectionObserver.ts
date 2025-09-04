'use client';

import { useState, useEffect } from 'react';

/**
 * Enhanced Intersection Observer Hook for Section Navigation
 *
 * 개선된 기능:
 * - 더 정확한 섹션 감지
 * - IntersectionObserver와 스크롤 이벤트 조합
 * - 헤더 높이 고려한 오프셋 계산
 */
export function useIntersectionObserver(selector: string) {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const navigationSections = [
      'hero',
      'why-hooks',
      'core-hooks',
      'rules',
      'optimization',
      'react19',
      'advanced',
    ];

    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 64;
    const offset = headerHeight + 80;

    const observerOptions = {
      rootMargin: `-${offset}px 0px -50% 0px`,
      threshold: [0, 0.1, 0.5, 1],
    };

    const visibleSections = new Set<string>();
    let isAtBottom = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute('id');
        if (!sectionId || !navigationSections.includes(sectionId)) return;

        if (entry.isIntersecting) {
          visibleSections.add(sectionId);
        } else {
          visibleSections.delete(sectionId);
        }
      });

      if (!isAtBottom && visibleSections.size > 0) {
        const visibleArray = Array.from(visibleSections);
        const sortedSections = navigationSections.filter((id) => visibleArray.includes(id));
        if (sortedSections.length > 0) {
          setActiveSection(sortedSections[0]);
        }
      }
    }, observerOptions);

    navigationSections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollPosition + windowHeight >= documentHeight - 100) {
        isAtBottom = true;
        setActiveSection('advanced');
      } else {
        isAtBottom = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selector]);

  return activeSection;
}
