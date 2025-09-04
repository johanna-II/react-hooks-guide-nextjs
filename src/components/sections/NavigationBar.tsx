'use client';

import React from 'react';

import type { NavigationProps } from '@/types/components';

interface NavigationBarProps extends NavigationProps {
  scrollToSection: (sectionId: string) => void;
}

/**
 * NavigationBar - ?곷떒 ?ㅻ퉬寃뚯씠??諛? * ?⑥씪 梨낆엫: ?뱀뀡 媛??ㅻ퉬寃뚯씠???쒓났
 */
export const NavigationBar: React.FC<NavigationBarProps> = React.memo(
  ({ items, activeItem, scrollToSection, className = '' }) => {
    return (
      <nav
        className={`fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md z-50 border-b border-slate-800 ${className}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 濡쒓퀬 */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">React Hooks Guide</span>
            </div>

            {/* ?ㅻ퉬寃뚯씠???꾩씠??*/}
            <div className="hidden md:flex space-x-8">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`
                  text-sm font-medium transition-colors
                  ${activeItem === item.id ? 'text-blue-400' : 'text-slate-300 hover:text-white'}
                `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }
);

NavigationBar.displayName = 'NavigationBar';
