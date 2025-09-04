'use client';

import React from 'react';

import { Card } from '@/components/common';

import type { SectionProps } from '@/types/components';

export interface WhyHooksItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface WhyHooksSectionProps extends SectionProps {
  title: string;
  items: WhyHooksItem[];
}

/**
 * WhyHooksSection - React Hooks瑜??ъ슜?섎뒗 ?댁쑀 ?뱀뀡
 * ?⑥씪 梨낆엫: Why Hooks ?뺣낫 ?쒖떆
 */
export const WhyHooksSection: React.FC<WhyHooksSectionProps> = React.memo(
  ({ title, items, className = '' }) => {
    return (
      <section id="why-hooks" className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">{title}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <Card
                key={`why-hook-${index}`}
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  {item.icon}
                  <h3 className="text-xl font-bold text-white ml-3">{item.title}</h3>
                </div>
                <p className="text-slate-300">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

WhyHooksSection.displayName = 'WhyHooksSection';
