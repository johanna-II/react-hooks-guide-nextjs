import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { ServerTranslationProvider } from '@/contexts/ServerTranslationContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { isValidLocale, type Locale } from '@/i18n/types';
import { getServerTranslations } from '@/lib/server-translations';

import type { Metadata, Viewport } from 'next';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const metadataByLocale: Record<Locale, Metadata> = {
    ko: {
      title: 'React Hooks 완벽 가이드 | 인터랙티브 학습 가이드',
      description:
        'React Hooks의 모든 것을 실시간 데모와 함께 배워보세요. useState, useEffect, useContext부터 React 19의 최신 기능까지 완벽 가이드',
      openGraph: {
        title: 'React Hooks 완벽 가이드',
        description: '실시간 데모와 함께하는 React Hooks 완벽 가이드',
        locale: 'ko_KR',
      },
    },
    en: {
      title: 'React Hooks Complete Guide | Interactive Learning Guide',
      description:
        'Learn everything about React Hooks with live demos. Complete guide from useState, useEffect, useContext to the latest React 19 features',
      openGraph: {
        title: 'React Hooks Complete Guide',
        description: 'Complete React Hooks guide with live demos',
        locale: 'en_US',
      },
    },
    ja: {
      title: 'React Hooks 完全ガイド | インタラクティブ学習ガイド',
      description:
        'ライブデモと一緒にReact Hooksのすべてを学びましょう。useState、useEffect、useContextからReact 19の最新機能まで完全ガイド',
      openGraph: {
        title: 'React Hooks 完全ガイド',
        description: 'ライブデモ付きReact Hooks完全ガイド',
        locale: 'ja_JP',
      },
    },
  };

  return {
    ...metadataByLocale[typedLocale],
    keywords: 'React, React Hooks, useState, useEffect, useContext, React 19, Next.js, TypeScript',
    authors: [{ name: 'React Study' }],
    twitter: {
      card: 'summary_large_image',
      ...metadataByLocale[typedLocale].openGraph,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // 유효한 로케일인지 확인
  if (!isValidLocale(locale)) {
    notFound();
  }

  // 메시지 로드
  const messages = await getMessages();

  // 서버사이드에서 번역 미리 처리 (API 키가 있을 때만)
  let serverTranslations: Record<string, string> = {};

  const hasValidApiKey =
    process.env.DEEPL_API_KEY &&
    process.env.DEEPL_API_KEY !== 'your_deepl_api_key_here' &&
    process.env.DEEPL_API_KEY.length > 10;

  if (locale !== 'ko' && hasValidApiKey) {
    try {
      serverTranslations = await getServerTranslations(locale as 'en' | 'ja');
    } catch {
      // 서버사이드 번역 실패 시 클라이언트에서 처리
      serverTranslations = {};
    }
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ServerTranslationProvider translations={serverTranslations} locale={locale}>
            <TranslationProvider>{children}</TranslationProvider>
          </ServerTranslationProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
