import React from 'react';
import { ButtonProps } from '@/types/common';

const variantStyles = {
  primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl',
  secondary: 'bg-slate-700 text-white hover:bg-slate-600',
  danger: 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30',
  success: 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/50'
} as const;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
} as const;

export const Button: React.FC<ButtonProps> = React.memo(({
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
  const baseStyles = 'rounded-lg font-semibold transition-all active:scale-95 touch-manipulation';
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${widthStyle} ${disabledStyle} ${className}`.trim()}
      disabled={disabled}
      data-interactive={dataInteractive}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
