'use client';

import React from 'react';

import { Card } from '@/components/common';

interface WhyHooksSectionItem {
  titleKey: string;
  icon: string;
  descKey: string;
  detailKey: string;
  gradient: string;
}

interface WhyHooksSectionProps {
  title: string;
  items: WhyHooksSectionItem[];
  className?: string;
}

/**
 * WhyHooksSection - React Hooks를 사용하는 이유 섹션
 * 단일 책임: Why Hooks 정보 표시
 */
export const WhyHooksSection: React.FC<WhyHooksSectionProps> = React.memo(
  ({ title, items, className = '' }) => {
    return (
      <section id="why-hooks" className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <Card
                key={index}
                variant="gradient"
                className={`bg-gradient-to-br ${item.gradient} transform transition-all hover:scale-105`}
              >
                <div className="text-center mb-4">
                  <span className="text-5xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.titleKey}</h3>
                <p className="text-white/90">{item.descKey}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

WhyHooksSection.displayName = 'WhyHooksSection';
