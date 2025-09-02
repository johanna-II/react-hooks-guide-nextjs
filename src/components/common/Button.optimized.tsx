'use client';

import React from 'react';

import { cn, createVariantStyles } from '@/utils/classNames';

import type { ButtonProps } from '@/types/components';

// 스타일 상수는 컴포넌트 외부에 정의 (재생성 방지)
const variantStyles = createVariantStyles({
  primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl',
  secondary: 'bg-slate-700 text-white hover:bg-slate-600',
  danger: 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30',
  success: 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/50',
});

const sizeStyles = createVariantStyles({
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
    type = 'button',
    'data-interactive': dataInteractive = true,
    ...props
  }) => {
    // onClick 핸들러 최적화
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled && onClick) {
          onClick(e);
        }
      },
      [disabled, onClick]
    );

    // 클래스명 메모이제이션
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

    return (
      <button
        type={type}
        onClick={handleClick}
        className={buttonClassName}
        disabled={disabled}
        data-interactive={dataInteractive}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
