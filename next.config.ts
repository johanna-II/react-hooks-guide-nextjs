import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // TypeScript 설정
  typescript: {
    // 빌드 시 타입 검사 건너뛰기 (CI에서 별도로 실행)
    ignoreBuildErrors: false,
  },
  // Turbopack 설정 (experimental.turbo에서 이동됨)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // 빌드 최적화 설정
  compiler: {
    // 프로덕션 빌드에서 console 제거 (선택사항)
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 이미지 최적화 설정
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // 캐시 설정
  cacheMaxMemorySize: 1024 * 1024 * 256, // 256MB
  // 타입 검증 문제 해결을 위한 설정
  typedRoutes: false,
};

export default withNextIntl(nextConfig);
