// components/VoiceChat.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import socketManager from "@/utils/socketManager";
// import { API_URLS } from "@/config/api";

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
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [callStarted, setCallStarted] = useState<boolean>(false);

  // 충돌 방지 플래그
  const makingOfferRef = useRef<boolean>(false);
  const ignoreOfferRef = useRef<boolean>(false);

  // 방에 가입
  useEffect(() => {
    socketManager.emit("join_room", { room_id: roomId }, { isVoice: true });
  }, [roomId]);

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

    // ICE 후보 발생 시 음성 이벤트로 전송
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketManager.emit("ice-candidate", {
          room_id: roomId,
          candidate: event.candidate,
        }, { isVoice: true });
      }
    };

    // 상대방 오디오 스트림 설정
    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      localStreamRef.current = localStream;
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      setIsMuted(false);
    } catch (error) {
      console.error("Error accessing local audio stream:", error);
      alert("마이크 권한을 허용해주세요.");
    }
  }, [roomId]);

  // 소켓 이벤트 구독 (음성 관련)
  useEffect(() => {
    const handleOffer = async (data: OfferData) => {
      const pc = peerConnectionRef.current;
      const offerCollision = !!(makingOfferRef.current || (pc && pc.signalingState !== "stable"));
      ignoreOfferRef.current = !polite && offerCollision;
      if (ignoreOfferRef.current) return;

      try {
        if (!pc) await createPeerConnection();
        await peerConnectionRef.current!.setRemoteDescription(data.sdp);
        const answer = await peerConnectionRef.current!.createAnswer();
        await peerConnectionRef.current!.setLocalDescription(answer);

        socketManager.emit("answer", { room_id: roomId, sdp: answer }, { isVoice: true });
        setCallStarted(true);
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const handleAnswer = async (data: AnswerData) => {
      try {
        await peerConnectionRef.current!.setRemoteDescription(data.sdp);
      } catch (error) {
        console.error("Error setting remote description from answer:", error);
      }
    };

    const handleIceCandidate = async (data: IceCandidateData) => {
      try {
        await peerConnectionRef.current!.addIceCandidate(data.candidate);
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    };

    socketManager.onVoice("offer", handleOffer);
    socketManager.onVoice("answer", handleAnswer);
    socketManager.onVoice("ice-candidate", handleIceCandidate);

    return () => {
      // cleanup: 이벤트 핸들러 제거 (단, socketManager 내부에서 관리)
    };
  }, [createPeerConnection, polite, roomId]);

  // 통화 시작 및 마이크 토글
  const startCallOrToggleMute = async () => {
    if (!peerConnectionRef.current) {
      await createPeerConnection();
      try {
        makingOfferRef.current = true;
        const offer = await peerConnectionRef.current!.createOffer();
        await peerConnectionRef.current!.setLocalDescription(offer);

        socketManager.emit("offer", { room_id: roomId, sdp: offer }, { isVoice: true });
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
      {/* 버튼 영역: 화면 우측 하단에 작게 배치 */}
      <div
        onClick={startCallOrToggleMute}
        className="fixed bottom-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg cursor-pointer"
        style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {callStarted ? (isMuted ? "🎙️ Off" : "🎤 On") : "Start"}
      </div>
      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}
