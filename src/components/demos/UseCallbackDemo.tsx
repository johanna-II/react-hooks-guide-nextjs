import React from 'react';

import { Button, Card, DemoContainer } from '@/components/common';
import { useCounter } from '@/hooks';
import { useOptimizedTranslations } from '@/hooks/useOptimizedTranslations';

const FeedbackCard: React.FC<{ count: number }> = React.memo(({ count }) => {
  const t = useOptimizedTranslations();

  return (
    <Card variant="bordered" className="mb-4">
      <p className="text-sm font-semibold text-blue-400 mb-2">{t('demo.feedback')}</p>
      <div className="text-center">
        <p className="text-2xl font-bold text-white">{count}</p>
      </div>
    </Card>
  );
});

FeedbackCard.displayName = 'FeedbackCard';

export const UseCallbackDemo: React.FC = React.memo(() => {
  const { count, increment, decrement } = useCounter({ initialValue: 0 });
  const t = useOptimizedTranslations();

  return (
    <DemoContainer
      title="useCallback Hook"
      description={t('demo.useCallback.description')}
      tip={t('demo.useCallback.tip')}
    >
      <FeedbackCard count={count} />

      <div className="text-center">
        <div className="flex gap-3 justify-center mb-4">
          <Button onClick={decrement} variant="danger" size="sm">
            {t('demo.decrement')}
          </Button>
          <Button onClick={increment} variant="success" size="sm">
            {t('demo.increment')}
          </Button>
        </div>
      </div>
    </DemoContainer>
  );
});

UseCallbackDemo.displayName = 'UseCallbackDemo';
