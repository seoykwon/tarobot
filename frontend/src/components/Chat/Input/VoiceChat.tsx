"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import socketManager from "@/utils/socketManager";

interface VoiceChatProps {
  roomId: string;
  polite?: boolean;
}

export interface OfferData {
  room_id: string;
  sdp: RTCSessionDescriptionInit;
}

export interface AnswerData {
  room_id: string;
  sdp: RTCSessionDescriptionInit;
}

export interface IceCandidateData {
  room_id: string;
  candidate: RTCIceCandidateInit;
}

export default function VoiceChat({ roomId, polite = true }: VoiceChatProps) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [callStarted, setCallStarted] = useState<boolean>(false);

  const makingOfferRef = useRef<boolean>(false);
  const ignoreOfferRef = useRef<boolean>(false);

  useEffect(() => {
    socketManager.emit(
      "join_room",
      { room_id: roomId },
      { isVoice: true }
    );
  }, [roomId]);

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

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketManager.emit(
          "ice-candidate",
          {
            room_id: roomId,
            candidate: event.candidate,
          },
          { isVoice: true }
        );
      }
    };

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
      localStream.getTracks().forEach((track) =>
        pc.addTrack(track, localStream)
      );
      setIsMuted(false);
    } catch (error) {
      console.error("Error accessing local audio stream:", error);
      alert("마이크 권한을 허용해주세요.");
    }
  }, [roomId]);

  useEffect(() => {
    const handleOffer = async (data: OfferData) => {
      const pc = peerConnectionRef.current;
      const offerCollision = !!(
        makingOfferRef.current ||
        (pc && pc.signalingState !== "stable")
      );
      ignoreOfferRef.current = !polite && offerCollision;
      if (ignoreOfferRef.current) return;

      try {
        if (!pc) await createPeerConnection();
        await peerConnectionRef.current!.setRemoteDescription(data.sdp);
        const answer = await peerConnectionRef.current!.createAnswer();
        await peerConnectionRef.current!.setLocalDescription(answer);

        socketManager.emit(
          "answer",
          { room_id: roomId, sdp: answer },
          { isVoice: true }
        );
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

    socketManager.onVoice<OfferData>("offer", handleOffer);
    socketManager.onVoice<AnswerData>("answer", handleAnswer);
    socketManager.onVoice<IceCandidateData>("ice-candidate", handleIceCandidate);

    return () => {
      // cleanup: socketManager 내부에서 이벤트 핸들러 제거를 관리하는 경우 별도 처리 없음
    };
  }, [createPeerConnection, polite, roomId]);

  const startCallOrToggleMute = async () => {
    if (!peerConnectionRef.current) {
      await createPeerConnection();
      try {
        makingOfferRef.current = true;
        const offer = await peerConnectionRef.current!.createOffer();
        await peerConnectionRef.current!.setLocalDescription(offer);

        socketManager.emit(
          "offer",
          { room_id: roomId, sdp: offer },
          { isVoice: true }
        );
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
      <div
        onClick={startCallOrToggleMute}
        className="fixed bottom-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg cursor-pointer"
        style={{
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {callStarted ? (isMuted ? "🎙️ Off" : "🎤 On") : "Start"}
      </div>
      <audio ref={remoteAudioRef} autoPlay />
    </>
  );
}
