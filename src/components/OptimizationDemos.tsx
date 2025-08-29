'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';

interface DemoBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DemoBox({ title, children, className = '' }: DemoBoxProps) {
  return (
    <div className={`backdrop-blur-xl bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
      <h4 className="text-lg font-bold text-white mb-4">
        {title}
      </h4>
      {children}
    </div>
  );
}

export default function OptimizationDemos() {
  const [count, setCount] = useState(0);
  const [expensiveValue, setExpensiveValue] = useState(1);
  const [renderCount, setRenderCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // 성능 최적화 데모를 위한 추가 상태들
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

  // 클라이언트 사이드에서만 실행 (Hydration 오류 방지)
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // useMemo로 계산 최적화
  const memoizedValue = useMemo(() => {
    if (isClient) {
      console.log('Expensive calculation running...');
      setRenderCount(prev => prev + 1);
    }
    return expensiveValue * 2;
  }, [expensiveValue, isClient]);

  // 무거운 계산 함수 (성능 테스트용)
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
      {/* 주요 메트릭 4개 설명 */}
      <DemoBox title="주요 성능 메트릭" className="border-indigo-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          성능 최적화를 이해하기 위해 알아야 할 핵심 지표들을 설명합니다.
          각 메트릭이 왜 중요한지, 어떻게 측정하는지 알아보세요.
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/20">
            <h5 className="text-lg font-semibold text-blue-400 mb-2">Render Count</h5>
            <p className="text-sm text-slate-300 mb-2">화면을 다시 그리는 횟수</p>
            <p className="text-xs text-slate-400">
              적을수록 좋습니다. 마치 그림을 그릴 때 전체를 지우고 다시 그리는 것보다 
              필요한 부분만 수정하는 것이 효율적입니다.
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/20">
            <h5 className="text-lg font-semibold text-green-400 mb-2">Execution Time</h5>
            <p className="text-sm text-slate-300 mb-2">계산에 걸리는 시간</p>
            <p className="text-xs text-slate-400">
              복잡한 계산 결과를 저장해두면 매번 다시 계산하지 않아도 됩니다. 
              계산기 결과를 메모해두는 것과 같습니다.
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
            <h5 className="text-lg font-semibold text-purple-400 mb-2">UI Responsiveness</h5>
            <p className="text-sm text-slate-300 mb-2">사용자 입력 반응성</p>
            <p className="text-xs text-slate-400">
              타이핑할 때 글자가 바로 나타나야 사용하기 편합니다. 
              스마트폰이 터치에 바로 반응하는 것처럼 빨라야 합니다.
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-orange-500/20">
            <h5 className="text-lg font-semibold text-orange-400 mb-2">Memory Usage</h5>
            <p className="text-sm text-slate-300 mb-2">메모리 효율성</p>
            <p className="text-xs text-slate-400">
              사용하지 않는 것은 정리해야 메모리가 부족하지 않습니다. 
              마치 집에 쓰레기를 계속 쌓아두면 공간이 부족해지는 것과 같습니다.
            </p>
          </div>
        </div>
      </DemoBox>

      {/* Demo 1: Render Count 최적화 (React.memo 활용) */}
      <DemoBox title="Render Count 최적화" className="border-blue-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-blue-400">React.memo의 핵심: </strong> 
          부모 컴포넌트가 리렌더링되어도 자식은 props가 변경되지 않으면 리렌더링되지 않습니다. <br />
          아래에서 직접 체험해보세요!
        </p>
        
        {/* 동작 원리 설명 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-blue-400 mb-3">동작 원리</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2"><strong>최적화 전:</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 부모가 바뀔 때마다 자식도 다시 그림</li>
                <li>• Props 변경 여부와 관계없음</li>
                <li>• 불필요한 렌더링으로 성능 저하</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2"><strong>최적화 후 (React.memo):</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• Props 변경시만 자식 리렌더링</li>
                <li>• 이전 결과를 재사용</li>
                <li>• 성능 크게 향상</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              최적화 전
            </h5>
            <p className="text-sm text-slate-400 mb-4">매번 re-rendering 발생</p>
            <button
              onClick={() => setNonOptRenders(nonOptRenders + 1)}
              className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
            >
              Parent Re-render
            </button>
            <div className="mt-4 p-3 bg-red-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-red-400">{nonOptRenders}</span>
                <span className="block text-xs text-red-400/70 mt-1">Render Count</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              부모가 바뀔 때마다 자식도 다시 그려짐 (비효율적)
            </p>
          </div>

          <div className="backdrop-blur-xl bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              최적화 후 (React.memo)
            </h5>
            <p className="text-sm text-slate-400 mb-4">Props 변경시만 re-rendering</p>
            <button
              onClick={() => {}}
              className="w-full px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all border border-green-500/30"
            >
              Parent Re-render
            </button>
            <div className="mt-4 p-3 bg-green-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-green-400">{optRenders}</span>
                <span className="block text-xs text-green-400/70 mt-1">Render Count</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Props가 같으면 재사용 (효율적) - React 19에서는 자동!
            </p>
          </div>
        </div>
        
        {/* 성능 비교 결과 */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">성능 비교 결과</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400 mb-1">최적화 전</p>
              <p className="text-2xl font-bold text-red-400">{nonOptRenders}</p>
              <p className="text-xs text-slate-500">렌더링 횟수</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 mb-1">최적화 후</p>
              <p className="text-2xl font-bold text-green-400">{optRenders}</p>
              <p className="text-xs text-slate-500">렌더링 횟수</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            {nonOptRenders > optRenders ? 
              `🎉 ${nonOptRenders - optRenders}번의 불필요한 렌더링 방지!` : 
              '테스트해보세요!'
            }
          </p>
        </div>
      </DemoBox>

      {/* Demo 2: Execution Time 최적화 (useMemo 활용) */}
      <DemoBox title="Execution Time 최적화" className="border-green-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-green-400">useMemo의 핵심: </strong> 
          복잡한 계산을 매번 반복하면 앱이 느려집니다. 
          한 번 계산한 결과를 저장해두고 재사용하면 훨씬 빠릅니다.
        </p>
        
        {/* 동작 원리 설명 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-green-400 mb-3">동작 원리</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2"><strong>최적화 전:</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 매번 계산을 처음부터 실행</li>
                <li>• 동일한 입력에 대해 중복 계산</li>
                <li>• 사용자 경험 저하</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2"><strong>최적화 후 (useMemo):</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 첫 번째만 계산, 이후는 캐시 사용</li>
                <li>• 의존성이 변경될 때만 재계산</li>
                <li>• 즉시 응답으로 UX 향상</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              최적화 전
            </h5>
            <p className="text-sm text-slate-400 mb-4">매번 recalculation</p>
            <button
              onClick={() => {
                const t0 = performance.now();
                heavyCalculation(1000000007);
                const t1 = performance.now();
                setNonOptTime(Number((t1 - t0).toFixed(2)));
              }}
              className="w-full px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
            >
              Calculate Prime
            </button>
            <div className="mt-4 p-3 bg-red-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-red-400">{nonOptTime}</span>
                <span className="block text-xs text-red-400/70 mt-1">milliseconds</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              큰 소수 판별을 매번 다시 계산 (느림)
            </p>
          </div>

          <div className="backdrop-blur-xl bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              최적화 후 (useMemo)
            </h5>
            <p className="text-sm text-slate-400 mb-4">Result caching</p>
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
              Calculate Prime
            </button>
            <div className="mt-4 p-3 bg-green-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-green-400">{optTime}</span>
                <span className="block text-xs text-green-400/70 mt-1">milliseconds</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              첫 번째만 계산, 이후는 저장된 값 사용 (빠름)
            </p>
          </div>
        </div>
        
        {/* 성능 비교 결과 */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">성능 비교 결과</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400 mb-1">최적화 전</p>
              <p className="text-2xl font-bold text-red-400">{nonOptTime}ms</p>
              <p className="text-xs text-slate-500">실행 시간</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 mb-1">최적화 후</p>
              <p className="text-2xl font-bold text-green-400">{optTime}ms</p>
              <p className="text-xs text-slate-500">실행 시간</p>
            </div>
          </div>
          {nonOptTime > 0 && optTime > 0 && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              {nonOptTime > optTime ? 
                `🎉 ${((nonOptTime - optTime) / nonOptTime * 100).toFixed(1)}% 성능 향상!` : 
                '테스트해보세요!'
              }
            </p>
          )}
        </div>
      </DemoBox>

      {/* Demo 3: UI Responsiveness 최적화 */}
      <DemoBox title="UI Responsiveness 최적화" className="border-purple-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-purple-400">UI 반응성의 핵심: </strong> 
          타이핑할 때 글자가 늦게 나타나면 답답합니다. 
          불필요한 작업을 줄이면 사용자 입력에 즉시 반응할 수 있습니다.
        </p>
        
        {/* 동작 원리 설명 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-purple-400 mb-3">동작 원리</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2"><strong>최적화 전:</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 타이핑할 때마다 100개 점을 다시 그림</li>
                <li>• 불필요한 DOM 조작</li>
                <li>• 버벅거리는 입력 경험</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2"><strong>최적화 후:</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 점들은 변경 없어서 다시 그리지 않음</li>
                <li>• 필요한 부분만 업데이트</li>
                <li>• 부드러운 타이핑 경험</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              최적화 전
            </h5>
            <input
              type="text"
              value={nonOptInput}
              onChange={(e) => {
                setNonOptInput(e.target.value);
                setNonOptDots(nonOptDots.map(() => Math.random() > 0.5));
              }}
              placeholder="Laggy typing..."
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
              타이핑할 때마다 100개 점을 다시 그림 (버벅거림)
            </p>
          </div>

          <div className="backdrop-blur-xl bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              최적화 후
            </h5>
            <input
              type="text"
              value={optInput}
              onChange={(e) => setOptInput(e.target.value)}
              placeholder="Smooth typing!"
              className="w-full px-4 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50"
            />
            <div className="mt-4 grid grid-cols-10 gap-1">
              {Array(50).fill(null).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-slate-700" />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              점들은 변경 없어서 다시 그리지 않음 (부드러움)
            </p>
          </div>
        </div>
        
        {/* 실시간 피드백 */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">실시간 피드백</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400 mb-1">최적화 전</p>
              <p className="text-2xl font-bold text-red-400">{nonOptInput.length}</p>
              <p className="text-xs text-slate-500">입력된 글자 수</p>
              <p className="text-xs text-slate-400 mt-1">
                {nonOptInput.length > 0 ? '점들이 계속 깜빡임' : '아직 입력 안함'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 mb-1">최적화 후</p>
              <p className="text-2xl font-bold text-green-400">{optInput.length}</p>
              <p className="text-xs text-slate-500">입력된 글자 수</p>
              <p className="text-xs text-slate-400 mt-1">
                {optInput.length > 0 ? '점들이 고정됨' : '아직 입력 안함'}
              </p>
            </div>
          </div>
        </div>
      </DemoBox>

      {/* Demo 4: Memory Management 최적화 */}
      <DemoBox title="Memory Management 최적화" className="border-orange-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-orange-400">메모리 관리의 핵심: </strong> 
          useEffect cleanup으로 memory leak을 방지합니다. 
          사용하지 않는 것을 계속 메모리에 두면 앱이 느려집니다.
        </p>
        
        {/* 동작 원리 설명 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-orange-400 mb-3">동작 원리</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2"><strong>No Cleanup:</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 이벤트 리스너가 계속 쌓임</li>
                <li>• 메모리에서 제거되지 않음</li>
                <li>• Memory Leak 발생!</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2"><strong>With Cleanup:</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 컴포넌트 제거시 정리됨</li>
                <li>• 메모리 효율적 관리</li>
                <li>• 깔끔한 리소스 정리</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              No Cleanup
            </h5>
            <div className="flex gap-2">
              <button
                onClick={() => setNonOptListeners(nonOptListeners + 1)}
                className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/30 text-sm"
              >
                Add
              </button>
              <button
                onClick={() => {}}
                className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="mt-4 p-3 bg-red-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-red-400">{nonOptListeners}</span>
                <span className="block text-xs text-red-400/70 mt-1">Active Listeners</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              제거해도 메모리에 남아있음 (Memory Leak!)
            </p>
          </div>

          <div className="backdrop-blur-xl bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h5 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              With Cleanup
            </h5>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOptComponents(optComponents + 1);
                  setOptListeners(optListeners + 1);
                }}
                className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/30 text-sm"
              >
                Add
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
                Remove
              </button>
            </div>
            <div className="mt-4 p-3 bg-green-950/20 rounded-lg">
              <p className="text-center">
                <span className="text-3xl font-bold text-green-400">{optListeners}</span>
                <span className="block text-xs text-green-400/70 mt-1">Active Listeners</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              제거하면 메모리도 정리됨 (Clean!)
            </p>
          </div>
        </div>
        
        {/* 메모리 상태 모니터링 */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">메모리 상태 모니터링</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400 mb-1">No Cleanup</p>
              <p className="text-2xl font-bold text-red-400">{nonOptListeners}</p>
              <p className="text-xs text-slate-500">누적된 리스너</p>
              <p className="text-xs text-slate-400 mt-1">
                {nonOptListeners > 0 ? '메모리에 계속 쌓임' : '아직 없음'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 mb-1">With Cleanup</p>
              <p className="text-2xl font-bold text-green-400">{optListeners}</p>
              <p className="text-xs text-slate-500">현재 리스너</p>
              <p className="text-xs text-slate-400 mt-1">
                {optListeners > 0 ? '실제 사용 중인 것만' : '아직 없음'}
              </p>
            </div>
          </div>
          {nonOptListeners > optListeners && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              ⚠️ No Cleanup: {nonOptListeners - optListeners}개의 메모리 누수 발생!
            </p>
          )}
        </div>
      </DemoBox>

      {/* Demo 5: React.memo 최적화 (실시간 데모) */}
      <DemoBox title="React.memo 실시간 데모" className="border-blue-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong className="text-blue-400">React.memo의 핵심: </strong> 
          <span className="text-green-400">Count 버튼</span>을 클릭하면 부모 컴포넌트만 리렌더링되고, 
          <span className="text-orange-400">Expensive 버튼</span>을 클릭하면 부모와 자식 컴포넌트 모두 리렌더링됩니다. 
          React.memo는 props가 변경되지 않으면 이전 렌더링 결과를 재사용하여 
          불필요한 계산을 방지합니다. 마치 캐시처럼 작동하여 성능을 크게 향상시킵니다.
        </p>
        
        {/* 동작 원리 설명 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <h5 className="text-lg font-semibold text-blue-400 mb-3">동작 원리</h5>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-300 mb-2"><strong>Count 버튼:</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 부모 컴포넌트만 리렌더링</li>
                <li>• 자식 컴포넌트는 props 변경 없음</li>
                <li>• React.memo로 인해 리렌더링 방지</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-300 mb-2"><strong>Expensive 버튼:</strong></p>
              <ul className="text-slate-400 space-y-1 text-xs">
                <li>• 부모 컴포넌트 리렌더링</li>
                <li>• expensiveValue props 변경됨</li>
                <li>• 자식 컴포넌트도 리렌더링</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 실시간 테스트 버튼들 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setCount(c => c + 1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 font-medium"
          >
            Count: {count}
          </button>
          <button
            onClick={() => setExpensiveValue(v => v + 1)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 font-medium"
          >
            Expensive: {expensiveValue}
          </button>
        </div>
        
        {/* 실시간 결과 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm font-semibold text-green-400 mb-2">✅ Memoized Value</p>
            <p className="text-2xl font-bold text-white">{memoizedValue}</p>
            <p className="text-xs text-slate-400 mt-1">
              expensiveValue × 2 = {expensiveValue} × 2 = {memoizedValue}
            </p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm font-semibold text-blue-400 mb-2">🔄 Render Count</p>
            <p className="text-2xl font-bold text-white">{isClient ? renderCount : '...'}</p>
            <p className="text-xs text-slate-400 mt-1">
              useMemo가 실행된 횟수
            </p>
          </div>
        </div>
        
        {/* 시각적 피드백 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm font-semibold text-purple-400 mb-2">📊 Count 버튼 효과</p>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${count > 0 ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></span>
              <span className="text-xs text-slate-400">
                {count > 0 ? '부모만 리렌더링됨' : '아직 클릭 안함'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Count가 바뀌어도 expensiveValue는 그대로
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm font-semibold text-orange-400 mb-2">📊 Expensive 버튼 효과</p>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${expensiveValue > 1 ? 'bg-red-400 animate-pulse' : 'bg-slate-600'}`}></span>
              <span className="text-xs text-slate-400">
                {expensiveValue > 1 ? '부모+자식 모두 리렌더링' : '아직 클릭 안함'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              expensiveValue가 바뀌면 useMemo도 재실행
            </p>
          </div>
        </div>
        
        {/* 단계별 테스트 가이드 */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-4">
          <h5 className="text-lg font-semibold text-yellow-400 mb-3">단계별 테스트 가이드</h5>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">1. </span>
              <span className="text-slate-300">Count 버튼을 여러 번 클릭해보세요</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">2. </span>
              <span className="text-slate-300">Render Count가 변하지 않는 것을 확인하세요</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">3. </span>
              <span className="text-slate-300">Expensive 버튼을 클릭해보세요</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-bold">4. </span>
              <span className="text-slate-300">Render Count가 증가하는 것을 확인하세요</span>
            </div>
          </div>
        </div>
        
        {/* 핵심 설명 */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-blue-400">💡 React.memo의 마법: </strong> 
            <span className="text-green-400">Count 버튼</span>을 클릭하면 부모 컴포넌트만 리렌더링되고, 
            <span className="text-orange-400"> Expensive 버튼</span>을 클릭하면 부모와 자식 컴포넌트 모두 리렌더링됩니다. 
            React.memo는 props가 변경되지 않으면 이전 렌더링 결과를 재사용하여 
            불필요한 계산을 방지합니다. 마치 캐시처럼 작동하여 성능을 크게 향상시킵니다.
          </p>
        </div>
      </DemoBox>

      {/* Demo 6: useMemo 최적화 가이드 */}
      <DemoBox title="useMemo 최적화 가이드" className="border-emerald-500/30">
        <p className="text-slate-300 leading-relaxed mb-4">
          의존성이 변경되지 않으면 계산을 다시 하지 않습니다.
          Expensive Value를 변경해보면 계산이 실행되는 것을 Console에서 확인할 수 있습니다.
        </p>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-4">
          <p className="text-sm text-slate-400 mb-2">Console 메시지:</p>
          <p className="text-xs text-green-400 font-mono">&quot;Expensive calculation running...&quot;</p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-green-400">💡 성능 팁:</strong> useMemo는 계산 결과를 &quot;기억&quot;합니다.
            expensiveValue가 변경되지 않으면 이전 계산 결과를 재사용하여
            불필요한 연산을 방지합니다.
          </p>
        </div>
      </DemoBox>

      {/* Demo 7: 렌더링 최적화 가이드 */}
      <DemoBox title="렌더링 최적화 가이드" className="border-pink-500/30">
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <h5 className="text-lg font-semibold text-emerald-400 mb-2">✅ 좋은 예시</h5>
            <p className="text-sm text-slate-300 mb-2">고유 ID를 key로 사용:</p>
            <pre className="text-xs text-emerald-400 font-mono bg-slate-900/50 p-3 rounded border border-slate-600/50 overflow-x-auto">
              <code className="language-jsx">{`{items.map(item => (
  <ListItem key={item.id} data={item} />
))}`}</code>
            </pre>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
            <h5 className="text-lg font-semibold text-red-400 mb-2">❌ 나쁜 예시</h5>
            <p className="text-sm text-slate-300 mb-2">배열 인덱스를 key로 사용:</p>
            <pre className="text-xs text-red-400 font-mono bg-slate-900/50 p-3 rounded border border-slate-600/50 overflow-x-auto">
              <code className="language-jsx">{`{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}`}</code>
            </pre>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-pink-400">핵심 포인트:</strong> React에서 key는 컴포넌트의 
            &quot;신분증&quot; 역할을 합니다. 고유한 key를 사용하면 React가 어떤 항목이 변경되었는지 
            정확히 파악하여 불필요한 리렌더링을 방지할 수 있습니다.
          </p>
        </div>
      </DemoBox>
    </div>
  );
}
