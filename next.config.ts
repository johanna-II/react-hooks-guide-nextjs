import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

// 빌드 시점 환경변수 확인
console.log('=== Build Time Environment Check ===');
console.log('DEEPL_API_KEY exists:', !!process.env.DEEPL_API_KEY);
console.log('DEEPL_API_KEY length:', process.env.DEEPL_API_KEY?.length || 0);
console.log('DEEPL_API_URL:', process.env.DEEPL_API_URL || 'not set');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('===================================');

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
};

export default withNextIntl(nextConfig);
