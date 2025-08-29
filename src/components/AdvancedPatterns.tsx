'use client';

import React, { useState } from 'react';
import { UseCallbackDemo, UseRefDemo, UseEffectDemo, UseMemoDemo } from './demos';

const demos = [
  { id: 'useCallback', component: UseCallbackDemo, label: 'useCallback' },
  { id: 'useRef', component: UseRefDemo, label: 'useRef' },
  { id: 'useEffect', component: UseEffectDemo, label: 'useEffect' },
  { id: 'useMemo', component: UseMemoDemo, label: 'useMemo' },
] as const;

export default function AdvancedPatterns() {
  const [activeTab, setActiveTab] = useState<typeof demos[number]['id']>('useCallback');

  const ActiveComponent = demos.find(demo => demo.id === activeTab)?.component || UseCallbackDemo;

  return (
    <div className="space-y-8">
      {/* 탭 네비게이션 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActiveTab(demo.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === demo.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
            }`}
          >
            {demo.label}
          </button>
        ))}
      </div>

      {/* 선택된 데모 컴포넌트 */}
      <div className="max-w-2xl mx-auto">
        <ActiveComponent />
      </div>
    </div>
  );
}