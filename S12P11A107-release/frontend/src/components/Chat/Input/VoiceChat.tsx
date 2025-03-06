// components/VoiceChat.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URLS } from "@/config/api";

interface VoiceChatProps {
  roomId: string;
  // 만약 polite 여부를 외부에서 결정하고 싶다면 prop으로 전달할 수 있음.
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
  // 로컬 스트림을 저장할 ref 추가
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 통화 시작 여부를 state로 관리 (이 값이 변경되면 UI가 리렌더링됨)
  const [callStarted, setCallStarted] = useState<boolean>(false);

  // 충돌 처리를 위한 플래그들
  const makingOfferRef = useRef<boolean>(false);
  const ignoreOfferRef = useRef<boolean>(false);

     // PeerConnection 생성 및 로컬 오디오 스트림 가져오기
     const createPeerConnection = useCallback(async () => {
      const configuration = {
        
        iceServers: [
        { urls: "stun:stun.l.google.com:19302" },   // STUN 서버
        { urls: "turn:openrelay.metered.ca:443", username: "5ef55293d496fc888b8dc0e8", credential: "/W8s7z8SH81ViigE" }   // TRUN 서버
      ]
      };
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      // ICE 후보 발생 시 전송
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
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
        // 로컬 스트림 저장
        localStreamRef.current = localStream;
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
        setIsMuted(false); // 통화 시작 시 마이크는 기본 활성화
      } catch (error) {
        console.error("Error accessing local audio stream:", error);
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
      console.log("Received Offer:", data);
      const pc = peerConnectionRef.current;
      // 충돌 감지: 이미 offer를 보내고 있거나, signaling 상태가 안정적이지 않으면 충돌로 판단
      const offerCollision = !!(makingOfferRef.current || (pc && pc.signalingState !== "stable"));
      // polite한 쪽은 충돌이 발생해도 offer를 받아들이고, 그렇지 않으면 무시
      ignoreOfferRef.current = !polite && offerCollision;
      if (ignoreOfferRef.current) {
        console.log("Ignoring offer due to collision.");
        return;
      }
      try {
        if (!pc) {
          await createPeerConnection();
          setCallStarted(true);
        }
        // offer SDP를 remote description으로 설정
        await peerConnectionRef.current!.setRemoteDescription(data.sdp);
        // answer 생성 및 전송
        const answer = await peerConnectionRef.current!.createAnswer();
        await peerConnectionRef.current!.setLocalDescription(answer);
        socket.emit("answer", { room_id: roomId, sdp: answer });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    // answer 수신 처리
    socket.on("answer", async (data: AnswerData) => {
      console.log("Received Answer:", data);
      try {
        await peerConnectionRef.current!.setRemoteDescription(data.sdp);
      } catch (error) {
        console.error("Error setting remote description from answer:", error);
      }
    });

    // ICE candidate 수신 처리
    socket.on("ice-candidate", async (data: IceCandidateData) => {
      console.log("Received ICE Candidate:", data);
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

  // 통화 시작 또는 마이크 mute 토글 함수
  const startCallOrToggleMute = async () => {
    // 통화가 아직 시작되지 않은 경우, PeerConnection 생성 및 offer 전송
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
      return;
    }
    // 이미 통화 중이면, 마이크 토글 (mute/unmute)
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <>
      <div
        onClick={startCallOrToggleMute}
        // 통화 시작 전에는 버튼 활성화, 통화 중이면 항상 활성화 (mute 토글 기능 사용)
        className="transition-opacity duration-200 absolute inset-0"
      >
        {callStarted ? (isMuted ? "🎙️ Off" : "🎤 On") : "Start Call"}
      </div>
      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}
