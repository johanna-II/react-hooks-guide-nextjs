'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';

import { WHY_HOOKS_DATA } from '@/constants/navigation';
import { useSwipe } from '@/hooks';
import { useTranslations } from '@/hooks/useTranslations';

import { Button } from './common';
import { MobileFooter } from './MobileFooter';
import { MobileHooksGuide } from './MobileHooksGuide';

const FormActionDemo = dynamic(() => import('./FormActionDemo'), { ssr: false });
const OptimizationDemos = dynamic(() => import('./OptimizationDemos'), { ssr: false });

interface MobileMainContentProps {
  activeSection: string;
  onSectionChange?: (sectionId: string) => void;
}

const SECTIONS: string[] = [
  'hero',
  'introduction',
  'why-hooks',
  'core-hooks',
  'rules',
  'optimization',
  'react19',
];

const HeroSection: React.FC<{ onNavigate: (section: string) => void }> = React.memo(
  ({ onNavigate }) => {
    const t = useTranslations();

    return (
      <section id="hero" className="px-3 sm:px-4 py-4 sm:py-6 md:py-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2 sm:mb-3">
          {t('hero.title')}
        </h1>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
          {t('mobile.meetFuture')}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed mb-4 sm:mb-6">
          {t('mobile.learnEverything')}
        </p>
        <div className="inline-flex flex-col gap-2">
          <Button onClick={() => onNavigate('introduction')} variant="primary" size="md">
            {t('mobile.startButton')}
          </Button>
          <p className="text-xs text-slate-400 text-center">{t('mobile.swipeHint')}</p>
        </div>
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';

const IntroductionSection: React.FC = React.memo(() => {
  const t = useTranslations();

  return (
    <section id="introduction" className="px-3 sm:px-4 py-4 sm:py-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center mb-3 sm:mb-4">
        {t('mobile.beginnerHooks')}
      </h2>

      <div className="space-y-4">
        {[
          { title: t('mobile.whatIsHook.title'), desc: t('mobile.whatIsHook.desc'), color: 'blue' },
          {
            title: t('mobile.whyUseHooks.title'),
            desc: t('mobile.whyUseHooks.desc'),
            color: 'green',
          },
          {
            title: t('mobile.hookAdvantages.title'),
            desc: t('mobile.hookAdvantages.desc'),
            color: 'purple',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl border border-slate-700/50"
          >
            <h3
              className={`text-xs sm:text-sm md:text-base font-bold text-${item.color}-400 mb-1 sm:mb-1.5`}
            >
              {item.title}
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-300">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

IntroductionSection.displayName = 'IntroductionSection';

const WhyHooksSection: React.FC = React.memo(() => {
  const t = useTranslations();

  return (
    <section id="why-hooks" className="px-3 sm:px-4 py-4 sm:py-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center mb-3 sm:mb-4">
        {t('whyHooks.title')}
      </h2>

      <div className="space-y-3">
        {WHY_HOOKS_DATA.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl border border-slate-700/50"
          >
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-0.5 sm:mb-1">
              {t(item.titleKey)}
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-300">{t(item.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

WhyHooksSection.displayName = 'WhyHooksSection';

const CoreHooksSection: React.FC = React.memo(() => {
  const t = useTranslations();

  return (
    <section id="core-hooks" className="px-3 sm:px-4 py-4 sm:py-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center mb-3 sm:mb-4">
        {t('guide.coreHooks.title')}
      </h2>
      <MobileHooksGuide />
    </section>
  );
});

CoreHooksSection.displayName = 'CoreHooksSection';

const RulesSection: React.FC = React.memo(() => {
  const t = useTranslations();

  return (
    <section id="rules" className="px-3 sm:px-4 py-4 sm:py-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center mb-3 sm:mb-4">
        {t('guide.rules.title')}
      </h2>

      <div className="space-y-3 sm:space-y-4">
        <div className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl border border-slate-700/50">
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-red-400 mb-1.5 sm:mb-2">
            {t('guide.rules.dontTitle')}
          </h3>
          <ul className="space-y-1 sm:space-y-1.5 text-slate-300 text-[11px] sm:text-xs md:text-sm">
            <li>• {t('guide.rules.dont.conditional')}</li>
            <li>• {t('guide.rules.dont.regular')}</li>
            <li>• {t('guide.rules.dont.class')}</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-2.5 sm:p-3 md:p-4 rounded-xl border border-slate-700/50">
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-green-400 mb-1.5 sm:mb-2">
            {t('guide.rules.doTitle')}
          </h3>
          <ul className="space-y-1 sm:space-y-1.5 text-slate-300 text-[11px] sm:text-xs md:text-sm">
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
  const t = useTranslations();

  return (
    <section id="optimization" className="px-3 sm:px-4 py-4 sm:py-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center mb-3 sm:mb-4">
        {t('guide.optimization.title')}
      </h2>
      <OptimizationDemos />
    </section>
  );
});

OptimizationSection.displayName = 'OptimizationSection';

const React19Section: React.FC = React.memo(() => {
  const t = useTranslations();

  return (
    <section id="react19" className="px-3 sm:px-4 py-4 sm:py-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-white text-center mb-3 sm:mb-4">
        {t('react19.title')} {t('react19.subtitle')}
      </h2>
      <FormActionDemo />
    </section>
  );
});

React19Section.displayName = 'React19Section';

export const MobileMainContent: React.FC<MobileMainContentProps> = React.memo(
  ({ activeSection, onSectionChange }) => {
    const [currentSection, setCurrentSection] = useState(activeSection);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const currentIndex = SECTIONS.indexOf(currentSection);

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
      },
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
        default:
          return null;
      }
    };

    return (
      <div
        ref={containerRef}
        className="min-h-screen w-full overflow-x-hidden pt-14 sm:pt-16 pb-16 sm:pb-20"
      >
        <div
          className={`w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto px-3 sm:px-4 md:px-6 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {renderSection()}
        </div>

        <MobileFooter />
      </div>
    );
  }
);

MobileMainContent.displayName = 'MobileMainContent';
