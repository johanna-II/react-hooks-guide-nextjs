'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useServerTranslations } from '@/contexts/ServerTranslationContext';
import { useOptimizedTranslations } from '@/hooks/useOptimizedTranslations';

export function TranslationDebug() {
  const locale = useLocale();
  const serverTranslations = useServerTranslations();
  const t = useOptimizedTranslations();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);

  useEffect(() => {
    // API 상태 확인
    fetch('/api/translate')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(err => setApiStatus({ error: err.message }));

    // 디버그 정보 가져오기
    fetch('/api/debug')
      .then(res => res.json())
      .then(data => setDebugInfo(data))
      .catch(err => setDebugInfo({ error: err.message }));
  }, []);

  // 개발 환경이 아니면 렌더링하지 않음
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-black/80 text-white p-4 rounded-lg text-xs font-mono overflow-auto max-h-96 z-50">
      <h3 className="font-bold mb-2">Translation Debug</h3>
      
      <div className="mb-2">
        <strong>Locale:</strong> {locale}
      </div>
      
      <div className="mb-2">
        <strong>Server Translations:</strong>
        <pre className="bg-black/50 p-1 rounded mt-1 overflow-x-auto">
          {JSON.stringify({
            count: Object.keys(serverTranslations?.translations || {}).length,
            sample: Object.entries(serverTranslations?.translations || {}).slice(0, 3)
          }, null, 2)}
        </pre>
      </div>

      <div className="mb-2">
        <strong>API Status:</strong>
        <pre className="bg-black/50 p-1 rounded mt-1 overflow-x-auto">
          {JSON.stringify(apiStatus, null, 2)}
        </pre>
      </div>

      <div className="mb-2">
        <strong>Debug Info:</strong>
        <pre className="bg-black/50 p-1 rounded mt-1 overflow-x-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div className="mb-2">
        <strong>Translation Test:</strong>
        <div>원본: React Hooks 가이드</div>
        <div>번역: {t('title')}</div>
      </div>
    </div>
  );
}
