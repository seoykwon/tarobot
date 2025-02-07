import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatProps {
  sessionId: string;
  userName: string;
}

interface ChatMessage {
  user: string;
  message: string;
  timestamp: number;
}

export default function ChatComponent({ sessionId, userName }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Socket.IO 연결 설정
  useEffect(() => {
    const newSocket = io('http://localhost:8000'); // 서버 주소 확인
    newSocket.emit('join_room', { room_id: sessionId });
  
    // 사용자 메시지 수신
    newSocket.on('chat_message', (data) => {
      setMessages(prev => [...prev, {
        ...data,   
        timestamp: Date.now()
      }]);
    });
  
    // 챗봇 응답 수신
    newSocket.on('chatbot_message', (data) => {
      setMessages(prev => [...prev, {
        user: "Assistant", 
        message: data.response || data.message, // 백엔드 데이터 형식 확인 필요
        timestamp: data.timestamp || Date.now() // 타임스탬프 처리
      }]);
    });
  
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  // 새 메시지가 추가될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageData = {
        room_id: sessionId,
        user: userName,
        message: message.trim(),
        timestamp: Date.now()
      };
      socket.emit('chat_message', messageData);
      setMessages(prev => [...prev, messageData]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-[800px] bg-white rounded-lg shadow-lg flex flex-col">
      {/* 채팅 헤더 */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">채팅</h2>
      </div>
  
      {/* 채팅 메시지 영역 */}
      <div 
        ref={messageContainerRef}
        className="h-[500px] overflow-y-auto p-6 space-y-3 bg-gray-50"
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.user === userName ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block max-w-[80%] px-3 py-2 rounded-lg 
                ${msg.user === userName 
                  ? 'bg-blue-500 text-white' 
                  : msg.user === "Assistant" ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-800'
                }`}
            >
              <div className="text-xs opacity-75 mb-1">
                {msg.user}
              </div>
              <div className="break-words">
                {msg.message}
              </div>
              <div className="text-xs opacity-75 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
  
      {/* 메시지 입력 영역 */}
      <div className="border-t p-6 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={sendMessage}
            className="px-6 py-3 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
