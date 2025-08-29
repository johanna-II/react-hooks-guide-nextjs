export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  'data-interactive'?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'gradient' | 'bordered';
}

export interface CodeBlockProps extends BaseComponentProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export interface DemoContainerProps extends BaseComponentProps {
  title: string;
  description?: string;
  tip?: string;
}

export type DemoType = 'counter' | 'toggle' | 'input' | 'list';
export type TouchDemoType = 'gesture' | 'swipe' | 'pinch' | 'drag';
