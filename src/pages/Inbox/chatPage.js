import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

let socket;

export default function ChatPage() {
  const { sender } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { chatData } = location.state || {};
  const { user, token } = useContext(AuthContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);
  const recipientId = chatData?.recipientId || sender;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Socket.IO
  useEffect(() => {
    if (!user || !token) return;

    socket = io("http://localhost:4000", {
      auth: { token: `Bearer ${token}` },
    });

    // Listen for messages from server
    socket.on("message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev; // avoid duplicates
        return [...prev, msg];
      });

      // Update conversationId if null
      if (!conversationId && msg.conversationId) {
        setConversationId(msg.conversationId);
      }
    });

    socket.on("error", (err) => console.error("Socket error:", err));

    return () => socket.disconnect();
  }, [user, token, conversationId]);

  // Initialize conversation & fetch messages
  useEffect(() => {
    if (!user || !recipientId || !token) return;

    const initChat = async () => {
      try {
        // Create or get conversation
        const convoRes = await axios.post(
          "http://localhost:4000/api/chat/conversation",
          { senderId: user._id, receiverId: recipientId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setConversationId(convoRes.data._id);

        // Fetch messages
        const msgsRes = await axios.get(
          `http://localhost:4000/api/chat/messages/${convoRes.data._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages(msgsRes.data);
      } catch (err) {
        console.error("❌ Error initializing chat:", err);
      }
    };

    initChat();
  }, [recipientId, user, token]);

  // Send message
  const handleSendMessage = () => {
    if (!message.trim() || !recipientId) return;

    // Emit message; server handles saving and broadcasting
    socket.emit("message", { conversationId, recipientId, text: message });

    setMessage(""); // clear input
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => navigate("/inbox");

  return (
    <div className="w-full max-w-full bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
        <button onClick={handleBack} className="mr-3 p-2 hover:bg-gray-100 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold text-lg">
            {chatData?.avatar || "A"}
          </div>
          <div>
            <h2 className="font-semibold text-black text-lg">{chatData?.sender || "Atlasia"}</h2>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto bg-gray-50" style={{ paddingBottom: '80px' }}>
        {messages.map((msg) => (
          <div key={msg._id} className={`flex mb-2 ${msg.sender === user._id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === user._id ? "bg-green-600 text-white" : "bg-white text-black border"}`}>
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs mt-1 text-gray-400">
                {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center space-x-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border rounded-2xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={1}
            style={{ maxHeight: 120 }}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
