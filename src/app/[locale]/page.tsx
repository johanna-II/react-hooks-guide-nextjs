'use client';

import dynamic from 'next/dynamic';

import { TranslationLoader } from '@/components/TranslationLoader';

const ReactHooksGuide = dynamic(
  () => import('@/components/ReactHooksGuide').then((mod) => mod.ReactHooksGuide),
  {
    ssr: true, // SSR 활성화로 서버사이드 번역 지원
    loading: () => null, // TranslationLoader가 로딩을 처리
  }
);

export default function Home() {
  return (
    <TranslationLoader>
      <ReactHooksGuide />
    </TranslationLoader>
  );
}
