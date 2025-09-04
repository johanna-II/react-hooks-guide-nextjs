'use client';

import { track } from '@vercel/analytics';

/**
 * 커스텀 분석 이벤트 트래킹
 */
export const trackEvent = {
  navigation: (section: string) => {
    track('navigate', { section });
  },

  demoInteraction: (demoName: string, action: string) => {
    track('demo_interaction', { demo: demoName, action });
  },

  copyCode: (code: string) => {
    track('copy_code', { length: code.length });
  },

  tabSwitch: (from: string, to: string) => {
    track('tab_switch', { from, to });
  },

  deviceSwitch: (device: 'mobile' | 'desktop') => {
    track('device_switch', { device });
  },
};

/**
 * 페이지 성능 측정
 */
export const measurePagePerformance = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const perfData = window.performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (perfData) {
      const pageLoadTime = perfData.loadEventEnd - perfData.fetchStart;

      const domReadyTime = perfData.domContentLoadedEventEnd - perfData.fetchStart;

      const serverResponseTime = perfData.responseEnd - perfData.requestStart;

      track('page_performance', {
        pageLoadTime: Math.round(pageLoadTime),
        domReadyTime: Math.round(domReadyTime),
        serverResponseTime: Math.round(serverResponseTime),
      });
    }
  });
};
