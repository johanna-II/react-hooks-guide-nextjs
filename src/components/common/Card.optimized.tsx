'use client';

import React from 'react';

import { cn } from '@/utils/classNames';

import type { CardProps } from '@/types/components';

const variantStyles = {
  default: 'bg-slate-800/50 border-slate-700/50',
  glass: 'bg-white/5 backdrop-blur-lg border-white/10',
  solid: 'bg-slate-800 border-slate-700',
} as const;

/**
 * Card 而댄룷?뚰듃 - 理쒖쟻??踰꾩쟾
 * ?쒖닔 而댄룷?뚰듃濡?援ы쁽
 */
export const Card = React.memo<CardProps>(
  ({ title, icon, variant = 'glass', children, className = '', ...props }) => {
    const cardClassName = React.useMemo(
      () => cn('p-6 rounded-2xl border transition-all', variantStyles[variant], className),
      [variant, className]
    );

    const titleSection = React.useMemo(() => {
      if (!title && !icon) return null;

      return (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3">{icon}</div>}
          {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
        </div>
      );
    }, [title, icon]);

    return (
      <div className={cardClassName} {...props}>
        {titleSection}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
