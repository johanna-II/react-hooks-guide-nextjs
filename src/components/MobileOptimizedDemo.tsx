'use client';

import React from 'react';

import { useCounter, useToggle } from '@/hooks';
import { useTranslations } from '@/hooks/useTranslations';

import { Button, DemoContainer } from './common';

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

const demoComponents: Record<DemoType, React.FC> = {
  counter: CounterDemo,
  toggle: ToggleDemo,
  input: InputDemo,
  list: ListDemo,
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
