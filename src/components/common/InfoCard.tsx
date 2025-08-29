'use client';

import React from 'react';
import { InfoCardProps } from '@/types';

export const InfoCard: React.FC<InfoCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-6 ${className}`}>
      {children}
    </div>
  );
};
