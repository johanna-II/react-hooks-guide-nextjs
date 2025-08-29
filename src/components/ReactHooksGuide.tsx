'use client';

import React from 'react';
import { useDeepLTranslations } from '@/contexts/TranslationContext';
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

const ReactHooksGuide: React.FC = React.memo(() => {
  const t = useDeepLTranslations();
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
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Hook의 장점</h3>
                  <p className="text-sm text-slate-300 leading-relaxed flex-grow">
                    클래스 컴포넌트의 this 바인딩 문제가 없고, 
                    컴포넌트를 더 작은 함수로 나누어 테스트하기 쉽습니다.
                  </p>
                </div>
                
                <div className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700/50 h-full flex flex-col">
                  <h3 className="text-lg font-bold text-orange-400 mb-2">언제 사용할까?</h3>
                  <p className="text-sm text-slate-300 leading-relaxed flex-grow">
                    함수형 컴포넌트에서 상태 관리, 사이드 이펙트 처리, 
                    컴포넌트 간 로직 공유가 필요할 때 사용합니다.
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
              <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>🚀</span> Hooks가 필요한 이유
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {WHY_HOOKS_DATA.map((item, index) => (
                <div key={index} className="bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105 group h-full flex flex-col">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>{item.icon}</div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-1.5 sm:mb-2 flex-grow">{item.desc}</p>
                  <div className="text-[10px] sm:text-xs text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.detail}
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
              🎣 핵심 Hooks 완벽 가이드
            </h2>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              React의 기본 Hooks들을 실시간 데모와 함께 학습하세요. <br />
              각 Hook의 동작 원리와 실제 사용법을 체험할 수 있습니다.
            </p>
            
            <HooksTabs />
          </div>
        </section>

        {/* Rules Section */}
        <section id="rules" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl border border-orange-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              📋 Hooks 사용 규칙
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-xl font-bold text-red-400 mb-4">절대 하지 말아야 할 것</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>조건문, 반복문, 중첩 함수 안에서 Hook 호출</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>일반 JavaScript 함수에서 Hook 호출</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>클래스 컴포넌트에서 Hook 사용</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-xl font-bold text-green-400 mb-4">올바른 사용법</h3>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>React 함수형 컴포넌트 최상위에서만 호출</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>커스텀 Hook 최상위에서만 호출</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Hook 호출 순서는 항상 동일하게 유지</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">왜 이런 규칙이 필요한가요?</h3>
              <p className="text-slate-300 leading-relaxed">
                React는 Hook의 호출 순서에 의존하여 상태를 올바르게 연결합니다. 
                조건문이나 반복문 안에서 Hook을 호출하면 호출 순서가 달라져서 
                상태가 잘못 연결될 수 있습니다. 이것이 &quot;Rules of Hooks&quot;의 핵심입니다.
              </p>
            </div>
          </div>
        </section>

        {/* Performance Optimization Section */}
        <section id="optimization" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl border border-indigo-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>⚡</span> 성능 최적화 마스터하기
            </h2>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              React.memo, useMemo, useCallback 등을 활용한 성능 최적화 기법을 <br />
              실시간 데모와 함께 학습하세요.
            </p>
            <OptimizationDemos />
          </div>
        </section>

        {/* React 19 Features Section */}
        <section id="react19" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl border border-blue-500/20 p-8">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>✨</span> React 19의 혁신적인 새로운 Hook들
            </h3>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              React 19에서는 개발자 경험을 크게 향상시키는 새로운 Hook들과 기능들이 추가되었습니다.
              특히 <strong className="text-blue-400">Actions</strong>, <strong className="text-green-400">Form Actions</strong>, 
              <strong className="text-purple-400">use() Hook</strong> 등이 핵심입니다.
            </p>
            
            <div className="space-y-8">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4" style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>🚀</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">Actions & useTransition</h4>
                    <p className="text-slate-400">비동기 상태 관리의 혁신</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  React 19의 <strong className="text-blue-400">Actions</strong>는 async 함수를 transitions에서 사용할 수 있게 해줍니다.
                  pending 상태, 에러 처리, 낙관적 업데이트를 자동으로 관리합니다.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-green-400 mb-3">🎉 React 19의 새로운 방식:</p>
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
                    <h4 className="text-2xl font-bold text-white">Form Actions & useActionState</h4>
                    <p className="text-slate-400">폼 처리가 놀랍도록 간단해짐</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  <strong className="text-green-400">useActionState</strong>와 <strong className="text-blue-400">Form Actions</strong>로 
                  폼 처리가 훨씬 간단해졌습니다. 자동 폼 리셋, 에러 처리, pending 상태를 자동으로 관리합니다.
                </p>
                
                {/* FormActionDemo 통합 */}
                <FormActionDemo />
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">🎣</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">use() Hook</h4>
                    <p className="text-slate-400">Promise와 Context를 더 쉽게</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  새로운 <strong className="text-purple-400">use() Hook</strong>으로 Promise를 직접 읽을 수 있습니다. 
                  조건문 안에서도 사용 가능한 유일한 Hook입니다.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <pre className="text-sm text-slate-400 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                    <code className="language-typescript">{`// Promise를 직접 사용
const data = use(fetchPromise);

// 조건부 사용 가능!
if (condition) {
  const context = use(MyContext);
}

// React 19에서는 더 안전하고 예측 가능한 방식으로 작동`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">🔧</span>
                  <div>
                    <h4 className="text-xl font-bold text-white">useFormStatus & useOptimistic</h4>
                    <p className="text-slate-400">폼 상태 관리의 새로운 패러다임</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  <strong className="text-orange-400">useFormStatus</strong>로 폼의 pending 상태를 쉽게 관리하고, &nbsp;
                  <strong className="text-pink-400">useOptimistic</strong>으로 즉시 UI 업데이트를 구현할 수 있습니다.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-green-400 mb-3">🎉 새로운 Form Hooks:</p>
                  <pre className="text-sm text-slate-400 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                    <code className="language-typescript">{`// useFormStatus로 폼 상태 관리
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

// useOptimistic으로 즉시 UI 업데이트
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
                    <h4 className="text-2xl font-bold text-white">Server Components & React Compiler</h4>
                    <p className="text-slate-400">자동 최적화의 마법</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  React 19의 새로운 컴파일러는 <strong className="text-green-400">useMemo</strong>, 
                  <strong className="text-blue-400"> useCallback</strong>, <strong className="text-purple-400">React.memo</strong>를 
                  자동으로 적용합니다. <br />개발자가 수동으로 최적화하지 않아도 React가 알아서 처리합니다.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-green-400 mb-3">🎉 더 이상 필요없어진 코드:</p>
                  <pre className="text-sm text-slate-400 font-mono overflow-x-auto bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                    <code className="language-typescript">{`// Before React 19
const memoized = useMemo(() => expensive(), [deps]);
const callback = useCallback(() => handler(), [deps]);
const MemoizedComponent = React.memo(Component);

// React 19 - 자동으로 최적화됨!
const memoized = expensive(); // 자동으로 useMemo 적용
const callback = () => handler(); // 자동으로 useCallback 적용
const Component = () => <div>...</div>; // 자동으로 React.memo 적용`}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">💎</span>
                  <div>
                    <h4 className="text-2xl font-bold text-white">Resource Preloading APIs</h4>
                    <p className="text-slate-400">성능 최적화의 새로운 차원</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6">
                  <strong className="text-yellow-400">prefetchDNS</strong>, <strong className="text-green-400">preconnect</strong>, 
                  <strong className="text-blue-400"> preload</strong>, <strong className="text-purple-400">preinit</strong> 등 
                  새로운 리소스 프리로딩 API들로 페이지 성능을 크게 향상시킬 수 있습니다.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-green-400 mb-3">🎉 새로운 Resource APIs:</p>
                  <pre className="overflow-x-auto">
                    <code className="language-typescript text-sm">
{`import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'

function MyComponent() {
  preinit('https://.../script.js', {as: 'script'}) // 즉시 로드 및 실행
  preload('https://.../font.woff', { as: 'font' }) // 폰트 프리로드
  preload('https://.../style.css', { as: 'style' }) // 스타일시트 프리로드
  prefetchDNS('https://...') // DNS 프리페치
  preconnect('https://...') // 연결 프리페치
  
  return <div>...</div>
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-950/30 rounded-2xl border border-blue-500/20">
              <h4 className="text-xl font-bold text-blue-400 mb-4">React 19 업그레이드 가이드</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div>
                  <p><strong>1단계:</strong> React 19.1.0으로 업그레이드</p>
                  <p><strong>2단계:</strong> 새로운 Actions 패턴 적용</p>
                  <p><strong>3단계:</strong> Form Actions로 폼 처리 현대화</p>
                </div>
                <div>
                  <p><strong>4단계:</strong> React Compiler의 자동 최적화 활용</p>
                  <p><strong>5단계:</strong> Resource Preloading APIs로 성능 향상</p>
                </div>
              </div>
              <p className="text-sm text-blue-300 mt-4">
                💡 React 19는 이전 버전과의 호환성을 유지하면서 점진적으로 새로운 기능을 도입할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Patterns Lab */}
        <section id="advanced" className="mb-24 scroll-mt-20">
          <div className="backdrop-blur-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl border border-pink-500/20 p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🧪 고급 패턴 실험실
            </h2>
            <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
              useCallback, useRef, useEffect 등 고급 Hook 패턴들을 실시간으로 실험해보세요.
              각 패턴의 동작 원리와 최적화 효과를 직접 확인할 수 있습니다.
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
            React Hooks의 모든 것을 배우고, React 19의 혁신적인 기능들을 체험해보세요.
            실시간 데모와 함께하는 인터랙티브 학습 가이드입니다.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <span>Made with <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif' }}>❤️</span> for React Developers</span>
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
