const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || "http://localhost:8000";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

export const API_URLS = {
  AUTH: {
    LOGIN: `${BASE_URL}/v1/auth/login`,
    SIGNUP: `${BASE_URL}/v1/users`,
    GOOGLE: `${BASE_URL}/oauth2/authorization/google`,
    KAKAO: `${BASE_URL}/auth/kakao`,
    LOGOUT: `${BASE_URL}/auth/logout`,
  },
  CHAT: {
    SEND_MESSAGE: `${FASTAPI_BASE_URL}/chat`,
    STREAM: (sessionId: string, userInput: string, type: string) =>
      `${FASTAPI_BASE_URL}/chat?session_id=${sessionId}&user_input=${encodeURIComponent(userInput)}&type=${type}`,
    CLOSE: `${FASTAPI_BASE_URL}/chat/close`,
  },
  TAROT: {
    RECORDS: `${BASE_URL}/tarot-records`,
    SAVE_RESULT: `/api/save-result`,
    CARD_IMAGE: (cardNumber: number) => `/basic/maj${cardNumber}.svg`,
  },
  TAROBOTS: {
    LIST: `${BASE_URL}/api/v1/tarot-bots`,
    DETAILS: (id: number) => `${BASE_URL}/api/v1/tarot-bots/${id}`,
  },
  POSTS: {
    SEARCH: (query: string) => `${BASE_URL}/posts/search?query=${query}`,
    SEARCH_POSTS: (type: "title" | "content", query: string, page: number) =>
      `${BASE_URL}/api/v1/posts/search/${type}?q=${encodeURIComponent(query)}&page=${page}&pageSize=10`,
    LIST: (filter: string, page: number) =>
      `${BASE_URL}/api/v1/posts?page=${page - 1}&size=10&sort=${filter}`,
    DETAILS: (id: string) => `${BASE_URL}/v1/posts/${id}`,
    CREATE: `${BASE_URL}/api/v1/posts`,
    LIKE: (articleId: string) => `${BASE_URL}/community/articles/${articleId}/like`,
    COMMENT: (articleId: string) => `${BASE_URL}/community/articles/${articleId}/comments`,
    COMMENT_LIKE: (articleId: string, commentId: number) =>
      `${BASE_URL}/community/articles/${articleId}/comments/${commentId}/like`,
  },
  USER: {
    PROFILE: `${BASE_URL}/user-profiles/me`,
    BY_ID: (userId: string) => `${BASE_URL}/api/v1/user-profiles/${userId}`,
    UPDATE: (userId: string) => `${BASE_URL}/api/v1/user-profiles/${userId}`,
    REVIEWS: (userId?: string) => userId ? `${BASE_URL}/api/review/${userId}` : `${BASE_URL}/api/review`,
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
    MONTHLY: (year: number, month: number) => `${BASE_URL}/api/v1/diary/calendar?year=${year}&month=${month}`,
    SUMMARY: (date: string) => `${BASE_URL}/api/v1/diary/${date}`,
  },
  GAME: {
    DETAILS: (id: string) => `${BASE_URL}/minigames/${id}`,
    LIST: `${BASE_URL}/api/main/minigames`,
  },
  FORTUNE: `${BASE_URL}/api/main/fortune`,
   // WebRTC 관련 URL
  WEBRTC: {
    ROOM: (sessionId: string) => `/webRTC_test/${sessionId}`,
  },
  OPENVIDU: {
    SESSIONS: `${FASTAPI_BASE_URL}/openvidu/sessions`, // OpenVidu 세션 생성
    CONNECTIONS: `${FASTAPI_BASE_URL}/openvidu/connections`, // OpenVidu 연결 요청
  },
  USERNOW: {
    PROFILE: `${BASE_URL}/api/v1/user/me`, // 현재 로그인된 유저 정보 가져오기
  },
  SOCKET: {
    BASE: SOCKET_URL, // WebSocket 서버 기본 URL
    CHAT: `${SOCKET_URL}/chat`, // 채팅 WebSocket 경로
  },
};
