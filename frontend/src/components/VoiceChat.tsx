"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URLS } from "@/config/api";

interface VoiceChatProps {
  roomId: string;
  polite?: boolean;
}

interface OfferData {
  room_id: string;
  sdp: RTCSessionDescriptionInit;
}

interface AnswerData {
  room_id: string;
  sdp: RTCSessionDescriptionInit;
}

interface IceCandidateData {
  room_id: string;
  candidate: RTCIceCandidateInit;
}

export default function VoiceChat({ roomId, polite = true }: VoiceChatProps) {
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [callStarted, setCallStarted] = useState<boolean>(false);

  // 충돌 방지 플래그
  const makingOfferRef = useRef<boolean>(false);
  const ignoreOfferRef = useRef<boolean>(false);

  // PeerConnection 생성 및 로컬 오디오 스트림 가져오기
  const createPeerConnection = useCallback(async () => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "5ef55293d496fc888b8dc0e8",
          credential: "/W8s7z8SH81ViigE",
        },
      ],
    };
    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;

    // ICE 후보 처리
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          room_id: roomId,
          candidate: event.candidate,
        });
      }
    };

    // 상대방 오디오 스트림 처리
    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    try {
      // 로컬 오디오 스트림 가져오기
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      localStreamRef.current = localStream;
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      setIsMuted(false); // 기본적으로 마이크 활성화
    } catch (error) {
      console.error("Error accessing local audio stream:", error);
      alert("마이크 권한을 허용해주세요.");
    }
  }, [roomId]);

  // Socket.IO 연결 및 signaling 이벤트 설정
  // 1. 소켓 연결 생성: 컴포넌트 마운트 시 한 번만 실행 (roomId가 있을 때)
  useEffect(() => {
    if (!roomId) return;
    if (socketRef.current) return; // 이미 소켓이 생성되어 있다면 재생성 방지

    const socket = io(API_URLS.SOCKET.BASE, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("offer", async (data: OfferData) => {
      const pc = peerConnectionRef.current;
      const offerCollision =
        !!(makingOfferRef.current || (pc && pc.signalingState !== "stable"));
      ignoreOfferRef.current = !polite && offerCollision;

      if (ignoreOfferRef.current) return;

      try {
        if (!pc) await createPeerConnection();
        await peerConnectionRef.current!.setRemoteDescription(data.sdp);
        const answer = await peerConnectionRef.current!.createAnswer();
        await peerConnectionRef.current!.setLocalDescription(answer);

        socket.emit("answer", { room_id: roomId, sdp: answer });
        setCallStarted(true);
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    socket.on("answer", async (data: AnswerData) => {
      try {
        await peerConnectionRef.current!.setRemoteDescription(data.sdp);
      } catch (error) {
        console.error("Error setting remote description from answer:", error);
      }
    });

    socket.on("ice-candidate", async (data: IceCandidateData) => {
      try {
        await peerConnectionRef.current!.addIceCandidate(data.candidate);
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, polite, createPeerConnection]); // roomId가 있을 때만 생성. 이미 연결되었으면 재생성하지 않음

  // 2. roomId 변경 시 join_room 이벤트 발생: 소켓 재생성 없이 join_room만 재전송
  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.emit("join_room", { room_id: roomId });
  }, [roomId]);

  // 통화 시작 또는 마이크 토글
  const startCallOrToggleMute = async () => {
    if (!peerConnectionRef.current) {
      await createPeerConnection();
      try {
        makingOfferRef.current = true;
        const offer = await peerConnectionRef.current!.createOffer();
        await peerConnectionRef.current!.setLocalDescription(offer);

        socketRef.current?.emit("offer", { room_id: roomId, sdp: offer });
        setCallStarted(true);
      } catch (error) {
        console.error("Error starting call:", error);
      } finally {
        makingOfferRef.current = false;
      }
    } else if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <>
      <button
        onClick={startCallOrToggleMute}
        className="transition-opacity duration-200 absolute inset-0"
      >
        {callStarted ? (isMuted ? "🎙️ Off" : "🎤 On") : "Start Call"}
      </button>
      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}
