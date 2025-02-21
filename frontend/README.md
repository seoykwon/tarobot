## 🚀 프로젝트 개요

Tarot App의 프론트엔드는 Next.js 기반으로 제작되었으며, 다양한 타로 마스터를 선택해서 대화를 나누고 타로 점을 확인할 수 있습니다.
세션 정보를 통해 과거 대화 정보를 확인 가능하고, 다이어리를 통해 과거 타로 결과 요약을 확인 할 수 있습니다.

## 주요 기능
- 다양한 타로 마스터(진이, 범달) 중 한명을 선택해 대화를 나눌 수 있습니다.
- 대화를 나누고 카드를 선택하면 둘을 취합해 타로 점의 결과를 알려줍니다.
- 과거 대화 정보와 타로 점 결과를 확인할 수 있습니다.
- 채팅방 공유를 통해 친구와 함께 타로 점을 볼 수 있고, 결과를 공유할 수 있습니다.

## 🛠 기술 스택

- Next.js: 서버 사이드 렌더링(SSR) 및 정적 사이트 생성(SSG)을 지원하는 React 기반 프레임워크
- TypeScript: 코드 안정성을 높이고 유지보수를 용이하게 하는 정적 타입 검사 도구
- Tailwind CSS: 유틸리티 기반의 CSS 프레임워크로 빠르고 일관된 스타일링 가능
- WebRTC: 브라우저 간 실시간 P2P 데이터 및 미디어 스트림 전송

## ✅ 사전 요구사항

