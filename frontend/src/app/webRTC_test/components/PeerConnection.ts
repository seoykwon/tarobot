export class WebRTCConnection {
    private peerConnection: RTCPeerConnection;
    private dataChannel: RTCDataChannel | null = null;
    private remoteDataChannel: RTCDataChannel | null = null;
  
    constructor(private onMessage: (message: string) => void) {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // STUN 서버 설정
      });
  
      // ICE Candidate 이벤트 처리
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("New ICE Candidate:", event.candidate);
        }
      };
  
      // DataChannel 이벤트 처리
      this.peerConnection.ondatachannel = (event) => {
        this.remoteDataChannel = event.channel;
        this.remoteDataChannel.onmessage = (e) => this.onMessage(e.data);
      };
    }
  
    // DataChannel 생성
    createDataChannel(label: string = "chat") {
      this.dataChannel = this.peerConnection.createDataChannel(label);
      this.dataChannel.onopen = () => console.log("Data channel opened");
      this.dataChannel.onmessage = (e) => this.onMessage(e.data);
    }
  
    // Offer 생성
    async createOffer() {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    }
  
    // Answer 생성
    async createAnswer(offer: RTCSessionDescriptionInit) {
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    }
  
    // Answer 설정
    async setAnswer(answer: RTCSessionDescriptionInit) {
      await this.peerConnection.setRemoteDescription(answer);
    }
  
    // ICE Candidate 추가
    async addIceCandidate(candidate: RTCIceCandidateInit) {
      await this.peerConnection.addIceCandidate(candidate);
    }
  
    // 메시지 전송
    sendMessage(message: string) {
      if (this.dataChannel && this.dataChannel.readyState === "open") {
        this.dataChannel.send(message);
      }
    }
  }
  