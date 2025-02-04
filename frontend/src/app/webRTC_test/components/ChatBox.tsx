"use client";

import React, { useState, useEffect } from "react";
import { WebRTCConnection } from "./PeerConnection";

const ChatBox: React.FC = () => {
  const [connection, setConnection] = useState<WebRTCConnection | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [isCaller, setIsCaller] = useState<boolean>(false);

  useEffect(() => {
    const webRTC = new WebRTCConnection((message) => {
      setMessages((prevMessages) => [...prevMessages, `Peer: ${message}`]);
    });
    setConnection(webRTC);

    return () => {
      // Clean up connection on unmount
      setConnection(null);
    };
  }, []);

  const handleCreateOffer = async () => {
    if (!connection) return;
    setIsCaller(true);

    const offer = await connection.createOffer();
    console.log("Offer created:", offer);
    alert("Send the following offer to the peer:\n" + JSON.stringify(offer));
  };

  const handleSetAnswer = async () => {
    if (!connection) return;

    const answerString = prompt("Paste the peer's answer here:");
    if (!answerString) return;

    const answer = JSON.parse(answerString);
    await connection.setAnswer(answer);
    console.log("Answer set successfully");
  };

  const handleSetOfferAndCreateAnswer = async () => {
    if (!connection) return;

    const offerString = prompt("Paste the peer's offer here:");
    if (!offerString) return;

    const offer = JSON.parse(offerString);
    const answer = await connection.createAnswer(offer);

    console.log("Answer created:", answer);
    alert("Send the following answer to the peer:\n" + JSON.stringify(answer));
  };

  const handleSendMessage = () => {
    if (!connection || !input.trim()) return;

    connection.sendMessage(input);
    setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
    setInput("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">WebRTC Chat</h1>
      <div className="border p-2 mb-4 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={handleCreateOffer} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Offer
        </button>
        <button onClick={handleSetOfferAndCreateAnswer} className="bg-green-500 text-white px-4 py-2 rounded">
          Set Offer & Create Answer
        </button>
        <button onClick={handleSetAnswer} className="bg-purple-500 text-white px-4 py-2 rounded">
          Set Answer
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          className="border p-2 flex-grow"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
