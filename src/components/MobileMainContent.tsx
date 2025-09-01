'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MobileHooksGuide } from './MobileHooksGuide';
import { MobileFooter } from './MobileFooter';
import { Button } from './common';
import { useSwipe } from '@/hooks';
import { WHY_HOOKS_DATA } from '@/constants/navigation';
import { useOptimizedTranslations } from '@/hooks/useOptimizedTranslations';
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

const HeroSection: React.FC<{ onNavigate: (section: string) => void }> = React.memo(({ onNavigate }) => {
  const t = useOptimizedTranslations();
  
  return (
    <section id="hero" className="px-4 py-6 text-center">
      <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-3">
        {t('hero.title')}
      </h1>
      <h2 className="text-lg font-bold text-white mb-4">
        {t('mobile.meetFuture')}
      </h2>
      <p className="text-sm text-slate-300 leading-relaxed mb-6">
        {t('mobile.learnEverything')}
      </p>
      <div className="inline-flex flex-col gap-2">
        <Button
          onClick={() => onNavigate('introduction')}
          variant="primary"
          size="md"
        >
          {t('mobile.startButton')}
        </Button>
        <p className="text-xs text-slate-400 text-center">{t('mobile.swipeHint')}</p>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

const IntroductionSection: React.FC = React.memo(() => {
  const t = useOptimizedTranslations();
  
  return (
    <section id="introduction" className="px-4 py-6">
      <h2 className="text-lg font-bold text-white text-center mb-4">
        {t('mobile.beginnerHooks')}
      </h2>

      <div className="space-y-4">
        {[
          { title: t('mobile.whatIsHook'), desc: t('mobile.whatIsHook.desc'), color: 'blue' },
          { title: t('mobile.whyUseHooks'), desc: t('mobile.whyUseHooks.desc'), color: 'green' },
          { title: t('mobile.hookAdvantages'), desc: t('mobile.hookAdvantages.desc'), color: 'purple' }
        ].map((item, index) => (
          <div key={index} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <h3 className={`text-sm font-bold text-${item.color}-400 mb-1.5`}>{item.title}</h3>
            <p className="text-xs text-slate-300">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

IntroductionSection.displayName = 'IntroductionSection';

const WhyHooksSection: React.FC = React.memo(() => {
  const t = useOptimizedTranslations();
  
  return (
    <section id="why-hooks" className="px-4 py-6">
      <h2 className="text-lg font-bold text-white text-center mb-4">
        {t('whyHooks.title')}
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
  );
});

WhyHooksSection.displayName = 'WhyHooksSection';

const CoreHooksSection: React.FC = React.memo(() => {
  const t = useOptimizedTranslations();
  
  return (
    <section id="core-hooks" className="px-4 py-6">
      <h2 className="text-lg font-bold text-white text-center mb-4">
        {t('guide.coreHooks.title')}
      </h2>
      <MobileHooksGuide />
    </section>
  );
});

CoreHooksSection.displayName = 'CoreHooksSection';

const RulesSection: React.FC = React.memo(() => {
  const t = useOptimizedTranslations();
  
  return (
    <section id="rules" className="px-4 py-6">
      <h2 className="text-lg font-bold text-white text-center mb-4">
        {t('guide.rules.title')}
      </h2>

      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-bold text-red-400 mb-2">{t('guide.rules.dontTitle')}</h3>
          <ul className="space-y-1.5 text-slate-300 text-xs">
            <li>• {t('guide.rules.dont.conditional')}</li>
            <li>• {t('guide.rules.dont.regular')}</li>
            <li>• {t('guide.rules.dont.class')}</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-bold text-green-400 mb-2">{t('guide.rules.doTitle')}</h3>
          <ul className="space-y-1.5 text-slate-300 text-xs">
            <li>• {t('guide.rules.do.topLevel')}</li>
            <li>• {t('guide.rules.do.customHook')}</li>
            <li>• {t('guide.rules.do.sameOrder')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
});

RulesSection.displayName = 'RulesSection';

const OptimizationSection: React.FC = React.memo(() => {
  const t = useOptimizedTranslations();
  
  return (
    <section id="optimization" className="px-4 py-6">
      <h2 className="text-lg font-bold text-white text-center mb-4">
        {t('guide.optimization.title')}
      </h2>
      <OptimizationDemos />
    </section>
  );
});

OptimizationSection.displayName = 'OptimizationSection';

const React19Section: React.FC = React.memo(() => {
  const t = useOptimizedTranslations();
  
  return (
    <section id="react19" className="px-4 py-6">
      <h2 className="text-lg font-bold text-white text-center mb-4">
        {t('react19.title')} {t('react19.subtitle')}
      </h2>
      <FormActionDemo />
    </section>
  );
});

React19Section.displayName = 'React19Section';

const AdvancedSection: React.FC = React.memo(() => {
  const t = useOptimizedTranslations();
  
  return (
    <section id="advanced" className="px-4 py-6">
      <h2 className="text-lg font-bold text-white text-center mb-4">
        {t('guide.advanced.title')}
      </h2>
      <AdvancedPatterns />
    </section>
  );
});

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