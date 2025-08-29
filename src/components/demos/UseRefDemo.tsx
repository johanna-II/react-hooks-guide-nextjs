import React, { useRef, useState } from 'react';
import { Button, Card, DemoContainer } from '@/components/common';

const InputWithRef: React.FC = React.memo(() => {
  const inputRef = useRef<HTMLInputElement>(null);
  const countRef = useRef(0);
  const [displayCount, setDisplayCount] = useState(0);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const incrementRef = () => {
    countRef.current += 1;
  };

  const showRefValue = () => {
    setDisplayCount(countRef.current);
    alert(`Ref value: ${countRef.current}`);
  };

  return (
    <>
      <Card variant="bordered" className="mb-4">
        <p className="text-sm font-semibold text-green-400 mb-2">실시간 피드백</p>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Focus me!"
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500/50"
          />
          <p className="text-center text-slate-400 text-sm">
            Ref Count: {displayCount} (화면에 표시된 값)
          </p>
        </div>
      </Card>

      <div className="flex gap-2 flex-wrap justify-center">
        <Button onClick={focusInput} variant="success" size="sm">
          Focus Input
        </Button>
        <Button onClick={incrementRef} variant="primary" size="sm">
          Increment Ref
        </Button>
        <Button onClick={showRefValue} variant="secondary" size="sm">
          Show Ref Value
        </Button>
      </div>
    </>
  );
});

InputWithRef.displayName = 'InputWithRef';

export const UseRefDemo: React.FC = React.memo(() => {
  return (
    <DemoContainer
      title="useRef Hook"
      description="DOM 요소에 접근하거나 렌더링 간에 값을 유지합니다"
      tip="Ref 값이 변경되어도 화면이 업데이트되지 않습니다!"
    >
      <InputWithRef />
    </DemoContainer>
  );
});

UseRefDemo.displayName = 'UseRefDemo';
