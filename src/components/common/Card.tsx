import React from 'react';
import { CardProps } from '@/types/common';

const variantStyles = {
  default: 'bg-slate-800/50 border-slate-700/50',
  gradient: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50',
  bordered: 'bg-slate-900/50 border-white/10'
} as const;

export const Card: React.FC<CardProps> = React.memo(({
  children,
  title,
  description,
  variant = 'default',
  className = ''
}) => {
  const variantStyle = variantStyles[variant];
  
  return (
    <div className={`p-4 rounded-xl border ${variantStyle} ${className}`.trim()}>
      {title && (
        <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
      )}
      {description && (
        <p className="text-xs text-slate-300 mb-3">{description}</p>
      )}
      {children}
    </div>
  );
});

Card.displayName = 'Card';
