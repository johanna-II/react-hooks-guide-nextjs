'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useTranslations } from '@/hooks/useTranslations';

interface DemoBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DemoBox({ title, children, className = '' }: DemoBoxProps) {
  return (
    <div
      className={`backdrop-blur-xl bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}
    >
      <h4 className="text-lg font-bold text-white mb-4">{title}</h4>
      {children}
    </div>
  );
}

export default function OptimizationDemos() {
  const t = useTranslations();
  const [count, setCount] = useState(0);
  const [expensiveValue, setExpensiveValue] = useState(1);
  const [renderCount, setRenderCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const [nonOptRenders, setNonOptRenders] = useState(1);
  const [optRenders] = useState(1);
  const [nonOptTime, setNonOptTime] = useState(0);
  const [optTime, setOptTime] = useState(0);
  const memoizedResult = useRef<boolean | null>(null);
  const [nonOptInput, setNonOptInput] = useState('');
  const [optInput, setOptInput] = useState('');
  const [nonOptDots, setNonOptDots] = useState(Array(100).fill(false));
  const [nonOptListeners, setNonOptListeners] = useState(0);
  const [optListeners, setOptListeners] = useState(0);
  const [optComponents, setOptComponents] = useState(0);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const memoizedValue = useMemo(() => {
    if (isClient) {
      // Expensive calculation running
      setRenderCount((prev) => prev + 1);
    }
    return expensiveValue * 2;
  }, [expensiveValue, isClient]);

  const heavyCalculation = useCallback((num: number) => {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
    return isPrime;
  }, []);

  return (
    <div className="space-y-6">
      {/* 二쇱슂 硫뷀듃由?4媛??ㅻ챸 */}
      <DemoBox title={t('optimization.demoBox.keyMetrics')} className="border-indigo-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          {t('optimization.metrics.description')}
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/20">
            <h5 className="text-lg font-semibold text-blue-400 mb-2">
              {t('optimization.metrics.renderCount.title')}
            </h5>
            <p className="text-sm text-slate-300 mb-2">
              {t('optimization.metrics.renderCountTitle')}
            </p>
            <p className="text-xs text-slate-400">{t('optimization.metrics.renderCount.desc')}</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/20">
            <h5 className="text-lg font-semibold text-green-400 mb-2">
              {t('optimization.metrics.executionTime.title')}
            </h5>
            <p className="text-sm text-slate-300 mb-2">
              {t('optimization.metrics.executionTimeTitle')}
            </p>
            <p className="text-xs text-slate-400">{t('optimization.metrics.executionTime.desc')}</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
            <h5 className="text-lg font-semibold text-purple-400 mb-2">
              {t('optimization.metrics.uiResponsiveness.title')}
            </h5>
            <p className="text-sm text-slate-300 mb-2">
              {t('optimization.metrics.uiResponsivenessTitle')}
            </p>
            <p className="text-xs text-slate-400">
              {t('optimization.metrics.uiResponsiveness.desc')}
            </p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-orange-500/20">
            <h5 className="text-lg font-semibold text-orange-400 mb-2">
              {t('optimization.metrics.memoryManagement.title')}
            </h5>
            <p className="text-sm text-slate-300 mb-2">
              {t('optimization.metrics.memoryManagementTitle')}
            </p>
            <p className="text-xs text-slate-400">
              {t('optimization.memoryManagement.explanation')}
            </p>
          </div>
        </div>
      </DemoBox>

      {/* Demo 1: Render Count 理쒖쟻??(React.memo ?쒖슜) */}
      <DemoBox
        title={t('optimization.demoBox.renderCountOptimization')}
        className="border-blue-500/30"
      >
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-blue-400">{t('optimization.reactMemo.core')}</strong>
          {t('optimization.reactMemo.coreExplanation')} <br />
          {t('optimization.reactMemo.tryItBelow')}
        </p>

        {/* ?숈옉 ?먮━ ?ㅻ챸 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-blue-400 mb-3">
            {t('optimization.workingPrinciple.title')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.workingPrinciple.before')}</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• {t('optimization.renderCount.whenParentChanges')}</li>
                <li>• {t('optimization.renderCount.regardlessOfProps')}</li>
                <li>• {t('optimization.renderCount.performanceDegradation')}</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.workingPrinciple.after')}</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>✓ {t('optimization.workingPrinciple.afterBullet1')}</li>
                <li>✓ {t('optimization.workingPrinciple.afterBullet2')}</li>
                <li>✓ {t('optimization.workingPrinciple.afterBullet3')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6" suppressHydrationWarning>
          <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              {t('optimization.renderCount.beforeOptimization')}
            </h5>
            <p className="text-sm text-slate-400 mb-4">
              {t('optimization.renderCount.everyTimeRerendering')}
            </p>
            <button
              onClick={() => setNonOptRenders(nonOptRenders + 1)}
              className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
            >
              {t('optimization.renderCount.parentReRender')}
            </button>
            <div className="mt-4 p-3 bg-red-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-red-400">{nonOptRenders}</span>
                <span className="block text-xs text-red-400/70 mt-1">
                  {t('optimization.renderCount.renderCountLabel')}
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {t('optimization.renderCount.parentInefficient')}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              {t('optimization.renderCount.afterOptimization')}
            </h5>
            <p className="text-sm text-slate-400 mb-4">
              {t('optimization.renderCount.onlyPropsChangeRerendering')}
            </p>
            <button
              onClick={() => {}}
              className="w-full px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all border border-green-500/30"
            >
              {t('optimization.renderCount.parentReRender')}
            </button>
            <div className="mt-4 p-3 bg-green-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-green-400">{optRenders}</span>
                <span className="block text-xs text-green-400/70 mt-1">
                  {t('optimization.renderCount.renderCountLabel')}
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {t('optimization.renderCount.propsReuseEfficient')}
            </p>
          </div>
        </div>

        {/* ?깅뒫 鍮꾧탳 寃곌낵 */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">
            {t('optimization.performanceComparisonResult')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400 mb-1">
                {t('optimization.renderCount.beforeOptimization')}
              </p>
              <p className="text-2xl font-bold text-red-400">{nonOptRenders}</p>
              <p className="text-xs text-slate-500">
                {t('optimization.renderCount.renderingCount')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 mb-1">
                {t('optimization.renderCount.afterOptimization')}
              </p>
              <p className="text-2xl font-bold text-green-400">{optRenders}</p>
              <p className="text-xs text-slate-500">
                {t('optimization.renderCount.renderingCount')}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            {nonOptRenders > optRenders
              ? t('optimization.renderCount.unnecessaryRendersPrevented', {
                  count: nonOptRenders - optRenders,
                })
              : t('optimization.testIt')}
          </p>
        </div>
      </DemoBox>

      {/* Demo 2: Execution Time 理쒖쟻??(useMemo ?쒖슜) */}
      <DemoBox
        title={t('optimization.demoBox.executionTimeOptimization')}
        className="border-green-500/30"
      >
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-green-400">{t('optimization.executionTime.useMemoCore')}</strong>
          {t('optimization.executionTime.useMemoDesc')}
        </p>

        {/* ?숈옉 ?먮━ ?ㅻ챸 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-green-400 mb-3">
            {t('optimization.workingPrinciple.title')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.workingPrinciple.before')}</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• {t('optimization.workingPrinciple.recalculateEveryTime')}</li>
                <li>• {t('optimization.workingPrinciple.duplicateCalculation')}</li>
                <li>• {t('optimization.workingPrinciple.wasteResources')}</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.workingPrinciple.afterUseMemo')}</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>✓ {t('optimization.workingPrinciple.firstCalculationOnly')}</li>
                <li>✓ {t('optimization.workingPrinciple.recalculateWhenDepsChange')}</li>
                <li>✓ {t('optimization.workingPrinciple.saveCalculationTime')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6" suppressHydrationWarning>
          <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              {t('optimization.executionTime.beforeOptimization')}
            </h5>
            <p className="text-sm text-slate-400 mb-4">
              {t('optimization.executionTime.recalculationEveryTime')}
            </p>
            <button
              onClick={() => {
                const t0 = performance.now();
                heavyCalculation(1000000007);
                const t1 = performance.now();
                setNonOptTime(Number((t1 - t0).toFixed(2)));
              }}
              className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
            >
              {t('optimization.executionTime.calculatePrime')}
            </button>
            <div className="mt-4 p-3 bg-red-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-red-400">{nonOptTime}</span>
                <span className="block text-xs text-red-400/70 mt-1">
                  {t('optimization.executionTime.calculationTime')}
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {t('optimization.executionTime.slowCalculation')}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              {t('optimization.executionTime.afterOptimization')}
            </h5>
            <p className="text-sm text-slate-400 mb-4">
              {t('optimization.executionTime.cachedResults')}
            </p>
            <button
              onClick={() => {
                const t0 = performance.now();
                if (memoizedResult.current === null) {
                  memoizedResult.current = heavyCalculation(1000000007);
                }
                const t1 = performance.now();
                setOptTime(Number((t1 - t0).toFixed(2)));
              }}
              className="w-full px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all border border-green-500/30"
            >
              {t('optimization.executionTime.calculatePrime')}
            </button>
            <div className="mt-4 p-3 bg-green-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-green-400">{optTime}</span>
                <span className="block text-xs text-green-400/70 mt-1">
                  {t('optimization.executionTime.calculationTime')}
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {t('optimization.executionTime.fastCalculation')}
            </p>
          </div>
        </div>

        {/* ?깅뒫 鍮꾧탳 寃곌낵 */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">
            {t('optimization.performanceComparisonResult')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400 mb-1">
                {t('optimization.renderCount.beforeOptimization')}
              </p>
              <p className="text-2xl font-bold text-red-400">{nonOptTime}ms</p>
              <p className="text-xs text-slate-500">
                {t('optimization.executionTime.calculationTimeLabel')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 mb-1">
                {t('optimization.renderCount.afterOptimization')}
              </p>
              <p className="text-2xl font-bold text-green-400">{optTime}ms</p>
              <p className="text-xs text-slate-500">
                {t('optimization.executionTime.calculationTimeLabel')}
              </p>
            </div>
          </div>
          {nonOptTime > 0 && optTime > 0 && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              {nonOptTime > optTime
                ? t('optimization.executionTime.performanceImprovement', {
                    percent: (((nonOptTime - optTime) / nonOptTime) * 100).toFixed(1),
                  })
                : t('optimization.testIt')}
            </p>
          )}
        </div>
      </DemoBox>

      {/* Demo 3: UI Responsiveness 理쒖쟻??*/}
      <DemoBox
        title={t('optimization.demoBox.uiResponsivenessOptimization')}
        className="border-purple-500/30"
      >
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-purple-400">{t('optimization.uiResponsiveness.core')}</strong>
          {t('optimization.uiResponsiveness.coreDesc')}
        </p>

        {/* ?숈옉 ?먮━ ?ㅻ챸 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-purple-400 mb-3">
            {t('optimization.workingPrinciple.title')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.workingPrinciple.before')}</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• {t('optimization.uiResponsiveness.drawDotsEveryType')}</li>
                <li>• {t('optimization.uiResponsiveness.unnecessaryDOMManipulation')}</li>
                <li>• {t('optimization.uiResponsiveness.laggyInputExperience')}</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.uiResponsiveness.afterOptimization')}:</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>✓ {t('optimization.uiResponsiveness.dotsNotRedrawn')}</li>
                <li>✓ {t('optimization.uiResponsiveness.onlyNecessaryUpdates')}</li>
                <li>✓ {t('optimization.uiResponsiveness.smoothTypingExperience')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6" suppressHydrationWarning>
          <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              {t('optimization.uiResponsiveness.beforeOptimization')}
            </h5>
            <input
              type="text"
              value={nonOptInput}
              onChange={(e) => {
                setNonOptInput(e.target.value);
                setNonOptDots(nonOptDots.map(() => Math.random() > 0.5));
              }}
              placeholder={t('optimization.uiResponsiveness.typingTest')}
              className="w-full px-4 py-2 bg-white/5 border border-red-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
            />
            <div className="mt-4 grid grid-cols-10 gap-1">
              {nonOptDots.slice(0, 50).map((active, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    active ? 'bg-red-400 scale-110' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {t('optimization.uiResponsiveness.redrawEveryTyping')}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              {t('optimization.uiResponsiveness.afterOptimization')}
            </h5>
            <input
              type="text"
              value={optInput}
              onChange={(e) => setOptInput(e.target.value)}
              placeholder={t('optimization.uiResponsiveness.typingTest')}
              className="w-full px-4 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50"
            />
            <div className="mt-4 grid grid-cols-10 gap-1">
              {Array(50)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-slate-700" />
                ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {t('optimization.uiResponsiveness.dotsNotRedrawn')} (
              {t('optimization.uiResponsiveness.smoothTypingExperience')})
            </p>
          </div>
        </div>

        {/* ?ㅼ떆媛??쇰뱶諛?*/}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">
            {t('optimization.realtimeFeedback')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400 mb-1">
                {t('optimization.renderCount.beforeOptimization')}
              </p>
              <p className="text-2xl font-bold text-red-400">{nonOptInput.length}</p>
              <p className="text-xs text-slate-500">
                {t('optimization.uiResponsiveness.charactersTyped')}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {nonOptInput.length > 0
                  ? t('optimization.dotsBlinking')
                  : t('optimization.noInput')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 mb-1">
                {t('optimization.renderCount.afterOptimization')}
              </p>
              <p className="text-2xl font-bold text-green-400">{optInput.length}</p>
              <p className="text-xs text-slate-500">
                {t('optimization.uiResponsiveness.charactersTyped')}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {optInput.length > 0 ? t('optimization.dotsFixed') : t('optimization.noInput')}
              </p>
            </div>
          </div>
        </div>
      </DemoBox>

      {/* Demo 4: Memory Management 理쒖쟻??*/}
      <DemoBox
        title={t('optimization.demoBox.memoryManagementOptimization')}
        className="border-orange-500/30"
      >
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-orange-400">
            {t('optimization.memoryManagement.useMemoCore')}
          </strong>
          {t('optimization.memoryManagement.useMemoDesc')}
        </p>

        {/* ?숈옉 ?먮━ ?ㅻ챸 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-orange-400 mb-3">
            {t('optimization.workingPrinciple.title')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.memoryManagement.noCleanup')}:</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• {t('optimization.workingPrinciple.listenerKeepStacking')}</li>
                <li>• {t('optimization.workingPrinciple.notRemovedFromMemory')}</li>
                <li>• {t('optimization.workingPrinciple.memoryLeakOccur')}</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.memoryManagement.withCleanup')}:</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>✓ {t('optimization.memoryManagement.cleanupOnUnmount')}</li>
                <li>✓ {t('optimization.workingPrinciple.efficientMemory')}</li>
                <li>✓ {t('optimization.memoryManagement.cleanResourceCleanup')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6" suppressHydrationWarning>
          <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              {t('optimization.memoryManagement.noCleanup')}
            </h5>
            <div className="flex gap-2">
              <button
                onClick={() => setNonOptListeners(nonOptListeners + 1)}
                className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/30 text-sm"
              >
                {t('optimization.memoryManagement.add')}
              </button>
              <button
                onClick={() => {}}
                className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30 text-sm"
              >
                {t('optimization.memoryManagement.remove')}
              </button>
            </div>
            <div className="mt-4 p-3 bg-red-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-red-400">{nonOptListeners}</span>
                <span className="block text-xs text-red-400/70 mt-1">
                  {t('optimization.memoryManagement.activeListeners')}
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {t('optimization.memoryManagement.memoryLeakWarning')}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              {t('optimization.memoryManagement.withCleanup')}
            </h5>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOptComponents(optComponents + 1);
                  setOptListeners(optListeners + 1);
                }}
                className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/30 text-sm"
              >
                {t('optimization.memoryManagement.add')}
              </button>
              <button
                onClick={() => {
                  if (optComponents > 0) {
                    setOptComponents(optComponents - 1);
                    setOptListeners(optListeners - 1);
                  }
                }}
                className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30 text-sm"
              >
                {t('optimization.memoryManagement.remove')}
              </button>
            </div>
            <div className="mt-4 p-3 bg-green-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-green-400">{optListeners}</span>
                <span className="block text-xs text-green-400/70 mt-1">
                  {t('optimization.memoryManagement.activeListeners')}
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {t('optimization.memoryManagement.properCleanup')}
            </p>
          </div>
        </div>

        {/* 硫붾え由??곹깭 紐⑤땲?곕쭅 */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">
            {t('optimization.memoryManagement.memoryStatusMonitoring')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400 mb-1">{t('optimization.memoryManagement.noCleanup')}</p>
              <p className="text-2xl font-bold text-red-400">{nonOptListeners}</p>
              <p className="text-xs text-slate-500">
                {t('optimization.memoryManagement.accumulatedListeners')}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {nonOptListeners > 0
                  ? t('optimization.memoryManagement.keepStacking')
                  : t('optimization.noneYet')}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 mb-1">
                {t('optimization.memoryManagement.withCleanup')}
              </p>
              <p className="text-2xl font-bold text-green-400">{optListeners}</p>
              <p className="text-xs text-slate-500">
                {t('optimization.memoryManagement.currentListeners')}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {optListeners > 0
                  ? t('optimization.memoryManagement.actuallyInUse')
                  : t('optimization.noneYet')}
              </p>
            </div>
          </div>
          {nonOptListeners > optListeners && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              {t('optimization.memoryManagement.noCleanupWarning', {
                count: nonOptListeners - optListeners,
              })}
            </p>
          )}
        </div>
      </DemoBox>

      {/* Demo 5: React.memo 理쒖쟻??(?ㅼ떆媛??곕え) */}
      <DemoBox title={t('optimization.reactMemoDemoTitle')} className="border-blue-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-blue-400">{t('optimization.reactMemo.core')}</strong>
          {t.rich('optimization.reactMemo.detailedExplanation', {
            strong: (chunks: React.ReactNode) => (
              <strong className="text-blue-400">{chunks}</strong>
            ),
            span: (chunks: React.ReactNode) => {
              if (chunks === 'Count 버튼') return <span className="text-green-400">{chunks}</span>;
              if (chunks === 'Expensive 버튼')
                return <span className="text-orange-400">{chunks}</span>;
              return <span>{chunks}</span>;
            },
          })}
        </p>

        {/* ?숈옉 ?먮━ ?ㅻ챸 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-blue-400 mb-3">
            {t('optimization.workingPrinciple.title')}
          </h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.reactMemo.countButtonTitle')}</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• {t('optimization.reactMemo.countButtonBullet1')}</li>
                <li>• {t('optimization.reactMemo.countButtonBullet2')}</li>
                <li>• {t('optimization.reactMemo.countButtonBullet3')}</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2">
                <strong>{t('optimization.reactMemo.expensiveButtonTitle')}</strong>
              </p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• {t('optimization.reactMemo.expensiveButtonBullet1')}</li>
                <li>• {t('optimization.reactMemo.expensiveButtonBullet2')}</li>
                <li>• {t('optimization.reactMemo.expensiveButtonBullet3')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ?ㅼ떆媛??뚯뒪??踰꾪듉??*/}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 font-medium"
          >
            Count: {count}
          </button>
          <button
            onClick={() => setExpensiveValue((v) => v + 1)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 font-medium"
          >
            Expensive: {expensiveValue}
          </button>
        </div>

        {/* ?ㅼ떆媛?寃곌낵 ?쒖떆 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm font-semibold text-green-400 mb-2">✅ Memoized Value</p>
            <p className="text-2xl font-bold text-white">{memoizedValue}</p>
            <p className="text-xs text-slate-400 mt-1">
              expensiveValue × 2 = {expensiveValue} × 2 = {memoizedValue}
            </p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm font-semibold text-blue-400 mb-2">📊 Render Count</p>
            <p className="text-2xl font-bold text-white">{isClient ? renderCount : '...'}</p>
            <p className="text-xs text-slate-400 mt-1">
              {t('optimization.reactMemo.useMemoExecutionCount')}
            </p>
          </div>
        </div>

        {/* ?쒓컖???쇰뱶諛?*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm font-semibold text-purple-400 mb-2">
              {t('optimization.reactMemo.countButtonEffect')}
            </p>
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${count > 0 ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}
              />
              <span className="text-xs text-slate-400">
                {count > 0
                  ? t('optimization.reactMemo.parentOnlyRerendered')
                  : t('optimization.reactMemo.notClickedYet')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {t('optimization.reactMemo.countChangedExpensiveValueSame')}
            </p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm font-semibold text-orange-400 mb-2">
              {t('optimization.reactMemo.expensiveButtonEffect')}
            </p>
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${expensiveValue > 1 ? 'bg-red-400 animate-pulse' : 'bg-slate-600'}`}
              />
              <span className="text-xs text-slate-400">
                {expensiveValue > 1
                  ? t('optimization.reactMemo.parentChildBothRerendered')
                  : t('optimization.reactMemo.notClickedYet')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {t('optimization.reactMemo.expensiveValueChangedUseMemoRerun')}
            </p>
          </div>
        </div>

        {/* ?④퀎蹂??뚯뒪??媛?대뱶 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-4">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">
            {t('optimization.testGuide.title')}
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">1. </span>
              <span className="text-slate-300">{t('optimization.testGuide.step1')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">2. </span>
              <span className="text-slate-300">{t('optimization.testGuide.step2')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">3. </span>
              <span className="text-slate-300">{t('optimization.testGuide.step3')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">4. </span>
              <span className="text-slate-300">{t('optimization.testGuide.step4')}</span>
            </div>
          </div>
        </div>

        {/* ?듭떖 ?ㅻ챸 */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-blue-400">{t('optimization.reactMemo.magic')}</strong>
            {t.rich('optimization.reactMemo.detailedExplanation', {
              strong: (chunks: React.ReactNode) => (
                <strong className="text-blue-400">{chunks}</strong>
              ),
              span: (chunks: React.ReactNode) => {
                if (chunks === 'Count 버튼')
                  return <span className="text-green-400">{chunks}</span>;
                if (chunks === 'Expensive 버튼')
                  return <span className="text-orange-400">{chunks}</span>;
                return <span>{chunks}</span>;
              },
            })}
          </p>
        </div>
      </DemoBox>

      {/* Demo 6: useMemo 理쒖쟻??媛?대뱶 */}
      <DemoBox title={t('optimization.useMemo.guideTitle')} className="border-emerald-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          {t('optimization.useMemo.guideDescription')}
        </p>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-4">
          <p className="text-sm text-slate-400 mb-2">{t('optimization.useMemo.consoleMessage')}</p>
          <p className="text-xs text-green-400 font-mono">
            &quot;Expensive calculation running...&quot;
          </p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-green-400">{t('optimization.useMemo.performanceTip')}</strong>{' '}
            {t('optimization.useMemo.performanceTipDesc')}
          </p>
        </div>
      </DemoBox>

      {/* Demo 7: ?뚮뜑留?理쒖쟻??媛?대뱶 */}
      <DemoBox title={t('optimization.renderingOptimizationGuide')} className="border-pink-500/30">
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <h5 className="text-lg font-semibold text-emerald-400 mb-2">
              {t('optimization.guide.goodExample')}
            </h5>
            <p className="text-sm text-slate-300 mb-2">{t('optimization.guide.useUniqueId')}</p>
            <pre className="text-xs text-emerald-400 font-mono bg-slate-900/50 p-3 rounded border border-slate-600/50 overflow-x-auto">
              <code className="language-jsx">{`{items.map(item => (
  <ListItem key={item.id} data={item} />
))}`}</code>
            </pre>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <h5 className="text-lg font-semibold text-red-400 mb-2">
              {t('optimization.guide.badExample')}
            </h5>
            <p className="text-sm text-slate-300 mb-2">{t('optimization.guide.useArrayIndex')}</p>
            <pre className="text-xs text-red-400 font-mono bg-slate-900/50 p-3 rounded border border-slate-600/50 overflow-x-auto">
              <code className="language-jsx">{`{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}`}</code>
            </pre>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-pink-400">{t('optimization.guide.keyPointTitle')}</strong>{' '}
            {t('optimization.guide.keyPointDesc')}
          </p>
        </div>
      </DemoBox>
    </div>
  );
}