- **Node.js:** 18.x 버전  
  [Node.js 설치하기](https://nodejs.org/ko/download/)  

- **npm:** Node.js 설치 시 함께 설치됩니다.  
  설치 확인:
  ```bash
  node -v  # Node.js 버전 확인
  npm -v   # npm 버전 확인
  ```

- **Next.js:** 14.x 버전 (의존성으로 설치됩니다)  
  Next.js 공식 문서: [https://nextjs.org/docs](https://nextjs.org/docs)

---

## 📦 설치 및 실행 방법

### 1️⃣ 프로젝트 클론

저장소를 클론합니다.

```bash
git clone https://lab.ssafy.com/s12-webmobile1-sub1/S12P11A107.git
cd S12P11A107/frontend
```

---

### 2️⃣ 의존성 설치

다음 명령어로 프로젝트의 모든 의존성을 설치합니다.

```bash
npm install
```

- `package.json`의 `dependencies`에 **Next.js 14**가 명시되어 있습니다.
- 설치 확인:
  ```bash
  npm list next
  ```

---

### 3️⃣ 개발 서버 실행

로컬 개발 서버를 실행합니다.

```bash
npm run dev
```

- 기본 실행 포트: [http://localhost:3000](http://localhost:3000)  
- 코드 변경 시 자동으로 핫 리로딩됩니다.  
- **`.env` 파일 없이도 프로젝트가 정상 작동합니다.**  

---


## 📂 프로젝트 구조
```text
├── public/                # 정적 파일 (이미지, HTML 등)
│   ├── basic/             # 타로 카드 리소스
│   ├── bots/              # 봇 관련 리소스
│   └── images/            # 봇 프로필 리소스
├── src/
│   ├── app/               # 페이지 및 라우팅 관련 파일
│   │   ├── card/          # 카드 선택 페이지
│   │   ├── chat/          # 채팅 페이지 (동적 라우팅 포함)
│   │   │   └── [sessionId]/ # 특정 세션별 채팅 페이지
│   │   └── home/          # 홈 화면 페이지
│   ├── components/        # 재사용 가능한 UI 컴포넌트 모음
│   │   ├── Chat/          # 채팅 관련 컴포넌트
│   │   │   └── Input/     # 채팅 입력창 컴포넌트
│   │   ├── Diary/         # 다이어리 컴포넌트 (캘린더, 운세 요약, 이미지 공유 등)
│   │   ├── Header/        # 헤더 컴포넌트 (프로필, 알림 설정)
│   │   ├── Login/         # 로그인 컴포넌트 (구글 로그인)
│   │   ├── ProfileModal/  # 프로필 모달 컴포넌트 (로그아웃, 프로필 설정)
│   │   └── Sidebar/       # 사이드바 컴포넌트 (타로 마스터 리스트, 세션 리스트)
│   ├── config/            # API 관리
│   ├── context/           # 세션 관리
│   ├── libs/              # API 관리 및 유틸 함수 모음
│   ├── styles/            # 글로벌 스타일 파일 (CSS, SCSS 등)
│   ├── types/             # TypeScript 타입 정의 파일
│   └── utils/             # 유틸리티 함수 모음
```

## 📡 API 설계

### 1. 인증 (AUTH)
| 기능                | HTTP 메서드 | 엔드포인트                           | 설명              |
|---------------------|-------------|--------------------------------------|-------------------|
| 구글 로그인         | GET         | `${NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`      | 구글 OAuth 로그인 |
| 로그아웃            | POST        | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout`               | 사용자 로그아웃   |

---

### 2. 채팅 (CHAT)
| 기능                  | HTTP 메서드 | 엔드포인트                               | 설명                    |
|-----------------------|-------------|------------------------------------------|-------------------------|
| 채팅 세션 불러오기    | GET         | `${NEXT_PUBLIC_FASTAPI_BASE_URL}/chat/session/load`                     | 채팅 세션 기록 조회     |
| 세션 입장             | POST        | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/session/enter`             | 채팅 세션 입장          |
| 세션 종료             | POST        | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/session/close`             | 채팅 세션 종료          |
| 세션 업데이트         | PATCH       | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/session/update/:sessionId` | 세션 정보 업데이트      |

---

### 3. 타로 (TAROT)
| 기능              | HTTP 메서드 | 엔드포인트             | 설명            |
|-------------------|-------------|------------------------|-----------------|
| 타로 기록 조회    | GET         | `${NEXT_PUBLIC_API_BASE_URL}/tarot-records`       | 타로 기록 조회  |
| 타로 결과 저장    | POST        | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/session/close`    | 타로 결과 저장  |

---

### 4. 타로 봇 (TAROTBOTS)
| 기능                  | HTTP 메서드 | 엔드포인트                     | 설명                    |
|-----------------------|-------------|---------------------------------|-------------------------|
| 타로 봇 목록 조회      | GET         | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/tarot-bots`           | 타로 봇 리스트 조회     |
| 타로 봇 상세 조회      | GET         | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/tarot-bots/:id`       | 특정 타로 봇 상세 정보  |

---

### 5. 사용자 (USER)
| 기능                    | HTTP 메서드 | 엔드포인트                               | 설명                      |
|-------------------------|-------------|------------------------------------------|---------------------------|
| 본인 프로필 조회        | GET         | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/user-profiles/me`               | 로그인 사용자 프로필 조회 |
| 이름 기반 프로필 검색   | GET         | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/user-profiles/:userId`          | 특정 사용자 프로필 검색   |
| 유저 프로필 수정        | PATCH       | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/user-profiles/:userId`          | 사용자 프로필 수정        |
| 세션 목록 조회          | GET         | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/session/me`                | 본인 채팅 세션 목록 조회  |

---

### 6. 공지사항 (NOTICES)
| 기능                  | HTTP 메서드 | 엔드포인트                           | 설명                  |
|-----------------------|-------------|--------------------------------------|-----------------------|
| 공지사항 목록 조회    | GET         | `${NEXT_PUBLIC_API_BASE_URL}/community/announcements`          | 공지사항 리스트 조회  |
| 공지사항 상세 조회    | GET         | `${NEXT_PUBLIC_API_BASE_URL}/community/notices/:id`            | 공지사항 상세 정보    |

---

### 7. 토큰 (TOKEN)
| 기능              | HTTP 메서드   | 엔드포인트                     | 설명                |
|-------------------|---------------|---------------------------------|---------------------|
| 토큰 유효성 검증  | POST          | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/token/validate`       | 액세스 토큰 검증    |
| 토큰 갱신         | POST          | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/token/refresh`        | 액세스 토큰 재발급  |

---

### 8. 캘린더 (CALENDAR)
| 기능                  | HTTP 메서드   | 엔드포인트                                         | 설명                    |
|-----------------------|---------------|---------------------------------------------------|-------------------------|
| 월별 다이어리 조회    | GET           | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/diary/monthly?year=:year&month=:month`   | 월별 다이어리 요약      |
| 일별 다이어리 요약    | GET           | `${NEXT_PUBLIC_API_BASE_URL}/api/v1/diary/:date`                             | 특정 날짜 다이어리 조회 |

## 📋 TODO 리스트

- [ ] WebRTC 연결 안정성 개선
- [ ] 새로운 타로 마스터 추가
- [ ] middleware 작동 방식 오류 개선

## 🎨 코딩 컨벤션

프로젝트는 다음과 같은 코딩 스타일을 따릅니다:

1. **ESLint**: 코드 품질 및 규칙 검사 도구.
2. **Prettier**: 코드 포맷팅 도구.

https://oil-ruby-367.notion.site/17e4efe830c4800fad5bce5ce842c916?pvs=4