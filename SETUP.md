# 🚀 DeepL 실시간 번역 설정 가이드

## 1. 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# Windows PowerShell
New-Item .env.local -ItemType File

# Mac/Linux
touch .env.local
```

## 2. DeepL API 키 추가

`.env.local` 파일에 다음 내용을 추가:

```env
# DeepL API Key (필수)
DEEPL_API_KEY=your-deepl-api-key-here

# Pro API 사용 시 (선택사항)
# DEEPL_API_URL=https://api.deepl.com/v2/translate
```

## 3. DeepL API 키 발급 방법

1. **DeepL 계정 생성**
   - https://www.deepl.com/pro-api 방문
   - "Sign up for free" 클릭
   - 이메일로 계정 생성

2. **API 키 확인**
   - 로그인 후 계정 설정으로 이동
   - API 키 섹션에서 키 복사
   - 무료 플랜: 월 500,000자 제한

3. **환경 변수에 추가**
   - 복사한 API 키를 `.env.local`의 `DEEPL_API_KEY` 값으로 설정

## 4. 서버 재시작

```bash
# 서버가 실행 중이면 Ctrl+C로 중지 후
npm run dev
```

## 5. 확인

브라우저에서 다음을 확인:
- http://localhost:3000/en (영어)
- http://localhost:3000/ja (일본어)
- http://localhost:3000/ko (한국어)

## ⚠️ 주의사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- API 키는 서버 사이드에서만 사용됩니다 (보안)
- 무료 플랜 한도를 초과하면 번역이 중단될 수 있습니다

## 🔧 문제 해결

### 번역이 안 되는 경우
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. API 키가 올바른지 확인
3. 서버를 재시작했는지 확인
4. 브라우저 콘솔에서 에러 확인

### API 한도 초과
- DeepL 대시보드에서 사용량 확인
- 필요시 Pro 플랜으로 업그레이드

## 📞 지원

문제가 지속되면 Issue를 생성해주세요.
