'use client';

import React, { useState, useEffect } from 'react';

import { useTranslations } from '@/hooks/useTranslations';

interface HookExample {
  title: string;
  description: string;
  code: string;
  demo?: React.ReactNode;
}

export default function HooksTabs() {
  const [activeTab, setActiveTab] = useState('useState');
  const t = useTranslations();

  const HOOK_EXAMPLES: Record<string, HookExample> = {
    useState: {
      title: 'useState',
      description: t('hooks.useState.descriptionDetail'),
      code: `const [count, setCount] = useState(0);

return (
  <div>
    <p>{t('demo.count')}: {count}</p>
    <button onClick={() => setCount(count + 1)}>
      {t('demo.increment')}
    </button>
  </div>
);`,
      demo: <UseStateDemo />,
    },
    useEffect: {
      title: 'useEffect',
      description: t('hooks.useEffect.descriptionDetail'),
      code: `useEffect(() => {
  document.title = \`Count: \${count}\`;
  
  return () => {
    // Cleanup function
    document.title = 'React App';
  };
}, [count]);`,
      demo: <UseEffectDemo />,
    },
    useRef: {
      title: 'useRef',
      description: t('hooks.useRef.descriptionDetail'),
      code: `const inputRef = useRef<HTMLInputElement>(null);

const focusInput = () => {
  inputRef.current?.focus();
};

return (
  <div>
    <input ref={inputRef} type="text" />
    <button onClick={focusInput}>Focus Input</button>
  </div>
);`,
      demo: <UseRefDemo />,
    },
    useCallback: {
      title: 'useCallback',
      description: t('hooks.useCallback.descriptionDetail'),
      code: `const memoizedCallback = useCallback(
  (increment) => {
    setCount(c => c + increment);
  },
  [] // dependency array
);`,
      demo: <UseCallbackDemo />,
    },
    useMemo: {
      title: 'useMemo',
      description: t('hooks.useMemo.descriptionDetail'),
      code: `const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);`,
      demo: <UseMemoDemo />,
    },
  };

  const currentExample = HOOK_EXAMPLES[activeTab];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(HOOK_EXAMPLES).map((hookName) => (
          <button
            key={hookName}
            onClick={() => setActiveTab(hookName)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              activeTab === hookName
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 border border-slate-700/50'
            }`}
          >
            {hookName}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-3">{currentExample.title}</h3>
          <p className="text-slate-300 leading-relaxed">{currentExample.description}</p>
        </div>

        {/* Code Example */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600/50 mb-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">?뮲 {t('hooks.codeExample')}</h4>
          <pre className="text-sm text-slate-300 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <code className="language-typescript">{currentExample.code}</code>
          </pre>
        </div>

        {/* Interactive Demo */}
        {currentExample.demo && (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-600/50">
            <h4 className="text-lg font-semibold text-green-400 mb-3">
              ?렜 {t('hooks.realTimeDemo')}
            </h4>
            <div className="p-4 bg-slate-800/50 rounded-lg">{currentExample.demo}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Demo Components
function UseStateDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const t = useTranslations();

  return (
    <div className="space-y-4" data-lpignore="true" data-form-type="other">
      <div className="text-center">
        <p className="text-2xl font-bold text-white mb-2">
          {t('demo.count')}: {count}
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 border border-red-500/30"
          >
            {t('demo.decrement')}
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 border border-green-500/30"
          >
            {t('demo.increment')}
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 border border-blue-500/30"
          >
            {t('demo.reset')}
          </button>
        </div>
      </div>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('hooks.typeSomething')}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
        />
        <p className="text-sm text-slate-400 mt-2">
          {t('mobile.text')}: {text}
        </p>
      </div>
    </div>
  );
}

function UseEffectDemo() {
  const [count, setCount] = useState(0);
  const [effectCount, setEffectCount] = useState(0);
  const t = useTranslations();

  useEffect(() => {
    setEffectCount((prev) => prev + 1);
    document.title = `Count: ${count}`;

    return () => {
      document.title = 'React Hooks Guide';
    };
  }, [count]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-white mb-2">
          {t('demo.count')}: {count}
        </p>
        <p className="text-sm text-slate-400 mb-3">
          {t('hooks.effectRunCount')}: {effectCount}
        </p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 border border-purple-500/30"
        >
          Increment
        </button>
      </div>
      <div className="text-xs text-slate-500 text-center">?뮕 {t('hooks.browserTabNotice')}</div>
    </div>
  );
}

function UseRefDemo() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focusCount, setFocusCount] = useState(0);
  const t = useTranslations();

  const focusInput = () => {
    inputRef.current?.focus();
    setFocusCount((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={inputRef}
          type="text"
          placeholder={t('hooks.clickToFocus')}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500/50"
        />
      </div>
      <div className="text-center">
        <button
          onClick={focusInput}
          className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 border border-green-500/30"
        >
          {t('demo.focusInput')}
        </button>
        <p className="text-sm text-slate-400 mt-2">
          {t('hooks.focusCount')}: {focusCount}
        </p>
      </div>
    </div>
  );
}

function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const t = useTranslations();

  const increment = React.useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const decrement = React.useCallback(() => {
    setCount((c) => c - 1);
  }, []);

  React.useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-white mb-2">
          {t('demo.count')}: {count}
        </p>
        <p className="text-sm text-slate-400 mb-3">
          {t('hooks.renderCount')}: {renderCount}
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={decrement}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 border border-red-500/30"
          >
            -
          </button>
          <button
            onClick={increment}
            className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 border border-green-500/30"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-xs text-slate-500 text-center">?뮕 {t('hooks.optimizationTip')}</div>
    </div>
  );
}

function UseMemoDemo() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [computeCount, setComputeCount] = useState(0);
  const t = useTranslations();

  const expensiveValue = React.useMemo(() => {
    setComputeCount((prev) => prev + 1);
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += a + b;
    }
    return result;
  }, [a, b]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">{t('hooks.valueA')}</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">{t('hooks.valueB')}</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-white mb-2">
          {t('hooks.calculationResult')}: {expensiveValue.toLocaleString()}
        </p>
        <p className="text-sm text-slate-400">
          {t('hooks.calculationCount')}: {computeCount}
        </p>
      </div>
      <div className="text-xs text-slate-500 text-center">?뮕 {t('hooks.memoTip')}</div>
    </div>
  );
}
