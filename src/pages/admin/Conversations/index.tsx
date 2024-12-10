import React, { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical, BsSend } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosConfig";
import { io, Socket } from "socket.io-client";

interface Message {
  _id: string;
  message: string;
  sender: any;
  createdAt: string;
  idConversation?: string;
}

interface Conversation {
  _id: string;
  idUser: string;
  nameConversation: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  messages?: Message[];
}

const AdminConversation: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const ENDPOINT = "https://tea-ceremony-be-zhiv.onrender.com";

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(ENDPOINT);

    return () => {
      // Clean up the socket connection on component unmount
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.get(`/chats`);
        console.log("Fetched conversations:", response.data);
        setConversations(response.data);

        // Automatically select the first conversation if available
        if (response.data.length > 0) {
          setSelectedConversation(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation && socketRef.current) {
      socketRef.current.emit("join_conversation", selectedConversation._id);

      socketRef.current.on("newMessage", (message: Message) => {
        if (message.idConversation === selectedConversation._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage");
      }
    };
  }, [selectedConversation]);

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data } = await axiosInstance.get(
        `/chats/message?idConversation=${conversationId}`
      );
      setMessages(data.messageList);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !socketRef.current)
      return;

    const message: Message = {
      _id: `${Date.now()}`, // Temporary ID for the message
      message: newMessage,
      sender: "ADMIN", // Ensure sender is defined
      createdAt: new Date().toISOString(),
      idConversation: selectedConversation._id,
    };

    try {
      // Send the message to the server to save it
      const { data: savedMessage } = await axiosInstance.post(`/chats/save`, {
        sender: message.sender,
        message: message.message,
        idConversation: message.idConversation,
      });

      // Emit the saved message to the socket
      socketRef.current.emit("sendMessage", savedMessage);

      // Update the local state with the saved message
      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Conversations</h2>
        </div>
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              selectedConversation?._id === conversation._id ? "bg-blue-50" : ""
            }`}
            onClick={() => {
              setSelectedConversation(conversation);
              fetchMessages(conversation._id);
            }}
          >
            <div className="flex items-center">
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{conversation.nameConversation}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(conversation.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Conversation Detail */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="ml-4 text-xl font-semibold">
                    {selectedConversation.nameConversation}
                  </h2>
                </div>
                <BsThreeDotsVertical className="text-gray-500 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex mb-4 ${
                    message.sender === "ADMIN" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "ADMIN"
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    <p>{message.message}</p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
                >
                  <BsSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <FaUser className="w-16 h-16 mx-auto mb-4" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConversation;
