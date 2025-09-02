'use client';

import { useState, useCallback } from 'react';

import type { UseToggleReturn } from '@/types/hooks';

/**
 * useToggle - 토글 상태 관리 Hook
 *
 * @param initialValue - 초기 상태값 (기본: false)
 * @returns [현재 상태, 액션 함수들] 튜플
 *
 * @example
 * ```tsx
 * const [isOpen, { toggle, setOn, setOff }] = useToggle(false);
 * ```
 */
export function useToggle(initialValue = false): UseToggleReturn {
  const [isOn, setIsOn] = useState(initialValue);

  const toggle = useCallback(() => {
    setIsOn((prev) => !prev);
  }, []);

  const setOn = useCallback(() => {
    setIsOn(true);
  }, []);

  const setOff = useCallback(() => {
    setIsOn(false);
  }, []);

  const actions = { toggle, setOn, setOff };

  return [isOn, actions];
}
