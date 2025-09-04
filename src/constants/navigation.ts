import type { NavigationSection } from '@/types';

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  { id: 'hero', label: 'navigation.home', icon: '🏠' },
  { id: 'why-hooks', label: 'whyHooks.title', icon: '🎯' },
  { id: 'core-hooks', label: 'navigation.hooks', icon: '⚡' },
  { id: 'rules', label: 'rules.title', icon: '📋' },
  { id: 'optimization', label: 'navigation.optimization', icon: '🚀' },
  { id: 'react19', label: 'form.react19.benefits', icon: '✨' },
  { id: 'advanced', label: 'navigation.patterns', icon: '💎' },
];

export const WHY_HOOKS_DATA = [
  {
    titleKey: 'whyHooks.wrapperHell.title',
    icon: '🌀',
    descKey: 'whyHooks.wrapperHell.desc',
    detailKey: 'whyHooks.wrapperHell.detail',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    titleKey: 'whyHooks.lifecycleSimplification.title',
    icon: '♻️',
    descKey: 'whyHooks.lifecycleSimplification.desc',
    detailKey: 'whyHooks.lifecycleSimplification.detail',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    titleKey: 'whyHooks.thisRemoval.title',
    icon: '🎯',
    descKey: 'whyHooks.thisRemoval.desc',
    detailKey: 'whyHooks.thisRemoval.detail',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    titleKey: 'whyHooks.logicReuse.title',
    icon: '🔄',
    descKey: 'whyHooks.logicReuse.desc',
    detailKey: 'whyHooks.logicReuse.detail',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    titleKey: 'whyHooks.typescriptFriendly.title',
    icon: '🔒',
    descKey: 'whyHooks.typescriptFriendly.desc',
    detailKey: 'whyHooks.typescriptFriendly.detail',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    titleKey: 'whyHooks.performanceOptimization.title',
    icon: '⚡',
    descKey: 'whyHooks.performanceOptimization.desc',
    detailKey: 'whyHooks.performanceOptimization.detail',
    gradient: 'from-yellow-500 to-orange-500',
  },
];
