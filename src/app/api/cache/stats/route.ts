import { NextResponse } from 'next/server';

import { persistentCache } from '@/lib/persistent-cache';

/**
 * 캐시 통계 조회 엔드포인트
 */
export async function GET() {
  try {
    const stats = await persistentCache.getStats();

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get cache stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 캐시 클리어 엔드포인트
 */
export async function DELETE() {
  try {
    await persistentCache.clear();

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear cache',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
