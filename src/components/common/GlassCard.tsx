'use client';

import React from 'react';
import { GlassCardProps } from '@/types';

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  gradient = '' 
}) => {
  return (
    <div className={`relative group h-full ${className}`}>
      {gradient && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          aria-hidden="true"
        />
      )}
      <div className="relative h-full backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col">
        {children}
      </div>
    </div>
  );
};
