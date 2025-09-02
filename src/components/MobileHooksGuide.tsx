'use client';

import React, { useState, useRef, useEffect } from 'react';

import { useOptimizedTranslations } from '@/hooks/useOptimizedTranslations';

import { MobileOptimizedDemo } from './MobileOptimizedDemo';
import { TouchOptimizedDemo } from './TouchOptimizedDemo';

const MobileHooksGuideComponent: React.FC = () => {
  const t = useOptimizedTranslations();

  const MOBILE_HOOKS_DATA = [
    {
      title: 'useState',
      description: t('mobile.useState.description'),
      demoType: 'counter' as const,
      example: `const [count, setCount] = useState(0);`,
      touchDemo: 'gesture' as const,
    },
    {
      title: 'useEffect',
      description: t('mobile.useEffect.description'),
      demoType: 'toggle' as const,
      example: `useEffect(() => {
  // 컴포넌트가 마운트될 때 실행
}, []);`,
      touchDemo: 'swipe' as const,
    },
    {
      title: 'useRef',
      description: t('mobile.useRef.description'),
      demoType: 'input' as const,
      example: `const inputRef = useRef(null);`,
      touchDemo: 'drag' as const,
    },
    {
      title: 'useMemo',
      description: t('mobile.useMemo.description'),
      demoType: 'list' as const,
      example: `const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);`,
      touchDemo: 'pinch' as const,
    },
    {
      title: 'useCallback',
      description: t('mobile.useCallback.description'),
      demoType: 'counter' as const,
      example: `const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);`,
      touchDemo: 'gesture' as const,
    },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // 활성 탭이 변경될 때 자동 스크롤
  useEffect(() => {
    if (tabsContainerRef.current) {
      const buttons = tabsContainerRef.current.querySelectorAll('button');
      const activeButton = buttons[activeTab];
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab]);

  // 스크롤 시 힌트 숨기기
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (showScrollHint) {
        setShowScrollHint(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [showScrollHint]);

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 - 모바일 최적화 */}
      <div className="relative">
        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4"
        >
          {MOBILE_HOOKS_DATA.map((hook, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(index);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              data-interactive
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 touch-manipulation active:scale-95 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50'
              }`}
            >
              {hook.title}
            </button>
          ))}
        </div>

        {/* 스크롤 힌트 */}
        {showScrollHint && (
          <div className="text-center mt-1 animate-fade-in">
            <p className="text-[10px] text-slate-500">{t('touch.scrollHint')}</p>
          </div>
        )}
      </div>

      {/* 선택된 Hook 내용 */}
      <div className="space-y-4">
        {/* Hook 설명 카드 */}
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <h3 className="text-base font-bold text-white mb-1.5">
            {MOBILE_HOOKS_DATA[activeTab].title}
          </h3>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            {MOBILE_HOOKS_DATA[activeTab].description}
          </p>

          {/* 코드 예시 */}
          <div className="bg-slate-900/50 p-2.5 rounded-lg mb-3">
            <pre className="text-[11px] text-slate-300 font-mono overflow-x-auto">
              <code className="language-typescript">{MOBILE_HOOKS_DATA[activeTab].example}</code>
            </pre>
          </div>
        </div>

        {/* 터치 최적화된 데모 */}
        <TouchOptimizedDemo
          title={t('mobile.touchDemo')}
          description={t('mobile.touchDemo.description')}
          demoType={MOBILE_HOOKS_DATA[activeTab].touchDemo}
        />

        {/* 기존 모바일 최적화 데모 */}
        <MobileOptimizedDemo
          title={t('mobile.basicDemo')}
          description={t('mobile.basicDemo.description')}
          demoType={MOBILE_HOOKS_DATA[activeTab].demoType}
        />
      </div>

      {/* 모바일 사용 팁 */}
      <div className="bg-blue-950/30 p-3 rounded-xl border border-blue-500/20">
        <h4 className="text-xs font-bold text-blue-400 mb-1.5">{t('touch.useTip.title')}</h4>
        <ul className="text-[11px] text-blue-300 space-y-0.5">
          <li>• {t('touch.useTip.gesture')}</li>
          <li>• {t('touch.useTip.tab')}</li>
          <li>• {t('touch.useTip.pinch')}</li>
          <li>• {t('touch.useTip.drag')}</li>
        </ul>
      </div>
    </div>
  );
};

export const MobileHooksGuide = React.memo(MobileHooksGuideComponent);
MobileHooksGuide.displayName = 'MobileHooksGuide';
