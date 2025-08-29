import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/types';

export default createMiddleware({
  // 지원하는 언어 목록
  locales,
  
  // 기본 언어
  defaultLocale,
  
  // 브라우저 언어 자동 감지 활성화
  localeDetection: true,
  
  // 로케일 접두사 설정 (always: 항상 URL에 로케일 표시)
  localePrefix: 'always'
});

// 미들웨어가 적용될 경로 설정
export const config = {
  // API 라우트, 정적 파일, 이미지 등을 제외한 모든 경로에 적용
  matcher: [
    // 모든 경로를 매칭하되 특정 경로는 제외
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // 루트 경로 포함
    '/'
  ]
};
