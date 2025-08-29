import { NavigationSection } from '@/types';

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  { id: 'hero', label: 'Home', icon: '🏠' },
  { id: 'why-hooks', label: 'Why Hooks?', icon: '🎯' },
  { id: 'core-hooks', label: 'Core Hooks', icon: '⚡' },
  { id: 'rules', label: 'Rules', icon: '📋' },
  { id: 'optimization', label: 'Performance', icon: '🚀' },
  { id: 'react19', label: 'React 19', icon: '✨' },
  { id: 'advanced', label: 'Advanced', icon: '💎' }
];

export const WHY_HOOKS_DATA = [
  { 
    title: 'Wrapper Hell 해결', 
    icon: '🌀',
    desc: 'HOC와 Render Props로 인한 복잡한 component tree를 단순화합니다.',
    detail: '마치 러시아 인형처럼 겹겹이 싸인 코드를 풀어서 깔끔하게 정리해줍니다.',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    title: 'Lifecycle 단순화', 
    icon: '♻️',
    desc: '여러 lifecycle method에 흩어진 logic을 useEffect 하나로 통합합니다.',
    detail: '출생, 성장, 소멸 같은 복잡한 생명주기를 하나의 함수로 간단하게 관리합니다.',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    title: 'this 제거', 
    icon: '🎯',
    desc: 'JavaScript의 혼란스러운 this binding 없이 깔끔한 functional component를 작성합니다.',
    detail: '누가 "나"인지 헷갈리지 않고 명확하게 코드를 작성할 수 있습니다.',
    gradient: 'from-blue-500 to-purple-500'
  },
  { 
    title: 'Logic 재사용', 
    icon: '🔄',
    desc: 'Custom Hook으로 상태 관련 로직을 쉽게 재사용하고 공유할 수 있습니다.',
    detail: '레고 블록처럼 필요한 기능을 조립하고, 다른 프로젝트에서도 똑같이 사용할 수 있습니다.',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    title: 'TypeScript 친화적', 
    icon: '🔒',
    desc: '타입 추론과 제네릭을 활용하여 타입 안전한 코드를 작성할 수 있습니다.',
    detail: '런타임 에러를 컴파일 타임에 미리 잡아내어 더욱 안정적인 애플리케이션을 구축할 수 있습니다.',
    gradient: 'from-indigo-500 to-blue-500'
  },
  { 
    title: '성능 최적화', 
    icon: '⚡',
    desc: 'React.memo, useMemo, useCallback으로 불필요한 리렌더링을 방지합니다.',
    detail: '메모이제이션을 통해 계산 결과를 재사용하여 사용자 경험을 크게 향상시킵니다.',
    gradient: 'from-yellow-500 to-orange-500'
  }
];
