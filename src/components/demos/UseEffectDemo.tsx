import React from 'react';

import { Button, Card, DemoContainer } from '@/components/common';
import { useCounter, useTimer } from '@/hooks';
import { useTranslations } from '@/hooks/useTranslations';

const TimerDisplay: React.FC<{ count: number; timerCount: number }> = React.memo(
  ({ count, timerCount }) => {
    const t = useTranslations();

    return (
      <Card variant="bordered" className="mb-4">
        <p className="text-sm font-semibold text-purple-400 mb-2">{t('demo.feedback')}</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-slate-400 mb-1">{t('demo.count')}</p>
            <p className="text-2xl font-bold text-white">{count}</p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">{t('demo.timer')}</p>
            <p className="text-2xl font-bold text-green-400">
              {timerCount}
              {t('demo.seconds')}
            </p>
          </div>
        </div>
      </Card>
    );
  }
);

TimerDisplay.displayName = 'TimerDisplay';

export const UseEffectDemo: React.FC = React.memo(() => {
  const { count, increment } = useCounter();
  const { count: timerCount, isActive, toggle, reset } = useTimer();
  const t = useTranslations();

  return (
    <DemoContainer
      title="useEffect Hook"
      description={t('demo.useEffect.description')}
      tip={t('demo.useEffect.tip')}
    >
      <TimerDisplay count={count} timerCount={timerCount} />

      <div className="text-center space-y-4">
        <div className="flex gap-3 justify-center">
          <Button onClick={increment} variant="primary" size="sm">
            {t('demo.incrementCount')}
          </Button>
          <Button onClick={toggle} variant={isActive ? 'danger' : 'success'} size="sm">
            {isActive ? t('demo.stopTimer') : t('demo.startTimer')}
          </Button>
          <Button onClick={reset} variant="secondary" size="sm">
            {t('demo.resetTimer')}
          </Button>
        </div>
      </div>
    </DemoContainer>
  );
});

UseEffectDemo.displayName = 'UseEffectDemo';
