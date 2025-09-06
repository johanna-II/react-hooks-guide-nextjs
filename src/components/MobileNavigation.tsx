'use client';

import React, { useEffect, useRef, useState } from 'react';

import { NoSSR } from '@/components/common/NoSSR';
import { NAVIGATION_SECTIONS } from '@/constants/navigation';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { useTranslations } from '@/hooks/useTranslations';
import { trackEvent } from '@/utils/analytics';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange?: (sectionId: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = React.memo(
  ({ activeSection, onSectionChange }) => {
    const t = useTranslations();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const scrollToSection = useScrollToSection();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          const target = event.target as HTMLElement;
          if (!target.closest('button[aria-label]')) {
            setIsMenuOpen(false);
          }
        }
      };

      if (isMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, [isMenuOpen]);

    useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isMenuOpen) {
          setIsMenuOpen(false);
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [isMenuOpen]);

    const handleSectionClick = (sectionId: string) => {
      trackEvent('navigation_mobile_click', { section: sectionId });
      setIsMenuOpen(false);
      scrollToSection(sectionId);
      onSectionChange?.(sectionId);
    };

    return (
      <>
        {/* 햄버거 메뉴 버튼 */}
        <NoSSR>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="lg:hidden fixed top-3 right-3 sm:top-4 sm:right-4 z-40 p-2.5 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
            aria-label={t('navigation.menuOpen')}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center space-y-0.5 sm:space-y-1">
              <span
                className={`w-4 sm:w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-1 sm:translate-y-1.5' : ''
                }`}
              />
              <span
                className={`w-4 sm:w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-4 sm:w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-1 sm:-translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </NoSSR>

        {/* 모바일 메뉴 오버레이 */}
        <div
          className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* 배경 블러 - 클릭 시 메뉴 닫기 */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* 메뉴 패널 */}
          <div
            ref={menuRef}
            className={`absolute right-0 top-0 h-full w-64 sm:w-72 md:w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* 모바일에서는 로고 제거 - 공간 효율적 사용 */}

            {/* 네비게이션 링크 */}
            <nav className="p-3 sm:p-4 pt-6 sm:pt-8 space-y-1.5 sm:space-y-2">
              {NAVIGATION_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span
                      className="text-base sm:text-lg"
                      style={{
                        fontFamily:
                          '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
                      }}
                    >
                      {section.icon}
                    </span>
                    <span className="text-sm sm:text-base font-medium">{t(section.label)}</span>
                  </div>
                </button>
              ))}
            </nav>

            {/* 푸터 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-white/10">
              <div className="text-center text-xs sm:text-sm text-slate-400">
                <p>{t('navigation.tapToMove')}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

MobileNavigation.displayName = 'MobileNavigation';
