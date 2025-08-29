'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NAVIGATION_SECTIONS } from '@/constants/navigation';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = React.memo(({ 
  activeSection, 
  onSectionChange 
}) => {
  // 렌더링 로그를 조건부로 출력하여 중복 방지 (개발 환경에서만)
  const prevActiveSection = useRef(activeSection);
  if (process.env.NODE_ENV === 'development' && prevActiveSection.current !== activeSection) {
    console.log('MobileNavigation rendered with activeSection:', activeSection);
    prevActiveSection.current = activeSection;
  }
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 스와이프 제거 - 메뉴는 버튼 클릭으로만 제어

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // 스크롤 시 메뉴 자동 닫기
  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 150);
      }
      
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen, isScrolling]);

  const handleSectionClick = React.useCallback((sectionId: string) => {
    onSectionChange(sectionId);
    setIsMenuOpen(false);
  }, [onSectionChange]);

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
        aria-label="메뉴 열기"
        data-interactive
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
          <span 
            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span 
            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span 
            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </div>
      </button>

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
          className={`absolute right-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* 모바일에서는 헤더 제거 - 공간 효율적 사용 */}

          {/* 네비게이션 링크 */}
          <nav className="p-4 pt-8 space-y-2">
            {NAVIGATION_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* 푸터 정보 */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <div className="text-center text-sm text-slate-400">
              <p>탭하여 섹션을 이동하세요</p>
            </div>
          </div>
        </div>
      </div>


    </>
  );
});

MobileNavigation.displayName = 'MobileNavigation';
