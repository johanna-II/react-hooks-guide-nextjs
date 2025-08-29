'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MobileHooksGuide } from './MobileHooksGuide';
import { MobileFooter } from './MobileFooter';
import { Button } from './common';
import { useSwipe } from '@/hooks';
import { WHY_HOOKS_DATA } from '@/constants/navigation';
import dynamic from 'next/dynamic';

// 동적 로딩으로 번들 크기 최적화
const FormActionDemo = dynamic(() => import('./FormActionDemo'), { ssr: false });
const OptimizationDemos = dynamic(() => import('./OptimizationDemos'), { ssr: false });
const AdvancedPatterns = dynamic(() => import('./AdvancedPatterns'), { ssr: false });

interface MobileMainContentProps {
  activeSection: string;
  onSectionChange?: (sectionId: string) => void;
}

const SECTIONS: string[] = ['hero', 'introduction', 'why-hooks', 'core-hooks', 'rules', 'optimization', 'react19', 'advanced'];

const HeroSection: React.FC<{ onNavigate: (section: string) => void }> = React.memo(({ onNavigate }) => (
  <section id="hero" className="px-4 py-6 text-center">
    <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-3">
      HOOKS
    </h1>
    <h2 className="text-lg font-bold text-white mb-4">
      React의 미래를 만나다
    </h2>
    <p className="text-sm text-slate-300 leading-relaxed mb-6">
      React Hooks의 모든 것을 배우고, React 19의 혁신적인 기능들을 체험해보세요.
    </p>
    <div className="inline-flex flex-col gap-2">
      <Button
        onClick={() => onNavigate('introduction')}
        variant="primary"
        size="md"
      >
        시작하기
      </Button>
      <p className="text-xs text-slate-400 text-center">또는 좌측으로 스와이프</p>
    </div>
  </section>
));

HeroSection.displayName = 'HeroSection';

