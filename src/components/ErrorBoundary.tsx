'use client';

import React, { Component } from 'react';

import { logError } from '@/utils/errors';

import { Button } from './common';

import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - 에러 경계 컴포넌트
 * 하위 컴포넌트의 에러를 캐치하고 대체 UI 표시
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, 'ErrorBoundary');
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.handleReset);
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">문제가 발생했습니다</h2>
            <p className="text-slate-300 mb-4">
              {error.message || '예상치 못한 오류가 발생했습니다.'}
            </p>
            <Button variant="danger" onClick={this.handleReset} className="w-full">
              다시 시도
            </Button>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * withErrorBoundary - HOC로 컴포넌트를 Error Boundary로 감싸기
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
