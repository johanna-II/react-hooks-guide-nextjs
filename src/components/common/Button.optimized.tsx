'use client';

import React from 'react';

import { cn } from '@/utils/classNames';

import type { ButtonProps } from '@/types/common';

const variantStyles = Object.freeze({
  primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl',
  secondary: 'bg-slate-700 text-white hover:bg-slate-600',
  danger: 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30',
  success: 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/50',
});

const sizeStyles = Object.freeze({
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
});

/**
 * Button 컴포넌트 - 최적화 버전
 * React.memo로 불필요한 리렌더링 방지
 */
export const Button = React.memo<ButtonProps>(
  ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    fullWidth = false,
    className = '',
    'data-interactive': dataInteractive = true,
    ...props
  }) => {
    const buttonClassName = React.useMemo(
      () =>
        cn(
          'rounded-lg font-semibold transition-all active:scale-95 touch-manipulation',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        ),
      [variant, size, fullWidth, disabled, className]
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
          onClick?.(event);
        }
      },
      [onClick, disabled]
    );

    return (
      <button
        onClick={handleClick}
        className={buttonClassName}
        disabled={disabled}
        data-interactive={dataInteractive}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
