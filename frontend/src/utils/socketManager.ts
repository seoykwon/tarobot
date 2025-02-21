import { io, Socket } from "socket.io-client";
import { API_URLS } from "@/config/api";

type SocketCallback<T = unknown> = (data: T, ...args: unknown[]) => void;

class SocketManager {
  private socket: Socket;
  private voiceListeners: Record<string, SocketCallback<unknown>[]> = {};
  private chatListeners: Record<string, SocketCallback<unknown>[]> = {};

  constructor() {
    this.socket = io(API_URLS.SOCKET.BASE, {
      transports: ["websocket"],
    });

    this.socket.onAny((event: string, ...args: unknown[]) => {
      const filteredArgs = this.filterDuplicateArgs(event, args);
      if (event.startsWith("voice_")) {
        const baseEvent = event.replace("voice_", "");
        (this.voiceListeners[baseEvent] || []).forEach((cb) =>
          cb(...(filteredArgs as [unknown, ...unknown[]]))
        );
      } else {
        (this.chatListeners[event] || []).forEach((cb) =>
          cb(...(filteredArgs as [unknown, ...unknown[]]))
        );
      }
    });
  }

  onVoice<T = unknown>(event: string, callback: SocketCallback<T>) {
    if (!this.voiceListeners[event]) {
      this.voiceListeners[event] = [];
    }
    // 명시적으로 unknown 타입으로 캐스팅하여 저장
    this.voiceListeners[event].push(callback as SocketCallback<unknown>);
  }

  onChat<T = unknown>(event: string, callback: SocketCallback<T>) {
    if (!this.chatListeners[event]) {
      this.chatListeners[event] = [];
    }
    this.chatListeners[event].push(callback as SocketCallback<unknown>);
  }

  emit(event: string, data: unknown, options?: { isVoice?: boolean }) {
    if (options?.isVoice) {
      this.socket.emit("voice_" + event, data);
    } else {
      this.socket.emit(event, data);
    }
  }

  getSocket() {
    return this.socket;
  }

  private filterDuplicateArgs(event: string, args: unknown[]): unknown[] {
    if (args.length > 0 && args[0] === event) {
      return args.slice(1);
    }
    return args;
  }
}

const socketManager = new SocketManager();
export default socketManager;
