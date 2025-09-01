'use client';

import dynamic from 'next/dynamic';
import { useOptimizedTranslations } from '@/hooks/useOptimizedTranslations';


const ReactHooksGuide = dynamic(
  () => import('@/components/ReactHooksGuide').then((mod) => mod.ReactHooksGuide),
  { 
    ssr: true,  // SSR 활성화로 서버사이드 번역 지원
    loading: () => <LoadingComponent />
  }
);

function LoadingComponent() {
  const t = useOptimizedTranslations();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-400">{t('loading')}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return <ReactHooksGuide />;
}