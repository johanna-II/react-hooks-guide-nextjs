import React from 'react';
import { Button, Card, DemoContainer } from '@/components/common';
import { useCounter } from '@/hooks';

const FeedbackCard: React.FC<{ count: number }> = React.memo(({ count }) => (
  <Card variant="bordered" className="mb-4">
    <p className="text-sm font-semibold text-blue-400 mb-2">실시간 피드백</p>
    <div className="text-center">
      <p className="text-2xl font-bold text-white">{count}</p>
    </div>
  </Card>
));

FeedbackCard.displayName = 'FeedbackCard';

export const UseCallbackDemo: React.FC = React.memo(() => {
  const { count, increment, decrement } = useCounter({ initialValue: 0 });

  return (
    <DemoContainer
      title="useCallback Hook"
      description="함수를 메모이제이션하여 성능을 최적화합니다"
      tip="useCallback으로 함수가 메모이제이션되어 불필요한 리렌더링을 방지합니다!"
    >
      <FeedbackCard count={count} />
      
      <div className="text-center">
        <div className="flex gap-3 justify-center mb-4">
          <Button onClick={decrement} variant="danger" size="sm">
            -
          </Button>
          <Button onClick={increment} variant="success" size="sm">
            +
          </Button>
        </div>
      </div>
    </DemoContainer>
  );
});

UseCallbackDemo.displayName = 'UseCallbackDemo';
