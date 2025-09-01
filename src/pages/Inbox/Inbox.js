// src/pages/Chat/Inbox.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function Inbox() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!user || !token) return;

    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/chat/conversations/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const convos = res.data;

        // Fetch last message for each conversation
        const convosWithLastMsg = await Promise.all(
          convos.map(async (conv) => {
            const msgsRes = await axios.get(
              `http://localhost:4000/api/chat/messages/${conv._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const messages = msgsRes.data;
            const lastMsg = messages[messages.length - 1] || null;

            return {
              ...conv,
              lastMsg,
            };
          })
        );

        setConversations(convosWithLastMsg);
      } catch (err) {
        console.error('❌ Error fetching conversations:', err);
      }
    };

    fetchConversations();
  }, [user, token]);

  const handleChatClick = (conversation) => {
    const recipient = conversation.participants?.find(p => p._id !== user._id);
    if (!recipient) return;

    navigate(`/chat/${recipient._id}`, {
      state: { 
        chatData: { 
          recipientId: recipient._id, 
          sender: recipient.name || recipient.email || "Unknown", 
          avatar: recipient.name?.[0] || "?" 
        } 
      }
    });
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold text-black">Inbox</h1>
      </div>

      <div className="px-6 space-y-4">
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No conversations yet.
          </p>
        ) : (
          conversations.map((conv) => {
            const recipient = conv.participants?.find(p => p._id !== user._id);
            if (!recipient) return null;

            const lastMsg = conv.lastMsg;

            return (
              <div
                key={conv._id}
                onClick={() => handleChatClick(conv)}
                className="flex items-start space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
                  {recipient.name?.[0] || "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-black text-base">{recipient.name || recipient.email || "Unknown"}</h3>
                    <span className="text-gray-400 text-sm whitespace-nowrap ml-2">
                      {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {lastMsg ? lastMsg.text : 'No messages yet.'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
