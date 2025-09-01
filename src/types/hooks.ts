/**
 * Hook 관련 타입 정의
 * 단일 책임 원칙에 따라 hooks 전용 타입 분리
 */

import type { ReactNode } from 'react';

export interface HookExample {
  title: string;
  description: string;
  code: string;
  demo?: ReactNode;
}

export interface HookInfo {
  id: string;
  title: string;
  description: string;
  code: string;
  demo: ReactNode;
}

export type HookCategory = 'basic' | 'effect' | 'performance' | 'advanced';

export interface HookDefinition {
  category: HookCategory;
  examples: HookExample[];
}

// Counter Hook 관련 타입
export interface CounterState {
  count: number;
  min: number;
  max: number;
  step: number;
}

export interface CounterActions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setValue: (value: number) => void;
}

export type UseCounterReturn = CounterState & CounterActions;

// Timer Hook 관련 타입
export interface TimerState {
  seconds: number;
  isRunning: boolean;
}

export interface TimerActions {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export type UseTimerReturn = TimerState & TimerActions;

// Toggle Hook 관련 타입
export interface ToggleState {
  isOn: boolean;
}

export interface ToggleActions {
  toggle: () => void;
  setOn: () => void;
  setOff: () => void;
}

export type UseToggleReturn = [boolean, ToggleActions];

// Intersection Observer Hook 관련 타입
export interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

// Swipe Hook 관련 타입
export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

export interface SwipeState {
  direction: SwipeDirection;
  distance: number;
  velocity: number;
}

export interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
}
