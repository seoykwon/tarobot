// socketManager.ts
import { io, Socket } from "socket.io-client";
import { API_URLS } from "@/config/api";

type EventCallback = (...args: any[]) => void;

class SocketManager {
  private socket: Socket;
  private voiceListeners: Record<string, EventCallback[]> = {};
  private chatListeners: Record<string, EventCallback[]> = {};

  constructor() {
    // 기본 소켓 연결 생성
    this.socket = io(API_URLS.SOCKET.BASE, {
      transports: ["websocket"],
    });

    // 모든 이벤트 수신: 이벤트 이름을 체크하여 적절히 라우팅
    this.socket.onAny((event: string, ...args: any[]) => {
      // 1) 첫 번째 인자가 이벤트명과 동일하면 제거
      const filteredArgs = this.filterDuplicateArgs(event, args);

      // 2) 음성 채팅 이벤트는 "voice_" 접두어로 구분
      if (event.startsWith("voice_")) {
        const baseEvent = event.replace("voice_", "");
        this.voiceListeners[baseEvent]?.forEach((cb) => cb(...filteredArgs));
      } else {
        this.chatListeners[event]?.forEach((cb) => cb(...filteredArgs));
      }
    });
  }

  // 음성 채팅 관련 이벤트 구독
  onVoice(event: string, callback: EventCallback) {
    if (!this.voiceListeners[event]) {
      this.voiceListeners[event] = [];
    }
    this.voiceListeners[event].push(callback);
  }

  // 텍스트 채팅 관련 이벤트 구독
  onChat(event: string, callback: EventCallback) {
    if (!this.chatListeners[event]) {
      this.chatListeners[event] = [];
    }
    this.chatListeners[event].push(callback);
  }

  // 소켓 emit: 음성 관련 이벤트는 접두어를 붙여 전송
  emit(event: string, data: any, options?: { isVoice?: boolean }) {
    if (options?.isVoice) {
      this.socket.emit("voice_" + event, data);
    } else {
      this.socket.emit(event, data);
    }
  }

  // 기존 소켓 인스턴스를 반환
  getSocket() {
    return this.socket;
  }

  /**
   * 첫 번째 인자가 이벤트명과 동일하면 제거해주는 헬퍼 함수
   */
  private filterDuplicateArgs(event: string, args: any[]): any[] {
    if (args.length > 0 && args[0] === event) {
      return args.slice(1);
    }
    return args;
  }
}

const socketManager = new SocketManager();
export default socketManager;
