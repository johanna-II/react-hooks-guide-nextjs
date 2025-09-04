'use client';

import React, { useEffect, useRef, useState } from 'react';

import { NAVIGATION_SECTIONS } from '@/constants/navigation';
import { useTranslations } from '@/hooks/useTranslations';

interface MobileNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = React.memo(
  ({ activeSection, onSectionChange }) => {
    const t = useTranslations();
    // Track active section changes in development

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    const handleSectionClick = React.useCallback(
      (sectionId: string) => {
        onSectionChange(sectionId);
        setIsMenuOpen(false);
      },
      [onSectionChange]
    );

    return (
      <>
        {/* ?占쎈쾭占?硫붾돱 踰꾪듉 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
          aria-label={t('navigation.menuOpen')}
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

        {/* 紐⑤컮??硫붾돱 ?占쎈쾭?占쎌씠 */}
        <div
          className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* 諛곌꼍 釉붾윭 - ?占쎈┃ ??硫붾돱 ?占쎄린 */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* 硫붾돱 ?占쎈꼸 */}
          <div
            ref={menuRef}
            className={`absolute right-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* 紐⑤컮?占쎌뿉?占쎈뒗 ?占쎈뜑 ?占쎄굅 - 怨듦컙 ?占쎌쑉???占쎌슜 */}

            {/* ?占쎈퉬寃뚯씠??留곹겕 */}
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
                    <span
                      className="text-lg"
                      style={{
                        fontFamily:
                          '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
                      }}
                    >
                      {section.icon}
                    </span>
                    <span className="font-medium">{section.label}</span>
                  </div>
                </button>
              ))}
            </nav>

            {/* ?占쏀꽣 ?占쎈낫 */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <div className="text-center text-sm text-slate-400">
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
