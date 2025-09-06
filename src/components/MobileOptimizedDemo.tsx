'use client';

import React, { useCallback, useState } from 'react';

import { useCounter, useToggle } from '@/hooks';
import { useTranslations } from '@/hooks/useTranslations';

import { Button, DemoContainer, NoSSR } from './common';

import type { DemoType } from '@/types/common';

interface MobileOptimizedDemoProps {
  title: string;
  description: string;
  demoType: DemoType;
}

const CounterDemo: React.FC = React.memo(() => {
  const { count, increment, decrement } = useCounter();
  const t = useTranslations();

  return (
    <div className="text-center space-y-4">
      <div className="text-3xl font-bold text-white">{count}</div>
      <div className="flex gap-3 justify-center">
        <Button onClick={decrement} variant="danger" size="sm">
          - {t('demo.decrease')}
        </Button>
        <Button onClick={increment} variant="success" size="sm">
          + {t('demo.increase')}
        </Button>
      </div>
    </div>
  );
});

CounterDemo.displayName = 'CounterDemo';

const ToggleDemo: React.FC = React.memo(() => {
  const [isOn, { toggle }] = useToggle();

  return (
    <div className="text-center space-y-4">
      <div className={`text-3xl transition-all ${isOn ? 'text-green-400' : 'text-slate-400'}`}>
        {isOn ? '💡' : '🌑'}
      </div>
      <Button onClick={toggle} variant={isOn ? 'success' : 'secondary'} size="sm">
        {isOn ? 'ON' : 'OFF'}
      </Button>
    </div>
  );
});

ToggleDemo.displayName = 'ToggleDemo';

const InputDemo: React.FC = React.memo(() => {
  const [value, setValue] = React.useState('');
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('mobile.typingPlaceholder')}
        className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-interactive
      />
      <div className="p-3 bg-slate-800 rounded-lg">
        <p className="text-slate-400 text-xs">{t('mobile.inputLabel')}</p>
        <p className="text-sm font-bold text-blue-400">{value || t('mobile.noInput')}</p>
      </div>
    </div>
  );
});

InputDemo.displayName = 'InputDemo';

const ListDemo: React.FC = React.memo(() => {
  const [items, setItems] = React.useState<string[]>([]);
  const [newItem, setNewItem] = React.useState('');
  const t = useTranslations();

  const addItem = () => {
    if (newItem.trim()) {
      setItems((prev) => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={t('demo.newItem')}
          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-interactive
        />
        <Button onClick={addItem} variant="primary" size="sm">
          {t('demo.add')}
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-4">{t('demo.noItems')}</p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
            >
              <span className="text-white text-sm">{item}</span>
              <Button onClick={() => removeItem(index)} variant="danger" size="sm">
                {t('demo.delete')}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

ListDemo.displayName = 'ListDemo';

// 렌더링 표시기 컴포넌트
const RenderIndicator: React.FC<{ count: number }> = ({ count }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <span className="text-[10px] text-slate-500">Renders: -</span>;

  return <span className="text-[10px] text-slate-500">Renders: {count}</span>;
};

// 자식 컴포넌트: onClick prop이 변경될 때만 리렌더링
// 실제로 onClick을 사용하지는 않지만, prop 변경 감지를 위해 받음
const ExpensiveComponent: React.FC<{ onClick: () => void; label: string; color: string }> =
  React.memo(({ onClick: _onClick, label, color }) => {
    const renderCount = React.useRef(0);
    renderCount.current += 1;

    return (
      <div className="bg-slate-800 p-3 rounded-lg text-center">
        <div className={`w-16 h-16 ${color} rounded-full mx-auto mb-2`} />
        <p className="text-[11px] text-slate-300 font-semibold mb-1">{label}</p>
        <NoSSR>
          <RenderIndicator count={renderCount.current} />
        </NoSSR>
      </div>
    );
  });

ExpensiveComponent.displayName = 'ExpensiveComponent';

const CallbackDemo: React.FC = React.memo(() => {
  const [, forceUpdate] = useState(0);
  const t = useTranslations();

  // ❌ Without useCallback: 매번 새로운 함수 생성
  const handleClickNormal = () => {
    // Normal button clicked
  };

  // ✅ With useCallback: 한 번만 생성되는 함수
  const handleClickOptimized = useCallback(() => {
    // Optimized button clicked
  }, []);

  return (
    <div className="space-y-3">
      {/* 부모 리렌더링 트리거 */}
      <div className="text-center mb-4">
        <Button
          onClick={() => forceUpdate((prev) => prev + 1)}
          variant="secondary"
          size="sm"
          fullWidth
        >
          {t('demo.useCallback.triggerRerender')}
        </Button>
        <p className="text-[10px] text-slate-400 mt-1">{t('demo.useCallback.clickToSee')}</p>
      </div>

      {/* 컴포넌트 비교 - 렌더링 횟수 확인 */}
      <div className="grid grid-cols-2 gap-3">
        <ExpensiveComponent
          onClick={handleClickNormal}
          label="❌ Without useCallback"
          color="bg-red-500"
        />
        <ExpensiveComponent
          onClick={handleClickOptimized}
          label="✅ With useCallback"
          color="bg-green-500"
        />
      </div>

      {/* 설명 */}
      <div className="bg-slate-800/50 p-2 rounded-lg text-[10px] text-slate-300 space-y-1">
        <p className="font-semibold text-xs mb-1">💡 {t('demo.useCallback.difference')}:</p>
        <p>• {t('demo.useCallback.whenClick')}:</p>
        <p className="ml-3">• 🔴 {t('demo.useCallback.leftSide')}</p>
        <p className="ml-3">• 🟢 {t('demo.useCallback.rightSide')}</p>
      </div>
    </div>
  );
});

CallbackDemo.displayName = 'CallbackDemo';

const demoComponents: Record<DemoType, React.FC> = {
  counter: CounterDemo,
  toggle: ToggleDemo,
  input: InputDemo,
  list: ListDemo,
  callback: CallbackDemo,
};

export const MobileOptimizedDemo: React.FC<MobileOptimizedDemoProps> = React.memo(
  ({ title, description, demoType }) => {
    const DemoComponent = demoComponents[demoType];

    if (!DemoComponent) {
      return null;
    }

    return (
      <DemoContainer title={title} description={description}>
        <DemoComponent />
      </DemoContainer>
    );
  }
);

MobileOptimizedDemo.displayName = 'MobileOptimizedDemo';
