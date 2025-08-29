'use client';

import React, { ReactNode, useEffect, useState } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const NoSSR: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <>{fallback}</>;
};
