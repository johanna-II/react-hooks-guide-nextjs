import React from 'react';
import { Button, Card, DemoContainer } from '@/components/common';
import { useCounter, useTimer } from '@/hooks';

const TimerDisplay: React.FC<{ count: number; timerCount: number }> = React.memo(({ count, timerCount }) => (
  <Card variant="bordered" className="mb-4">
    <p className="text-sm font-semibold text-purple-400 mb-2">실시간 피드백</p>
    <div className="grid grid-cols-2 gap-4 text-center">
      <div>
        <p className="text-slate-400 mb-1">Count</p>
        <p className="text-2xl font-bold text-white">{count}</p>
      </div>
      <div>
        <p className="text-slate-400 mb-1">Timer</p>
        <p className="text-2xl font-bold text-green-400">{timerCount}s</p>
      </div>
    </div>
  </Card>
));

TimerDisplay.displayName = 'TimerDisplay';

export const UseEffectDemo: React.FC = React.memo(() => {
  const { count, increment } = useCounter();
  const { count: timerCount, isActive, toggle, reset } = useTimer();

  return (
    <DemoContainer
      title="useEffect Hook"
      description="부수 효과를 처리하고 cleanup을 수행합니다"
      tip="useEffect cleanup으로 타이머가 정리되어 메모리 누수를 방지합니다!"
    >
      <TimerDisplay count={count} timerCount={timerCount} />
      
      <div className="text-center space-y-4">
        <div className="flex gap-3 justify-center">
          <Button onClick={increment} variant="primary" size="sm">
            Increment Count
          </Button>
          <Button 
            onClick={toggle} 
            variant={isActive ? "danger" : "success"} 
            size="sm"
          >
            {isActive ? 'Stop Timer' : 'Start Timer'}
          </Button>
          <Button onClick={reset} variant="secondary" size="sm">
            Reset Timer
          </Button>
        </div>
      </div>
    </DemoContainer>
  );
});

UseEffectDemo.displayName = 'UseEffectDemo';
