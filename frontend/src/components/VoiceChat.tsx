// components/VoiceChat.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { API_URLS } from "@/config/api";

interface VoiceChatProps {
  roomId: string;
}

export default function VoiceChat({ roomId }: VoiceChatProps) {
  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [streamStarted, setStreamStarted] = useState(false);

  // Socket.IO 연결 및 signaling 이벤트 설정
  useEffect(() => {
    const socket = io(API_URLS.SOCKET.BASE, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    // 방 참여: 동일한 roomId (sessionId)를 사용하면 같은 방에 배정됨
    socket.emit("join_room", { room_id: roomId });

    // signaling 이벤트 처리
    socket.on("offer", async (data: any) => {
      console.log("Received Offer:", data);
      if (!peerConnectionRef.current) {
        await createPeerConnection();
      }
      await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await peerConnectionRef.current!.createAnswer();
      await peerConnectionRef.current!.setLocalDescription(answer);
      socket.emit("answer", { room_id: roomId, sdp: answer });
    });

    socket.on("answer", async (data: any) => {
      console.log("Received Answer:", data);
      await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(data.sdp));
    });

    socket.on("ice-candidate", async (data: any) => {
      console.log("Received ICE Candidate:", data);
      try {
        await peerConnectionRef.current!.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // PeerConnection 생성 및 로컬 오디오 스트림 가져오기
  const createPeerConnection = async () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;

    // ICE 후보 발생 시 전송
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          room_id: roomId,
          candidate: event.candidate,
        });
      }
    };

    // 상대방 오디오 스트림 수신 처리
    pc.ontrack = (event) => {
      console.log("Received remote audio stream", event.streams);
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    try {
      // 로컬 오디오 스트림 가져오기 (사용자 권한 요청)
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
      setStreamStarted(true);
    } catch (error) {
      console.error("Error accessing local audio stream:", error);
    }
  };

  // 사용자가 통화 시작 버튼을 누르면 Offer 생성 및 전송
  const startCall = async () => {
    if (!peerConnectionRef.current) {
      await createPeerConnection();
    }
    const offer = await peerConnectionRef.current!.createOffer();
    await peerConnectionRef.current!.setLocalDescription(offer);
    socketRef.current.emit("offer", { room_id: roomId, sdp: offer });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">음성 채팅</h2>
      <button
        onClick={startCall}
        className="px-4 py-2 bg-green-500 text-white rounded"
        disabled={streamStarted}
      >
        통화 시작
      </button>
      <div className="mt-4">
        <audio ref={remoteAudioRef} autoPlay controls />
      </div>
    </div>
  );
}
