'use client';

import { useEffect, useState } from 'react';

import type React from 'react';
import type { ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const NoSSR: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? children : fallback;
};