const IntroductionSection: React.FC = React.memo(() => (
  <section id="introduction" className="px-4 py-6">
    <h2 className="text-lg font-bold text-white text-center mb-4">
      초보자를 위한 React Hooks
    </h2>

    <div className="space-y-4">
      {[
        { title: 'Hook이란?', desc: '함수형 컴포넌트에서 React의 상태와 생명주기 기능을 사용할 수 있게 해주는 함수입니다.', color: 'blue' },
        { title: '왜 Hook을 사용할까?', desc: '컴포넌트 간에 상태 로직을 재사용하기 쉽고, 복잡한 컴포넌트를 더 쉽게 이해할 수 있습니다.', color: 'green' },
        { title: 'Hook의 장점', desc: '클래스 컴포넌트의 this 바인딩 문제가 없고, 컴포넌트를 더 작은 함수로 나누어 테스트하기 쉽습니다.', color: 'purple' }
      ].map((item, index) => (
        <div key={index} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <h3 className={`text-sm font-bold text-${item.color}-400 mb-1.5`}>{item.title}</h3>
          <p className="text-xs text-slate-300">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
));

IntroductionSection.displayName = 'IntroductionSection';

const WhyHooksSection: React.FC = React.memo(() => (
  <section id="why-hooks" className="px-4 py-6">
    <h2 className="text-lg font-bold text-white text-center mb-4">
      Hooks가 필요한 이유
    </h2>

    <div className="space-y-3">
      {WHY_HOOKS_DATA.map((item, index) => (
        <div key={index} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
          <p className="text-xs text-slate-300">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
));

WhyHooksSection.displayName = 'WhyHooksSection';

const CoreHooksSection: React.FC = React.memo(() => (
  <section id="core-hooks" className="px-4 py-6">
    <h2 className="text-lg font-bold text-white text-center mb-4">
      핵심 Hooks 가이드
    </h2>
    <MobileHooksGuide />
  </section>
));

CoreHooksSection.displayName = 'CoreHooksSection';

const RulesSection: React.FC = React.memo(() => (
  <section id="rules" className="px-4 py-6">
    <h2 className="text-lg font-bold text-white text-center mb-4">
      Hooks 사용 규칙
    </h2>

    <div className="space-y-4">
      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
        <h3 className="text-sm font-bold text-red-400 mb-2">하지 말아야 할 것</h3>
        <ul className="space-y-1.5 text-slate-300 text-xs">
          <li>• 조건문, 반복문 안에서 Hook 호출</li>
          <li>• 일반 JavaScript 함수에서 Hook 호출</li>
          <li>• 클래스 컴포넌트에서 Hook 사용</li>
        </ul>
      </div>

      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
        <h3 className="text-sm font-bold text-green-400 mb-2">올바른 사용법</h3>
        <ul className="space-y-1.5 text-slate-300 text-xs">
          <li>• React 함수형 컴포넌트 최상위에서만 호출</li>
          <li>• 커스텀 Hook 최상위에서만 호출</li>
          <li>• Hook 호출 순서는 항상 동일하게 유지</li>
        </ul>
      </div>
    </div>
  </section>
));

RulesSection.displayName = 'RulesSection';

const OptimizationSection: React.FC = React.memo(() => (
  <section id="optimization" className="px-4 py-6">
    <h2 className="text-lg font-bold text-white text-center mb-4">
      성능 최적화
    </h2>
    <OptimizationDemos />
  </section>
));

OptimizationSection.displayName = 'OptimizationSection';

const React19Section: React.FC = React.memo(() => (
  <section id="react19" className="px-4 py-6">
    <h2 className="text-lg font-bold text-white text-center mb-4">
      React 19 새로운 기능
    </h2>
    <FormActionDemo />
  </section>
));

React19Section.displayName = 'React19Section';

const AdvancedSection: React.FC = React.memo(() => (
  <section id="advanced" className="px-4 py-6">
    <h2 className="text-lg font-bold text-white text-center mb-4">
      고급 패턴 실험실
    </h2>
    <AdvancedPatterns />
  </section>
));

AdvancedSection.displayName = 'AdvancedSection';

export const MobileMainContent: React.FC<MobileMainContentProps> = React.memo(({
  activeSection,
  onSectionChange
}) => {
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = SECTIONS.indexOf(currentSection);

  // 섹션 변경 시 동기화
  useEffect(() => {
    if (activeSection !== currentSection) {
      setCurrentSection(activeSection);
      window.scrollTo(0, 0);
    }
  }, [activeSection, currentSection]);

  const navigateToSection = (sectionId: string) => {
    setIsTransitioning(true);
    window.scrollTo(0, 0);
    setTimeout(() => {
      setCurrentSection(sectionId);
      onSectionChange?.(sectionId);
      setIsTransitioning(false);
    }, 50);
  };

  // 스와이프 처리
  useSwipe(containerRef, {
    onSwipeLeft: () => {
      if (currentIndex < SECTIONS.length - 1) {
        navigateToSection(SECTIONS[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        navigateToSection(SECTIONS[currentIndex - 1]);
      }
    }
  });

  const renderSection = (): React.ReactElement | null => {
    switch (currentSection) {
      case 'hero':
        return <HeroSection onNavigate={navigateToSection} />;
      case 'introduction':
        return <IntroductionSection />;
      case 'why-hooks':
        return <WhyHooksSection />;
      case 'core-hooks':
        return <CoreHooksSection />;
      case 'rules':
        return <RulesSection />;
      case 'optimization':
        return <OptimizationSection />;
      case 'react19':
        return <React19Section />;
      case 'advanced':
        return <AdvancedSection />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full overflow-x-hidden pt-16 pb-20"
    >
      <div className={`max-w-screen-sm mx-auto px-2 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}>
        {renderSection()}
      </div>

      <MobileFooter />
    </div>
  );
});

MobileMainContent.displayName = 'MobileMainContent';