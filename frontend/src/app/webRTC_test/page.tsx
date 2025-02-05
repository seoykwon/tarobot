"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    // WebSocket 연결
    const newSocket = io("http://localhost:8080"); // Spring Boot의 WebSocket 서버 URL
    setSocket(newSocket);

    // RTCPeerConnection 설정
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    setPeerConnection(pc);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        newSocket.emit("ice-candidate", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    newSocket.on("offer", async (offer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      newSocket.emit("answer", answer);
    });

    newSocket.on("answer", async (answer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    newSocket.on("ice-candidate", async (candidate) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding received ICE candidate", error);
      }
    });

    return () => {
      newSocket.disconnect();
      pc.close();
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const createOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  return (
    <div>
      <div>
        <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: "300px" }} />
      </div>
      <button onClick={startLocalStream}>Start Local Stream</button>
      <button onClick={createOffer}>Call</button>
    </div>
  );
};

export default VideoChat;
