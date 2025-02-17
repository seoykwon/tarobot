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
  const [streamStarted, setStreamStarted] = useState<boolean>(false);


  // 충돌 처리를 위한 플래그들
  const makingOfferRef = useRef<boolean>(false);
  const ignoreOfferRef = useRef<boolean>(false);

     // PeerConnection 생성 및 로컬 오디오 스트림 가져오기
     const createPeerConnection = useCallback(async () => {
      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
        setStreamStarted(true);
      } catch (error) {
        console.error("Error accessing local audio stream:", error);
      }
    }, [roomId]); 

  // Socket.IO 연결 및 signaling 이벤트 설정
  useEffect(() => {
    const socket = io(API_URLS.SOCKET.BASE, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    // 방 참여: 동일한 roomId를 사용하면 같은 방에 배정됨
    socket.emit("join_room", { room_id: roomId });

    // offer 수신 처리
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
    };
  }, [roomId, polite, createPeerConnection]);

  // 사용자가 통화 시작 버튼을 누르면 Offer 생성 및 전송
  const startCall = async () => {
    if (!peerConnectionRef.current) {
      await createPeerConnection();
    }
    try {
      makingOfferRef.current = true;
      const offer = await peerConnectionRef.current!.createOffer();
      await peerConnectionRef.current!.setLocalDescription(offer);
      if (socketRef.current) {
        socketRef.current.emit("offer", { room_id: roomId, sdp: offer });
      }
    } catch (error) {
      console.error("Error starting call:", error);
    } finally {
      makingOfferRef.current = false;
    }
  };

  return (
    <>
      <button
        onClick={startCall}
        disabled={streamStarted}
        className="transition-opacity duration-200 absolute inset-0"
      >
        🎤
      </button>
      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}
