'use client';

import React from 'react';

export const MobileFooter: React.FC = React.memo(() => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            <span>React Hooks Guide</span>
          </div>
          <div className="text-xs text-slate-500">
            <span>Made with React</span>
          </div>
        </div>
      </div>
    </footer>
  );
});

MobileFooter.displayName = 'MobileFooter';