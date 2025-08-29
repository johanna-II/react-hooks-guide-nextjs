import { ReactNode } from 'react';

// 루트 레이아웃은 최소한의 설정만 포함
// 실제 레이아웃은 [locale]/layout.tsx에서 처리
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}