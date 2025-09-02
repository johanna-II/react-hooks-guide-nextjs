/**
 * 유효성 검사 유틸리티
 * 타입 가드 및 검증 함수
 */

/**
 * 값이 null이나 undefined가 아닌지 확인
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * 값이 비어있지 않은 문자열인지 확인
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * 값이 숫자이고 유한한지 확인
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * 값이 특정 범위 내의 숫자인지 확인
 */
export function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return isFiniteNumber(value) && value >= min && value <= max;
}

/**
 * 배열이 비어있지 않은지 확인
 */
export function isNonEmptyArray<T>(value: T[]): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * 객체가 특정 키를 가지고 있는지 확인
 */
export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URL 유효성 검사
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 전화번호 유효성 검사 (한국)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+82|0)[\d-]+$/;
  const cleaned = phone.replace(/[\s-]/g, '');
  return phoneRegex.test(cleaned) && cleaned.length >= 10;
}

/**
 * 날짜 유효성 검사
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * ISO 날짜 문자열 유효성 검사
 */
export function isValidISODateString(dateString: string): boolean {
  const date = new Date(dateString);
  return isValidDate(date) && date.toISOString() === dateString;
}
