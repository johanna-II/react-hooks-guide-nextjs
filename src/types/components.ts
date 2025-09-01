/**
 * 컴포넌트 Props 타입 정의
 * SOLID 원칙에 따라 인터페이스 분리
 */

import type { ReactNode, MouseEventHandler, HTMLAttributes } from 'react';

// 기본 컴포넌트 Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

// 인터랙티브 컴포넌트 Props
export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  'data-interactive'?: boolean;
}

// Button 컴포넌트 Props
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends InteractiveComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Card 컴포넌트 Props
export interface CardProps extends BaseComponentProps {
  title?: string;
  icon?: ReactNode;
  variant?: 'default' | 'glass' | 'solid';
}

// InfoCard 컴포넌트 Props
export type InfoCardVariant = 'info' | 'warning' | 'success' | 'error';

export interface InfoCardProps extends BaseComponentProps {
  title: string;
  description?: string;
  variant?: InfoCardVariant;
  icon?: ReactNode;
}

// CodeBlock 컴포넌트 Props
export interface CodeBlockProps extends BaseComponentProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

// DemoContainer 컴포넌트 Props
export interface DemoContainerProps extends BaseComponentProps {
  title: string;
  description?: string;
  tip?: string;
  controls?: ReactNode;
}

// Section 컴포넌트 Props
export interface SectionProps extends BaseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
}

// Navigation 컴포넌트 Props
export interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
}

export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  activeItem?: string;
  orientation?: 'horizontal' | 'vertical';
  onItemClick?: (itemId: string) => void;
}

// Form 컴포넌트 Props
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
}

export interface InputProps extends FormFieldProps, HTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
}

// Layout 컴포넌트 Props
export interface LayoutProps extends BaseComponentProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

// Modal 컴포넌트 Props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}
