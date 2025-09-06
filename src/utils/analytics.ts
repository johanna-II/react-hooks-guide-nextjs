'use client';

import { track } from '@vercel/analytics';

// Analytics 이벤트 속성 타입 정의
type EventProperties = Record<string, string | number | boolean>;

/**
 * 커스텀 분석 이벤트 트래킹
 */
export const trackEvent = (eventName: string, properties?: EventProperties) => {
  track(eventName, properties);
};

export const trackEventHelpers = {
  navigation: (section: string) => {
    trackEvent('navigate', { section });
  },

  demoInteraction: (demoName: string, action: string) => {
    trackEvent('demo_interaction', { demo: demoName, action });
  },

  copyCode: (code: string) => {
    trackEvent('copy_code', { length: code.length });
  },

  tabSwitch: (from: string, to: string) => {
    trackEvent('tab_switch', { from, to });
  },

  deviceSwitch: (device: 'mobile' | 'desktop') => {
    trackEvent('device_switch', { device });
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
