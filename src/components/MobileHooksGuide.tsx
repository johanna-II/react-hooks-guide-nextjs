'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MobileOptimizedDemo } from './MobileOptimizedDemo';
import { TouchOptimizedDemo } from './TouchOptimizedDemo';

const MOBILE_HOOKS_DATA = [
  {
    title: 'useState',
    description: '상태를 관리하는 가장 기본적인 Hook',
    demoType: 'counter' as const,
    example: `const [count, setCount] = useState(0);`,
    touchDemo: 'gesture' as const
  },
  {
    title: 'useEffect',
    description: '컴포넌트의 생명주기를 관리하는 Hook',
    demoType: 'toggle' as const,
    example: `useEffect(() => {
  // 컴포넌트가 마운트될 때 실행
}, []);`,
    touchDemo: 'swipe' as const
  },
  {
    title: 'useRef',
    description: 'DOM 요소에 직접 접근하거나 값을 저장하는 Hook',
    demoType: 'input' as const,
    example: `const inputRef = useRef(null);`,
    touchDemo: 'drag' as const
  },
  {
    title: 'useMemo',
    description: '계산 결과를 메모이제이션하여 성능을 최적화하는 Hook',
    demoType: 'list' as const,
    example: `const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);`,
    touchDemo: 'pinch' as const
  },
  {
    title: 'useCallback',
    description: '함수를 메모이제이션하여 성능을 최적화하는 Hook',
    demoType: 'counter' as const,
    example: `const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);`,
    touchDemo: 'gesture' as const
  }
];

const MobileHooksGuideComponent: React.FC = () => {
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
        <div ref={tabsContainerRef} className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
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
            <p className="text-[10px] text-slate-500">좌우 스크롤</p>
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
              <code className="language-typescript">
                {MOBILE_HOOKS_DATA[activeTab].example}
              </code>
            </pre>
          </div>
        </div>

        {/* 터치 최적화된 데모 */}
        <TouchOptimizedDemo
          title="터치 데모"
          description="터치 제스처로 직접 체험해보세요!"
          demoType={MOBILE_HOOKS_DATA[activeTab].touchDemo}
        />

        {/* 기존 모바일 최적화 데모 */}
        <MobileOptimizedDemo
          title="기본 데모"
          description="기본 기능을 체험해보세요!"
          demoType={MOBILE_HOOKS_DATA[activeTab].demoType}
        />
      </div>

      {/* 모바일 사용 팁 */}
      <div className="bg-blue-950/30 p-3 rounded-xl border border-blue-500/20">
        <h4 className="text-xs font-bold text-blue-400 mb-1.5">사용 팁</h4>
        <ul className="text-[11px] text-blue-300 space-y-0.5">
          <li>• 터치 제스처로 다양한 인터랙션을 체험해보세요</li>
          <li>• 탭 버튼을 눌러 다른 Hook을 확인하세요</li>
          <li>• 핀치 제스처로 확대/축소를 해보세요</li>
          <li>• 드래그로 요소를 움직여보세요</li>
        </ul>
      </div>
    </div>
  );
};

export const MobileHooksGuide = React.memo(MobileHooksGuideComponent);
MobileHooksGuide.displayName = 'MobileHooksGuide';
