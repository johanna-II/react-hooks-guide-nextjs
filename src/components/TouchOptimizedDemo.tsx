'use client';

import React, { useState, useRef, useEffect } from 'react';

import { useTranslations } from '@/hooks/useTranslations';

interface TouchDemoProps {
  title: string;
  description: string;
  demoType: 'gesture' | 'swipe' | 'pinch' | 'drag';
}

export const TouchOptimizedDemo: React.FC<TouchDemoProps> = React.memo(
  ({ title, description, demoType }) => {
    const t = useTranslations();
    const [gesture, setGesture] = useState<string>(t('touch.noGesture'));
    const [swipeDirection, setSwipeDirection] = useState<string>(t('touch.swipeHint'));
    const [scale, setScale] = useState<number>(1);
    const [position, setPosition] = useState({ x: 100, y: 80 });
    const [isDragging, setIsDragging] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragElementRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number; distance?: number }>({ x: 0, y: 0 });
    const dragStateRef = useRef({
      isDragging: false,
      startOffset: { x: 0, y: 0 },
      currentPos: { x: 100, y: 80 },
    });

    useEffect(() => {
      if (demoType !== 'drag' || !dragElementRef.current) return;

      const element = dragElementRef.current;
      const container = containerRef.current;
      if (!container) return;

      dragStateRef.current.currentPos = { x: position.x, y: position.y };

      const handleStart = (clientX: number, clientY: number) => {
        dragStateRef.current.isDragging = true;
        const rect = container.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        dragStateRef.current.startOffset.x = mouseX - dragStateRef.current.currentPos.x;
        dragStateRef.current.startOffset.y = mouseY - dragStateRef.current.currentPos.y;

        setIsDragging(true);
      };

      const handleMove = (clientX: number, clientY: number) => {
        if (!dragStateRef.current.isDragging) return;

        const rect = container.getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const newX = mouseX - dragStateRef.current.startOffset.x;
        const newY = mouseY - dragStateRef.current.startOffset.y;

        const clampedX = Math.max(32, Math.min(rect.width - 32, newX));
        const clampedY = Math.max(32, Math.min(rect.height - 32, newY));

        dragStateRef.current.currentPos.x = clampedX;
        dragStateRef.current.currentPos.y = clampedY;

        setPosition({ x: clampedX, y: clampedY });
      };

      const handleEnd = () => {
        dragStateRef.current.isDragging = false;
        setIsDragging(false);
      };

      const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
      };

      const handleMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
      };

      const handleMouseUp = () => {
        handleEnd();
      };

      const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (dragStateRef.current.isDragging) {
          e.preventDefault();
          e.stopPropagation();
          const touch = e.touches[0];
          handleMove(touch.clientX, touch.clientY);
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        if (dragStateRef.current.isDragging) {
          e.preventDefault();
          e.stopPropagation();
          handleEnd();
        }
      };

      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('touchstart', handleTouchStart, { passive: false });

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [demoType]);

    useEffect(() => {
      if (demoType === 'drag') return;

      const container = containerRef.current;
      if (!container) return;

      const handleStart = (
        clientX: number,
        clientY: number,
        isPinch: boolean = false,
        secondTouch?: { clientX: number; clientY: number }
      ) => {
        touchStartRef.current = { x: clientX, y: clientY };
        setIsPressed(true);

        if (isPinch && secondTouch && demoType === 'pinch') {
          const distance = Math.hypot(clientX - secondTouch.clientX, clientY - secondTouch.clientY);
          touchStartRef.current.distance = distance;
        }
      };

      const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];

        if (e.touches.length === 2 && demoType === 'pinch') {
          e.preventDefault();
          const touch2 = e.touches[1];
          handleStart(touch.clientX, touch.clientY, true, {
            clientX: touch2.clientX,
            clientY: touch2.clientY,
          });
        } else {
          handleStart(touch.clientX, touch.clientY);
        }
      };

      const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
      };

      const handleMove = (
        clientX: number,
        clientY: number,
        isPinch: boolean = false,
        secondTouch?: { clientX: number; clientY: number }
      ) => {
        if (isPinch && secondTouch && demoType === 'pinch') {
          const distance = Math.hypot(clientX - secondTouch.clientX, clientY - secondTouch.clientY);

          if (touchStartRef.current.distance) {
            const scaleChange = distance / touchStartRef.current.distance;
            setScale((prev) => Math.max(0.5, Math.min(3, prev * scaleChange)));
          }
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];

        if (e.touches.length === 2 && demoType === 'pinch') {
          e.preventDefault();
          const touch2 = e.touches[1];
          handleMove(touch.clientX, touch.clientY, true, {
            clientX: touch2.clientX,
            clientY: touch2.clientY,
          });
        } else {
          handleMove(touch.clientX, touch.clientY);
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (touchStartRef.current.x !== 0) {
          handleMove(e.clientX, e.clientY);
        }
      };

      const handleEnd = (clientX: number, clientY: number) => {
        setIsPressed(false);

        if (touchStartRef.current.x === 0) return;

        const deltaX = clientX - touchStartRef.current.x;
        const deltaY = clientY - touchStartRef.current.y;
        const threshold = 50;

        if (demoType === 'gesture') {
          if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              setGesture(deltaX > 0 ? t('touch.rightSwipe') : t('touch.leftSwipe'));
            } else {
              setGesture(deltaY > 0 ? t('touch.downSwipe') : t('touch.upSwipe'));
            }
          } else {
            setGesture(t('touch.tap'));
          }
        } else if (demoType === 'swipe') {
          if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              setSwipeDirection(deltaX > 0 ? t('touch.swipeRightTo') : t('touch.swipeLeftTo'));
            } else {
              setSwipeDirection(deltaY > 0 ? t('touch.swipeDownTo') : t('touch.swipeUpTo'));
            }
          } else {
            setSwipeDirection(t('touch.click'));
          }
        }

        touchStartRef.current = { x: 0, y: 0 };
      };

      const handleTouchEnd = (e: TouchEvent) => {
        const touch = e.changedTouches[0];

        if (demoType === 'gesture' || demoType === 'swipe') {
          e.preventDefault();
        }

        handleEnd(touch.clientX, touch.clientY);
      };

      const handleMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        handleEnd(e.clientX, e.clientY);
      };

      container.addEventListener('touchstart', handleTouchStart, { passive: demoType !== 'pinch' });
      container.addEventListener('touchmove', handleTouchMove, { passive: demoType !== 'pinch' });
      container.addEventListener('touchend', handleTouchEnd, {
        passive: demoType !== 'gesture' && demoType !== 'swipe',
      });

      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', () => {
        touchStartRef.current = { x: 0, y: 0 };
        setIsPressed(false);
      });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
      };
    }, [demoType, t]);

    const renderDemo = () => {
      switch (demoType) {
        case 'gesture':
          return (
            <div className="text-center space-y-4">
              <div
                className={`w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold cursor-pointer select-none transition-transform duration-100 ${
                  isPressed ? 'scale-95' : 'scale-100'
                }`}
              >
                {t('touch.touch')}
              </div>
              <p className="text-base font-medium text-white transition-all duration-200">
                {gesture}
              </p>
              <p className="text-xs text-slate-400">{t('touch.touchGestureHint')}</p>
            </div>
          );

        case 'swipe':
          return (
            <div className="text-center space-y-4">
              <div
                className={`w-28 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer select-none transition-transform duration-100 ${
                  isPressed ? 'scale-95' : 'scale-100'
                }`}
              >
                {swipeDirection}
              </div>
              <p className="text-xs text-slate-400">{t('touch.swipeOrDragHint')}</p>
            </div>
          );

        case 'pinch':
          return (
            <div className="text-center space-y-4">
              <div
                className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold transition-transform duration-200"
                style={{ transform: `scale(${scale})` }}
              >
                {t('touch.pinch')}
              </div>
              <p className="text-base font-medium text-white">
                {t('touch.scale')}: {scale.toFixed(2)}x
              </p>
              <p className="text-xs text-slate-400">{t('touch.pinchHint')}</p>
            </div>
          );

        case 'drag':
          return (
            <div className="text-center space-y-4">
              <div
                className="relative w-full h-40 bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden"
                ref={containerRef}
                data-interactive
                style={{ touchAction: 'none' }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                <div
                  ref={dragElementRef}
                  className="absolute w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold cursor-move select-none touch-manipulation"
                  data-interactive
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  style={{
                    left: `${position.x - 32}px`,
                    top: `${position.y - 32}px`,
                    transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                    transition: isDragging ? 'transform 0.1s' : 'transform 0.1s, left 0s, top 0s',
                  }}
                >
                  {t('touch.drag')}
                </div>
              </div>
              <p className="text-xs text-slate-400">{t('touch.dragHint')}</p>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50" data-interactive>
        <h4 className="text-sm font-bold text-white mb-1.5">{title}</h4>
        <p className="text-xs text-slate-300 mb-3">{description}</p>

        <div
          ref={containerRef}
          className="touch-manipulation"
          style={{ touchAction: demoType === 'drag' || demoType === 'pinch' ? 'none' : 'pan-y' }}
          data-interactive
        >
          {renderDemo()}
        </div>

        {/* ?곗튂 ?뚰듃 */}
        <div className="mt-3 p-2.5 bg-slate-900/50 rounded-lg">
          <p className="text-[10px] text-slate-400 text-center">{t('touch.touchMouseSupport')}</p>
        </div>
      </div>
    );
  }
);

TouchOptimizedDemo.displayName = 'TouchOptimizedDemo';
