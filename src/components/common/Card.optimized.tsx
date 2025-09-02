'use client';

import React from 'react';

import { cn } from '@/utils/classNames';

import type { CardProps } from '@/types/components';

// 변형 스타일 상수
const variantStyles = {
  default: 'bg-slate-800/50 border-slate-700/50',
  glass: 'bg-white/5 backdrop-blur-lg border-white/10',
  solid: 'bg-slate-800 border-slate-700',
} as const;

/**
 * Card 컴포넌트 - 최적화 버전
 * 순수 컴포넌트로 구현
 */
export const Card = React.memo<CardProps>(
  ({ title, icon, variant = 'glass', children, className = '', ...props }) => {
    // 클래스명 메모이제이션
    const cardClassName = React.useMemo(
      () => cn('p-6 rounded-2xl border transition-all', variantStyles[variant], className),
      [variant, className]
    );

    // 타이틀 섹션 렌더링 최적화
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
