# React Hooks 완벽 가이드 - Next.js 15

React Hooks의 모든 것을 실시간 데모와 함께 배우는 인터랙티브 학습 가이드입니다.

## 🌟 주요 기능

- 🎯 React Hooks 완벽 가이드 (useState, useEffect, useCallback, useMemo, useRef 등)
- 🚀 React 19 최신 기능 소개
- 💡 실시간 코드 데모
- 📱 모바일 최적화 UI
- 🌍 DeepL API를 활용한 실시간 다국어 지원 (한국어/영어/일본어)

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# DeepL API Key (필수)
DEEPL_API_KEY=your-deepl-api-key-here

# Pro API 사용 시 (선택사항)
# DEEPL_API_URL=https://api.deepl.com/v2/translate
```

### 2. DeepL API 키 발급

1. [DeepL Pro API](https://www.deepl.com/pro-api) 에서 무료 계정 생성
2. 무료 플랜: 월 500,000자 제한
3. API 키 복사

#### `.env.local` 파일 생성:

**⚠️ 중요: API 키 타입에 맞는 URL을 사용해야 합니다!**

```bash
# OPTION 1: 무료 API (키가 :fx로 끝남)
DEEPL_API_KEY=your_actual_api_key_here:fx  # 실제 API 키로 교체하세요!
DEEPL_API_URL=https://api-free.deepl.com/v2/translate

# OPTION 2: 유료 API (:fx 없음)  
DEEPL_API_KEY=your_actual_api_key_here  # 실제 API 키로 교체하세요!
DEEPL_API_URL=https://api.deepl.com/v2/translate
```

**❗ API 키 확인 방법:**
- 무료 API: 키가 `:fx`로 끝남 → `api-free.deepl.com` 사용
- 유료 API: 키에 `:fx` 없음 → `api.deepl.com` 사용
- **잘못된 엔드포인트 사용 시 403 오류 발생!**

### 3. 의존성 설치

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 🏗️ 기술 스택

- **Framework**: Next.js 15.5.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Translation**: DeepL API (실시간 번역)
- **Internationalization**: next-intl
- **Analytics**: Vercel Analytics & Speed Insights

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── translate/      # DeepL 번역 API
│   └── [locale]/           # 다국어 라우팅
├── components/             # React 컴포넌트
├── contexts/               # Context API
│   └── TranslationContext  # 실시간 번역 시스템
├── hooks/                  # 커스텀 훅
└── i18n/                   # 국제화 설정
```

## 🌐 실시간 번역 시스템

이 프로젝트는 정적 번역 파일 대신 DeepL API를 사용하여 실시간으로 번역을 제공합니다:

- 한국어 원본 텍스트는 코드에 내장
- 영어/일본어는 DeepL API로 실시간 번역
- 번역 결과는 서버 및 클라이언트에서 캐싱
- API 키는 서버에서만 사용 (보안)

## 🚀 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에서 프로젝트 Import
2. 환경 변수 설정:
   - `DEEPL_API_KEY`: DeepL API 키

### 환경 변수

프로덕션 환경에서 필요한 환경 변수:

- `DEEPL_API_KEY` (필수): DeepL API 인증 키
- `DEEPL_API_URL` (선택): Pro API 엔드포인트

## 📝 라이선스

MIT License

## 🤝 기여하기

Pull requests는 언제나 환영합니다. 주요 변경사항의 경우, 먼저 issue를 열어 논의해주세요.