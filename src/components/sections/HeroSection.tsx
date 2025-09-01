'use client';

import React from 'react';
import { ArrowRight, Code2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/common';
import type { SectionProps } from '@/types/components';

interface HeroSectionProps extends SectionProps {
  title: string;
  subtitle: string;
  description: string;
  onGetStarted: () => void;
  onViewCode: () => void;
}

/**
 * HeroSection - 메인 히어로 섹션 컴포넌트
 * 단일 책임: 히어로 섹션 UI 렌더링
 */
export const HeroSection: React.FC<HeroSectionProps> = React.memo(({
  title,
  subtitle,
  description,
  onGetStarted,
  onViewCode,
  className = ''
}) => {
  return (
    <section 
      className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${className}`}
      id="hero"
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* 타이틀 섹션 */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-xl sm:text-2xl text-slate-400 mt-4">
            {subtitle}
          </p>
        </div>

        {/* 설명 섹션 */}
        <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
          {description}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            className="group"
          >
            시작하기
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onViewCode}
          >
            <Code2 className="w-5 h-5 mr-2" />
            코드 보기
          </Button>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
