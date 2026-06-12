# Petfuture App Template

반려동물 사후 디지털 돌봄 서비스 React 앱 템플릿

## 기술 스택
- React 18 + Vite
- Firebase (Auth + Firestore + Storage)
- React Router v6
- Lucide React 아이콘
- GitHub Actions 자동 배포

## 시작하기

### 1. 설치
```bash
npm install
```

### 2. Firebase 설정
`.env.example` → `.env.local` 복사 후 Firebase 설정값 입력

### 3. 로컬 실행
```bash
npm run dev
```

### 4. 빌드 & 배포
```bash
npm run build
git add . && git commit -m "update" && git push origin master
```
GitHub Actions가 자동으로 배포합니다.

## 폴더 구조
```
src/
├── pages/
│   ├── HomePage.jsx       # 랜딩페이지 (서비스 소개, 요금제, 베타 신청)
│   ├── LoginPage.jsx      # 로그인/회원가입 (Google + 이메일)
│   ├── OnboardingPage.jsx # 반려동물 등록 플로우
│   ├── CarePage.jsx       # 메인 돌봄 화면 (9가지 액션, 스트리크, 상태 게이지)
│   ├── MyPage.jsx         # 마이페이지 (구독, 레퍼럴 코드)
│   ├── PrivacyPage.jsx
│   └── TermsPage.jsx
├── context/
│   └── AppContext.jsx     # 전역 상태 (user, pet, subscription)
├── firebase.js            # Firebase 초기화
└── App.jsx                # 라우팅
```

## Firestore 데이터 구조
```
users/{uid}
  ├── email
  ├── subscription: 'free' | 'lite' | 'family' | 'premium'
  ├── activePetId
  ├── myReferralCode
  ├── referredBy
  └── pets/{petId}
        ├── name, species, birthDate, passedDate
        ├── streak, bondLevel
        └── careLog/{YYYY-MM-DD}
              └── actions: { feed: true, water: true, ... }
```

## 컬러 팔레트
- 메인: #8B7355 (웜 브라운)
- 딥: #6B5340
- 배경: #F7F3EE (크림)
- 다크: #2C1A0E
- 텍스트: #7A6050

## 웰핏+와의 차이
| | 웰핏+ CHECK-UP | Petfuture |
|---|---|---|
| 컬러 | 로즈골드/모브/민트 | 웜브라운/크림 |
| 핵심 루프 | 분석 → 리포트 | 매일 돌봄 → 스트리크 |
| DB | Firebase | Firebase (Supabase 전환 용이) |
| AI | Gemini API | (추후) Replicate AI 캐릭터 생성 |
