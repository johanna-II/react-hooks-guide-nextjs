export interface NavigationSection {
  id: string;
  label: string;
  icon: string;
}

export interface HookData {
  title: string;
  emoji: string;
  desc: string;
  detail: string;
  code: string;
  demo: React.ReactNode;
}

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export interface DemoBoxProps {
  children: React.ReactNode;
  type?: 'error' | 'success' | 'default';
}

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
}

export interface HooksTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export type FormActionDemoProps = Record<never, never>;

export type OptimizationDemosProps = Record<never, never>;

export type AdvancedPatternsProps = Record<never, never>;
