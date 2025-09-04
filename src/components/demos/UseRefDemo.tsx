import React, { useRef, useState } from 'react';

import { Button, Card, DemoContainer } from '@/components/common';
import { useTranslations } from '@/hooks/useTranslations';

const InputWithRef: React.FC = React.memo(() => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const countRef = useRef(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const incrementRef = () => {
    countRef.current += 1;
  };

  const showRefValue = () => {
    setDisplayCount(countRef.current);
    setShowNotification(true);
    // Auto-hide notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <>
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <Card variant="bordered" className="bg-slate-800 border-green-500/50 px-4 py-3">
            <p className="text-green-400 text-sm font-medium">
              {t('demo.refValueAlert').replace('{value}', countRef.current.toString())}
            </p>
          </Card>
        </div>
      )}

      <Card variant="bordered" className="mb-4">
        <p className="text-sm font-semibold text-green-400 mb-2">{t('demo.feedback')}</p>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            placeholder={t('demo.focusMePlaceholder')}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500/50"
          />
          <p className="text-center text-slate-400 text-sm">
            {t('demo.refCountDisplay').replace('{count}', displayCount.toString())}
          </p>
        </div>
      </Card>

      <div className="flex gap-2 flex-wrap justify-center">
        <Button onClick={focusInput} variant="success" size="sm">
          {t('demo.focusInput')}
        </Button>
        <Button onClick={incrementRef} variant="primary" size="sm">
          {t('demo.incrementRef')}
        </Button>
        <Button onClick={showRefValue} variant="secondary" size="sm">
          {t('demo.showRefValue')}
        </Button>
      </div>
    </>
  );
});

InputWithRef.displayName = 'InputWithRef';

export const UseRefDemo: React.FC = React.memo(() => {
  const t = useTranslations();

  return (
    <DemoContainer
      title="useRef Hook"
      description={t('demo.useRef.description')}
      tip={t('demo.useRef.tip')}
    >
      <InputWithRef />
    </DemoContainer>
  );
});

UseRefDemo.displayName = 'UseRefDemo';
