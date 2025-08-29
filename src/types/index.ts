// Navigation Section 타입
export interface NavigationSection {
  id: string;
  label: string;
  icon: string;
}

// Hook Data 타입
export interface HookData {
  title: string;
  emoji: string;
  desc: string;
  detail: string;
  code: string;
  demo: React.ReactNode;
}

// Glass Card Props 타입
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

// Demo Box Props 타입
export interface DemoBoxProps {
  children: React.ReactNode;
  type?: 'error' | 'success' | 'default';
}

// Section Title Props 타입
export interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

// Info Card Props 타입
export interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
}

// Hooks Tabs Props 타입
export interface HooksTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Form Action Demo Props 타입
export type FormActionDemoProps = Record<never, never>;

// Optimization Demos Props 타입
export type OptimizationDemosProps = Record<never, never>;

// Advanced Patterns Props 타입
export type AdvancedPatternsProps = Record<never, never>;
