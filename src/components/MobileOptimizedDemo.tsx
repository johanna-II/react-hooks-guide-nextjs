'use client';

import React from 'react';
import { DemoContainer, Button } from './common';
import { useCounter, useToggle } from '@/hooks';
import { DemoType } from '@/types/common';

interface MobileOptimizedDemoProps {
  title: string;
  description: string;
  demoType: DemoType;
}

const CounterDemo: React.FC = React.memo(() => {
  const { count, increment, decrement } = useCounter();

  return (
    <div className="text-center space-y-4">
      <div className="text-3xl font-bold text-white">{count}</div>
      <div className="flex gap-3 justify-center">
        <Button onClick={decrement} variant="danger" size="sm">
          - 감소
        </Button>
        <Button onClick={increment} variant="success" size="sm">
          + 증가
        </Button>
      </div>
    </div>
  );
});

CounterDemo.displayName = 'CounterDemo';

const ToggleDemo: React.FC = React.memo(() => {
  const [isOn, toggle] = useToggle();

  return (
    <div className="text-center space-y-4">
      <div className={`text-3xl transition-all ${isOn ? 'text-green-400' : 'text-slate-400'}`}>
        {isOn ? '🟢' : '⚫'}
      </div>
      <Button
        onClick={toggle}
        variant={isOn ? 'success' : 'secondary'}
        size="sm"
      >
        {isOn ? 'ON' : 'OFF'}
      </Button>
    </div>
  );
});

ToggleDemo.displayName = 'ToggleDemo';

const InputDemo: React.FC = React.memo(() => {
  const [value, setValue] = React.useState('');

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="타이핑해보세요..."
        className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-interactive
      />
      <div className="p-3 bg-slate-800 rounded-lg">
        <p className="text-slate-400 text-xs">입력된 값:</p>
        <p className="text-sm font-bold text-blue-400">{value || '입력 없음'}</p>
      </div>
    </div>
  );
});

InputDemo.displayName = 'InputDemo';

const ListDemo: React.FC = React.memo(() => {
  const [items, setItems] = React.useState<string[]>([]);
  const [newItem, setNewItem] = React.useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="새 항목..."
          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-interactive
        />
        <Button onClick={addItem} variant="primary" size="sm">
          추가
        </Button>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-4">아직 항목이 없습니다</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <span className="text-white text-sm">{item}</span>
              <Button
                onClick={() => removeItem(index)}
                variant="danger"
                size="sm"
              >
                삭제
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

export const MobileOptimizedDemo: React.FC<MobileOptimizedDemoProps> = React.memo(({
  title,
  description,
  demoType
}) => {
  const DemoComponent = demoComponents[demoType];
  
  if (!DemoComponent) {
    return null;
  }

  return (
    <DemoContainer title={title} description={description}>
      <DemoComponent />
    </DemoContainer>
  );
});

MobileOptimizedDemo.displayName = 'MobileOptimizedDemo';