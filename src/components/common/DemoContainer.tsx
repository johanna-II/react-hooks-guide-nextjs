import React from 'react';

import { Card } from './Card';

import type { DemoContainerProps } from '@/types/common';

export const DemoContainer: React.FC<DemoContainerProps> = React.memo(
  ({ title, description, tip, children, className = '' }) => {
    return (
      <Card variant="default" className={className}>
        <h4 className="text-sm font-bold text-white mb-1.5">{title}</h4>
        {description && <p className="text-xs text-slate-300 mb-3">{description}</p>}

        <div data-interactive>{children}</div>

        {tip && <p className="text-xs text-slate-400 text-left mt-4">?뮕 {tip}</p>}
      </Card>
    );
  }
);

DemoContainer.displayName = 'DemoContainer';
