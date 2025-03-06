// config/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || "http://localhost:8000";

export const API_URLS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/v1/auth/login`,
    SIGNUP: `${BASE_URL}/api/v1/users`,
    GOOGLE: `${BASE_URL}/oauth2/authorization/google`,
    KAKAO: `${BASE_URL}/auth/kakao`,
    LOGOUT: `${BASE_URL}/api/v1/auth/logout`,
  },
  CHAT: {
    LOAD_SESSION: `${FASTAPI_BASE_URL}/chat/session/load`,       // GET - 채팅 세션 대화 기록 불러오기
    SEND_MESSAGE: `${FASTAPI_BASE_URL}/chat`,
    STREAM: `${FASTAPI_BASE_URL}/chat/stream`,
    ENTER: `${BASE_URL}/api/v1/chat/session/enter`,
    CLOSE: `${BASE_URL}/api/v1/chat/session/close`,
  },
  TAROT: {
    RECORDS: `${BASE_URL}/tarot-records`,
    SAVE_RESULT: `/api/save-result`,
    CARD_IMAGE: (cardNumber: number) => `/basic/maj${cardNumber}.svg`,
  },
  TAROTBOTS: {
    LIST: `${BASE_URL}/api/v1/tarot-bots`,
    DETAILS: (id: string) => `${BASE_URL}/api/v1/tarot-bots/${id}`,
  },
  POSTS: {
    LIST: (filter: string, page: number) =>
      `${BASE_URL}/api/v1/posts/search?page=${page - 1}&sort=${filter}`,    // GET - 필터 검색
    SEARCH: (type: "title" | "content", query: string, page: number) =>     // GET - 제목/내용 검색
      `${BASE_URL}/api/v1/posts/search/${type}?q=${encodeURIComponent(query)}&page=${page-1}`,
    DETAIL: (postId: string) => `${BASE_URL}/api/v1/posts/${postId}`,      // GET - 게시글 상세 정보 조회
    UPDATE: (postId: string) => `${BASE_URL}/api/v1/posts/${postId}`,      // PUT - 게시글 정보 수정, title, content, imageUrl 포함
    DELETE: (postId: string) => `${BASE_URL}/api/v1/posts/${postId}`,      // DELETE - 게시글 삭제
    CREATE: `${BASE_URL}/api/v1/posts`,     // POST - 게시글 생성, title, content, imageUrl 포함
    IS_LIKED: (postId: string) => `${BASE_URL}/api/v1/posts/${postId}/like`, // GET - 게시글 좋아요 상태 확인
    LIKE: (postId: string) => `${BASE_URL}/api/v1/posts/${postId}/like`,    // POST - 게시글 좋아요 추가, DELETE - 게시글 좋아요 취소
  },
  COMMENTS: {
    UPDATE_COMMENT: (commentId: string) => `${BASE_URL}/api/v1/${commentId}`, // PUT - 댓글 수정
    DELETE_COMMENT: (commentId: string) => `${BASE_URL}/api/v1/${commentId}`, // DELETE - 댓글 삭제 (비활성화 처리)
    GET_COMMENTS: (postId: string) => `${BASE_URL}/api/v1/comments?postId=${postId}`, // GET - 댓글 조회
    CREATE_COMMENT: `${BASE_URL}/api/v1/comments`, // POST - 댓글 등록, body에 content, postId 포함시켜 보내기
    IS_LIKED: (commentId: string) => `${BASE_URL}/api/v1/${commentId}/like`, // GET - 댓글 좋아요 상태 확인
    LIKE_COMMENT: (commentId: string) => `${BASE_URL}/api/v1/${commentId}/like`, // POST - 댓글 좋아요, DELETE - 댓글 좋아요 취소
    GET_EDITABLE_COMMENT: (commentId: string) => `${BASE_URL}/api/v1/${commentId}/edit`, // GET - 댓글 수정용 데이터 조회
    DELETE_PERMANENTLY: (commentId: string) => `${BASE_URL}/${commentId}/permanent`, // DELETE - 댓글 영구 삭제 (관리자 전용)
  },
  USER: {
    ME: `${BASE_URL}/api/v1/user-profiles/me`,    // GET - 회원 본인 프로필 조회
    BY_ID: (userId: string) => `${BASE_URL}/api/v1/user-profiles/${userId}`,    // GET - 이름 기반 프로필 검색
    UPDATE: (userId: string) => `${BASE_URL}/api/v1/user-profiles/${userId}`,   // PATCH - 유저 프로필 수정
    SESSIONLIST: `${BASE_URL}/api/v1/chat/session/me`
  },
  REVIEW: {
    BY_ID: (reviewId: string) => `${BASE_URL}/api/review/${reviewId}`,         // GET - 특정 리뷰 조회
    CREATE: (tarotBotId: string) => `${BASE_URL}/api/review/${tarotBotId}`,    // POST - 리뷰 생성, body에 author, rating, content 포함시켜 보내기
    UPDATE: (reviewId: string) => `${BASE_URL}/api/review/${reviewId}`,        // PUT - 리뷰 수정, body에 author, rating, content 포함시켜 보내기기
    DELETE: (reviewId: string) => `${BASE_URL}/api/review/${reviewId}`,        // DELETE - 리뷰 삭제
    ALL: `${BASE_URL}/api/review`,                                             // GET - 모든 리뷰 조회
    ME: `${BASE_URL}/api/me`,                                                  // GET - 내 작성 리뷰 조회
  },

  NOTICES: {
    LIST: `${BASE_URL}/community/announcements`,
    DETAILS: (id: string) => `${BASE_URL}/community/notices/${id}`,
  },
  TOKEN: {
    VALIDATE: `${BASE_URL}/api/v1/token/validate`,
    REFRESH: `${BASE_URL}/api/v1/token/refresh`,
  },
  CALENDAR: {
    MONTHLY: (year: number, month: number) => `${BASE_URL}/api/v1/diary/monthly?year=${year}&month=${month}`,
    SUMMARY: (date: string) => `${BASE_URL}/api/v1/diary/${date}`,
  },
  GAME: {
    DETAILS: (id: string) => `${BASE_URL}/minigames/${id}`,
    LIST: `${BASE_URL}/api/main/minigames`,
  },
  FORTUNE: `${BASE_URL}/api/main/fortune`,
   // WebRTC 관련 URL
  WEBRTC: {
    ROOM: (tarobotId: string, sessionId: string) => `/tarot/bots/${tarobotId}/chat_w/${sessionId}`,
  },
  USERNOW: {
    PROFILE: `${BASE_URL}/api/v1/user/me`, // 현재 로그인된 유저 정보 가져오기
  },
  SOCKET: {
    BASE: FASTAPI_BASE_URL, // WebSocket 서버 기본 URL
    CHAT: `${FASTAPI_BASE_URL}/chat`, // 채팅 WebSocket 경로
  },
};
