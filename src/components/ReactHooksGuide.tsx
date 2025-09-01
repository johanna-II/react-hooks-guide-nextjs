'use client';

import React from 'react';
import { useOptimizedTranslations } from '@/hooks/useOptimizedTranslations';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { NAVIGATION_SECTIONS, WHY_HOOKS_DATA } from '@/constants/navigation';
import { trackEvent, measurePagePerformance } from '@/utils/analytics';
import HooksTabs from './HooksTabs';
import FormActionDemo from './FormActionDemo';
import OptimizationDemos from './OptimizationDemos';
import AdvancedPatterns from './AdvancedPatterns';
import { MobileNavigation } from './MobileNavigation';
import { MobileMainContent } from './MobileMainContent';
import { LanguageSwitcher } from './common';
import { HTMLText } from '@/utils/html-parser';

const ReactHooksGuide: React.FC = React.memo(() => {
  const t = useOptimizedTranslations();
  const activeSection = useIntersectionObserver('section[id]');
  const scrollToSection = useScrollToSection();
  // 초기 모바일 상태를 서버와 클라이언트에서 동일하게 설정
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024;
  });
  const [mobileActiveSection, setMobileActiveSection] = React.useState('hero');
  
  // 페이지 성능 측정
  React.useEffect(() => {
    measurePagePerformance();
  }, []);
  
  // 콜백 함수들을 useCallback으로 최적화 (Hook 규칙 준수)
  const handleNavigationSectionChange = React.useCallback((sectionId: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Section change requested:', sectionId);
    }
    setMobileActiveSection(sectionId);
    // 모바일에서는 scrollToSection 호출하지 않음 (MobileMainContent가 스크롤 처리)
  }, []);
  
  const handleMainContentSectionChange = React.useCallback((sectionId: string) => {
    setMobileActiveSection(sectionId);
  }, []);

  React.useEffect(() => {
    const checkMobile = () => {
      // User Agent를 우선적으로 확인 (PC 브라우저인지 확인)
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Chrome DevTools 모바일 에뮬레이션 감지
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 화면 크기 확인 (태블릿 이하)
      const isSmallScreen = window.innerWidth < 1024;
      
      // 모바일 판정: User Agent가 모바일이거나, 터치 디바이스이면서 작은 화면
      const isMobileDevice = isMobileUserAgent || (isTouchDevice && isSmallScreen);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Device Detection:', { 
          isMobileUserAgent,
          isTouchDevice,
          isSmallScreen,
          isMobileDevice,
          userAgent: navigator.userAgent 
        });
      }
      
      if (isMobile !== isMobileDevice) {
        trackEvent.deviceSwitch(isMobileDevice ? 'mobile' : 'desktop');
      }
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // isMobile 의도적으로 제외 - 리사이즈 이벤트 핸들러 내부에서 상태 확인

  // 모든 Hook 호출 후 early return 및 렌더링 로직
  if (!activeSection) {
    return null; // Early return pattern
  }

  // 모바일 환경에서는 완전히 다른 레이아웃 제공
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* 모바일 환경 표시 제거 - 깔끔한 UI */}
        
        {/* 모바일 전용 네비게이션 */}
        <MobileNavigation 
          activeSection={mobileActiveSection} 
          onSectionChange={handleNavigationSectionChange} 
        />
        
        {/* 모바일 전용 메인 콘텐츠 */}
        <MobileMainContent 
          activeSection={mobileActiveSection} 
          onSectionChange={handleMainContentSectionChange}
        />
        
        {/* 모바일에서 activeSection을 업데이트하기 위한 이벤트 리스너 */}
        <div style={{ display: 'none' }}>
          {NAVIGATION_SECTIONS.map((section) => (
            <div key={section.id} id={section.id} />
          ))}
        </div>
      </div>
    );
  }

  

  // 데스크톱 환경 - 기존 레이아웃 유지
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-white/10 shadow-2xl">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4 min-w-0 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>⚛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                  React Hooks
                </h1>
                <span className="text-xs text-slate-400 px-3 py-1 bg-slate-800/50 rounded-full">
                  {t('guide.completeGuide')}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex justify-end ml-6">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <LanguageSwitcher className="mr-2" />
                {NAVIGATION_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      scrollToSection(section.id);
                      trackEvent.navigation(section.id);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section id="hero" className="text-center mb-24 scroll-mt-20">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-6 animate-pulse">
            {t('hero.title')}
          </h1>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-8 px-4">
            {t.rich('hero.subtitle', {
              span: (chunks) => (
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {chunks}
                </span>
              )
            })}
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            {t('hero.description')}
          </p>
        </section>

        {/* Introduction for Beginners */}
        <section id="introduction" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl border border-blue-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {t('guide.beginnerTitle')}
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="grid gap-4">
                <div className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700/50 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">{t('guide.whatIsHook')}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed flex-grow">
                    {t('guide.whatIsHookDesc')}
                  </p>
                </div>
                
                <div className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700/50 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-green-400 mb-2">{t('guide.whyUseHooks')}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed flex-grow">
                    {t('guide.whyUseHooksDesc')}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700/50 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">{t('guide.hookAdvantages')}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed flex-grow">
                    {t('guide.hookAdvantagesDesc')}
                  </p>
                </div>
                
                <div className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700/50 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-orange-400 mb-2">{t('guide.whenToUse')}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed flex-grow">
                    {t('guide.whenToUse.desc2')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Hooks Section */}
        <section id="why-hooks" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl border border-green-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {t('guide.whyHooksNeeded')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {WHY_HOOKS_DATA.map((item, index) => (
                <div key={index} className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105 group h-full flex flex-col">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>{item.icon}</div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{t(item.titleKey)}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-1.5 sm:mb-2 flex-grow">{t(item.descKey)}</p>
                  <div className="text-[10px] sm:text-xs text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t(item.detailKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Hooks Section */}
        <section id="core-hooks" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl border border-purple-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🎣 {t('guide.coreHooks.title')}
            </h2>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              {t('guide.coreHooks.description')}
            </p>
            
            <HooksTabs />
          </div>
        </section>

        {/* Rules Section */}
        <section id="rules" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl border border-orange-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {t('guide.hooksRules')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-xl font-bold text-red-400 mb-4">{t('guide.rules.dontTitle')}</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>{t('guide.rules.dont.conditional')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>{t('guide.rules.dont.regular')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>{t('guide.rules.dont.class')}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-xl font-bold text-green-400 mb-4">{t('guide.rules.doTitle')}</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>{t('guide.rules.do.topLevel')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>{t('guide.rules.do.customHook')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>{t('guide.rules.do.sameOrder')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">{t('guide.rules.whyTitle')}</h3>
              <p className="text-slate-300 leading-relaxed">
                {t('guide.rules.whyDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* Performance Optimization Section */}
        <section id="optimization" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl border border-indigo-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>⚡</span> {t('guide.optimization.title')}
            </h2>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              {t('guide.optimization.description')}
            </p>
            <OptimizationDemos />
          </div>
        </section>

        {/* React 19 Features Section */}
        <section id="react19" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl border border-blue-500/20 p-8">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>✨</span> {t('react19.newFeatures.title')}
            </h3>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              {t('react19.newFeatures.description')}
            </p>
            
            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>🚀</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{t('react19.actionsAndUseTransition')}</h4>
                    <p className="text-slate-400">{t('react19.actionsAndUseTransition.subtitle')}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  {t.rich('react19.actions.description', {
                    strong: (chunks) => <strong className="text-blue-400">{chunks}</strong>
                  })}
                  {t('react19.actions.autoManagement')}
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-green-400 mb-3">{t('react19.newWay')}</p>
                  <pre className="text-sm text-slate-400 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                    <code className="language-typescript">{`// Before React 19
const [isPending, setIsPending] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async () => {
  setIsPending(true);
  try {
    await updateName(name);
    redirect("/path");
  } catch (err) {
    setError(err);
  } finally {
    setIsPending(false);
  }
};

// React 19 - Actions!
const [isPending, startTransition] = useTransition();

const handleSubmit = () => {
  startTransition(async () => {
    const error = await updateName(name);
    if (error) return error;
    redirect("/path");
  });
};`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">📝</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{t('react19.formActionsAndUseActionState')}</h4>
                    <p className="text-slate-400">{t('react19.formActionsAndUseActionState.subtitle')}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  {t.rich('react19.formActions.withUseActionState', {
                    strong: (chunks) => {
                      if (chunks === 'useActionState') return <strong className="text-green-400">{chunks}</strong>;
                      if (chunks === 'Form Actions') return <strong className="text-blue-400">{chunks}</strong>;
                      return <strong>{chunks}</strong>;
                    }
                  })}
                  <HTMLText>{t('react19.formActions.simplifiedDesc')}</HTMLText>
                </p>
                
                {/* FormActionDemo 통합 */}
                <FormActionDemo />
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">🎣</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{t('react19.useHook')}</h4>
                    <p className="text-slate-400">{t('react19.useHook.subtitle')}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  {t.rich('react19.use.description', {
                    strong: (chunks) => <strong className="text-purple-400">{chunks}</strong>
                  })}
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <pre className="text-sm text-slate-400 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                    <code className="language-typescript">{`// ${t('react19.code.comment.conditionPromise')}
const data = use(fetchPromise);

// ${t('react19.code.comment.conditionUse')}
if (condition) {
  const context = use(MyContext);
}

// ${t('react19.code.comment.safePredict')}`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">🔧</span>
                  <div>
                    <h4 className="text-xl font-bold text-white">{t('react19.useFormStatusAndUseOptimistic')}</h4>
                    <p className="text-slate-400">{t('react19.useFormStatusAndUseOptimistic.subtitle')}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  {t.rich('react19.formHooks.description', {
                    strong: (chunks) => {
                      if (chunks === 'useFormStatus') return <strong className="text-orange-400">{chunks}</strong>;
                      if (chunks === 'useOptimistic') return <strong className="text-pink-400">{chunks}</strong>;
                      return <strong>{chunks}</strong>;
                    }
                  })}
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-green-400 mb-3">{t('react19.newFormHooks')}</p>
                  <pre className="text-sm text-slate-400 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                    <code className="language-typescript">{`// ${t('react19.code.comment.formStatus')}
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

// ${t('react19.code.comment.optimistic')}
const [optimisticMessages, addOptimisticMessage] = useOptimistic(
  messages,
  (state, newMessage) => [...state, { ...newMessage, sending: true }]
);`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>🚀</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{t('react19.serverComponentsAndReactCompiler')}</h4>
                    <p className="text-slate-400">{t('react19.serverComponentsAndReactCompiler.subtitle')}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  {t.rich('react19.compiler.description', {
                    strong: (chunks) => {
                      if (chunks === 'useMemo') return <strong className="text-green-400">{chunks}</strong>;
                      if (chunks === 'useCallback') return <strong className="text-blue-400">{chunks}</strong>;
                      if (chunks === 'React.memo') return <strong className="text-purple-400">{chunks}</strong>;
                      return <strong>{chunks}</strong>;
                    }
                  })}
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-green-400 mb-3">{t('react19.noLongerNeeded')}</p>
                  <pre className="text-sm text-slate-400 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                    <code className="language-typescript">{`// ${t('react19.code.beforeReact19')}
const memoized = useMemo(() => expensive(), [deps]);
const callback = useCallback(() => handler(), [deps]);
const MemoizedComponent = React.memo(Component);

// ${t('react19.code.withReact19')}
const memoized = expensive(); // ${t('react19.code.comment.autoMemo')}
const callback = () => handler(); // ${t('react19.code.comment.autoCallback')}
const Component = () => <div>...</div>; // ${t('react19.code.comment.autoMemoComponent')}`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">💎</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{t('react19.resourcePreloadingAPIs')}</h4>
                    <p className="text-slate-400">{t('react19.resourcePreloadingAPIs.subtitle')}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  {t.rich('react19.resources.description', {
                    strong: (chunks) => {
                      if (chunks === 'prefetchDNS') return <strong className="text-yellow-400">{chunks}</strong>;
                      if (chunks === 'preconnect') return <strong className="text-green-400">{chunks}</strong>;
                      if (chunks === 'preload') return <strong className="text-blue-400">{chunks}</strong>;
                      if (chunks === 'preinit') return <strong className="text-purple-400">{chunks}</strong>;
                      return <strong>{chunks}</strong>;
                    }
                  })}
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-green-400 mb-3">{t('react19.newResourceAPIs')}</p>
                  <pre className="overflow-x-auto">
                    <code className="language-typescript text-sm">
{`import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'

function MyComponent() {
  preinit('https://.../script.js', {as: 'script'}) // ${t('react19.code.comment.preinit')}
  preload('https://.../font.woff', { as: 'font' }) // ${t('react19.code.comment.preload')}
  preload('https://.../style.css', { as: 'style' }) // ${t('react19.code.comment.preload')}
  prefetchDNS('https://...') // ${t('react19.code.comment.prefetch')}
  preconnect('https://...') // ${t('react19.code.comment.preconnect')}
  
  return <div>...</div>
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-950/30 rounded-2xl border border-blue-500/20">
              <h4 className="text-xl font-bold text-blue-400 mb-4">{t('react19.upgrade.guideTitle')}</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div>
                  <p><strong>{t('react19.upgrade.step1')}</strong> {t('react19.upgrade.step1.desc')}</p>
                  <p><strong>{t('react19.upgrade.step2')}</strong> {t('react19.upgrade.step2.desc')}</p>
                  <p><strong>{t('react19.upgrade.step3')}</strong> {t('react19.upgrade.step3.desc')}</p>
                </div>
                <div>
                  <p><strong>{t('react19.upgrade.step4')}</strong> {t('react19.upgrade.step4.desc')}</p>
                  <p><strong>{t('react19.upgrade.step5')}</strong> {t('react19.upgrade.step5.desc')}</p>
                </div>
              </div>
              <p className="text-sm text-blue-300 mt-4">
                💡 {t('react19.upgrade.tip')}
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Patterns Lab */}
        <section id="advanced" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl border border-pink-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🧪 {t('guide.advanced.title')}
            </h2>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              {t('guide.advanced.description')}
            </p>
            <AdvancedPatterns />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/50 border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>⚛️</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              React Hooks Guide
            </h3>
          </div>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            {t('guide.footer.description')}
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <span>{t('guide.footer.madeWith')} <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>❤️</span> {t('guide.footer.forDevelopers')}</span>
            <span>•</span>
            <span>React 19 Ready</span>
            <span>•</span>
            <span>TypeScript Support</span>
            <span>•</span>
            <span>Mobile Optimized</span>
          </div>
        </div>
      </footer>
    </div>
  );
});

ReactHooksGuide.displayName = 'ReactHooksGuide';

export { ReactHooksGuide };
