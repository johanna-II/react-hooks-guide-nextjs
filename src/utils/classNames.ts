/**
 * className 유틸리티 함수
 * 조건부 클래스명 처리 및 중복 제거
 */

type ClassValue = string | number | boolean | undefined | null;
type ClassObject = Record<string, boolean>;
type ClassArray = ClassValue[];

/**
 * 클래스명을 조합하는 유틸리티 함수
 * @param classes - 클래스명 배열 또는 객체
 * @returns 조합된 클래스명 문자열
 *
 * @example
 * ```tsx
 * cn('btn', 'btn-primary', isActive && 'active')
 * cn({ 'btn': true, 'btn-disabled': disabled })
 * ```
 */
export function cn(...classes: (ClassValue | ClassObject | ClassArray)[]): string {
  const classList: string[] = [];

  for (const item of classes) {
    if (!item) continue;

    if (typeof item === 'string') {
      classList.push(item);
    } else if (typeof item === 'object' && !Array.isArray(item)) {
      for (const [key, value] of Object.entries(item)) {
        if (value) classList.push(key);
      }
    } else if (Array.isArray(item)) {
      const result = cn(...item);
      if (result) classList.push(result);
    }
  }

  return [...new Set(classList)].join(' ').trim();
}

/**
 * Tailwind 변형(variant) 스타일을 생성하는 헬퍼
 */
export function createVariantStyles<T extends string>(
  variants: Record<T, string>
): Record<T, string> {
  return variants;
}

/**
 * 반응형 클래스를 생성하는 헬퍼
 */
export function responsive(
  base: string,
  breakpoints: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  }
): string {
  const classes = [base];

  if (breakpoints.sm) classes.push(`sm:${breakpoints.sm}`);
  if (breakpoints.md) classes.push(`md:${breakpoints.md}`);
  if (breakpoints.lg) classes.push(`lg:${breakpoints.lg}`);
  if (breakpoints.xl) classes.push(`xl:${breakpoints.xl}`);

  return classes.join(' ');
}
