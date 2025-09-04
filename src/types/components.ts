/**
 * 컴포넌트 Props 타입 정의
 * SOLID 원칙에 따라 인터페이스 분리
 */

import type { ReactNode, MouseEventHandler } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  'data-interactive'?: boolean;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends InteractiveComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  icon?: ReactNode;
  variant?: 'default' | 'glass' | 'solid';
}

export type InfoCardVariant = 'info' | 'warning' | 'success' | 'error';

export interface InfoCardProps extends BaseComponentProps {
  title: string;
  description?: string;
  variant?: InfoCardVariant;
  icon?: ReactNode;
}

export interface CodeBlockProps extends BaseComponentProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export interface DemoContainerProps extends BaseComponentProps {
  title: string;
  description?: string;
  tip?: string;
  controls?: ReactNode;
}

export interface SectionProps extends BaseComponentProps {
  id?: string;
  title?: string;
  subtitle?: string;
}

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

export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
}

export interface InputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface LayoutProps extends BaseComponentProps {
  sidebar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}
