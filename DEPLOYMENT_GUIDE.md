# Vercel 배포 가이드

## 사전 준비사항

### 1. Vercel 계정 설정

1. [Vercel](https://vercel.com)에 가입
2. GitHub 계정 연동

### 2. Vercel 토큰 생성

1. [Vercel Tokens](https://vercel.com/account/tokens) 페이지 접속
2. "Create Token" 클릭
3. 토큰 이름 입력 (예: `github-actions`)
4. 토큰 복사 및 안전한 곳에 저장

### 3. 프로젝트 ID 확인

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel link

# .vercel/project.json 파일에서 확인
cat .vercel/project.json
```

## GitHub Actions 설정

### 1. GitHub Secrets 추가

Repository → Settings → Secrets and variables → Actions

필수 시크릿:

- `VERCEL_TOKEN`: Vercel 액세스 토큰
- `VERCEL_ORG_ID`: 조직 ID (개인 계정은 사용자 ID)
- `VERCEL_PROJECT_ID`: 프로젝트 ID
- `DEEPL_API_KEY`: DeepL API 키
- `DEEPL_API_URL`: DeepL API URL

### 2. 환경 변수 설정

**Vercel 대시보드에서 설정:**

1. 프로젝트 → Settings → Environment Variables
2. 다음 변수 추가:
   ```
   DEEPL_API_KEY=your_api_key
   DEEPL_API_URL=https://api-free.deepl.com/v2/translate
   ```

## 배포 프로세스

### 자동 배포 (권장)

- `main` 브랜치에 push 시 자동 배포
- GitHub Actions가 빌드 및 배포 처리

### 수동 배포

```bash
# 로컬에서 빌드
pnpm build

# Vercel에 배포
vercel --prod
```

## 배포 상태 확인

### 1. GitHub Actions

- Actions 탭에서 워크플로우 실행 상태 확인
- 실패 시 로그 확인

### 2. Vercel 대시보드

- [Vercel Dashboard](https://vercel.com/dashboard)에서 배포 상태 확인
- 도메인 및 환경 변수 관리

## 문제 해결

### 인증 오류

```bash
Error: No existing credentials found
```

**해결:** GitHub Secrets에 `VERCEL_TOKEN` 추가

### 빌드 오류

```bash
Error: Build failed
```

**해결:**

1. 로컬에서 `pnpm build` 테스트
2. 환경 변수 확인
3. Node.js 버전 확인 (20.x 권장)

### 환경 변수 누락

```bash
Error: DEEPL_API_KEY is not defined
```

**해결:** Vercel 대시보드에서 환경 변수 추가

## 모니터링

### 1. 성능 모니터링

- Vercel Analytics 활성화
- Web Vitals 추적

### 2. 에러 추적

- Vercel Functions 로그 확인
- Sentry 통합 고려

## 최적화 팁

### 1. 빌드 최적화

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["icn1"], // 서울 리전
  "functions": {
    "src/app/api/translate/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### 2. 캐싱 전략

- ISR (Incremental Static Regeneration) 활용
- Edge 캐싱으로 번역 API 부하 감소

### 3. 환경별 배포

- Production: `main` 브랜치
- Preview: PR 생성 시 자동 배포
- Development: `develop` 브랜치

## 보안 고려사항

1. **API 키 관리**
   - 절대 코드에 하드코딩하지 않음
   - 환경 변수로만 관리

2. **CORS 설정**
   - 허용된 도메인만 API 접근 가능하도록 설정

3. **Rate Limiting**
   - 번역 API 남용 방지
   - Vercel Edge Functions로 구현

## 유용한 명령어

```bash
# 로그 확인
vercel logs

# 환경 변수 확인
vercel env ls

# 도메인 관리
vercel domains ls

# 프로젝트 정보
vercel inspect

# 롤백
vercel rollback
```

## 연락처

배포 관련 문제 발생 시:

1. Vercel 지원팀: https://vercel.com/support
2. GitHub Issues에 문제 제보
3. Vercel 커뮤니티 포럼
