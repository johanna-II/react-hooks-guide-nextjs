'use client';

import { track } from '@vercel/analytics';

/**
 * 커스텀 분석 이벤트 트래킹
 */
export const trackEvent = {
    // 네비게이션 이벤트
    navigation: (section: string) => {
        track('navigate', { section });
    },

    // 데모 인터랙션
    demoInteraction: (demoName: string, action: string) => {
        track('demo_interaction', { demo: demoName, action });
    },

    // 코드 복사
    copyCode: (code: string) => {
        track('copy_code', { length: code.length });
    },

    // 탭 전환
    tabSwitch: (from: string, to: string) => {
        track('tab_switch', { from, to });
    },

    // 모바일/데스크톱 전환
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
        const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (perfData) {
            // 페이지 로드 시간
            const pageLoadTime = perfData.loadEventEnd - perfData.fetchStart;

            // DOM 준비 시간
            const domReadyTime = perfData.domContentLoadedEventEnd - perfData.fetchStart;

            // 서버 응답 시간
            const serverResponseTime = perfData.responseEnd - perfData.requestStart;

            track('page_performance', {
                pageLoadTime: Math.round(pageLoadTime),
                domReadyTime: Math.round(domReadyTime),
                serverResponseTime: Math.round(serverResponseTime),
            });
        }
    });
};
