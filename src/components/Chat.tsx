import React, { useState, useEffect, useRef, FormEvent } from "react";
import io from "socket.io-client";
import { IoSendSharp } from "react-icons/io5";
import { FaComments } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import axiosInstance from "../utils/axiosConfig";

const ENDPOINT = "https://tea-ceremony-be-zhiv.onrender.com";
let socket: any;

const ChatComponent = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useSelector((state: RootState) => state.authReducer);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/chats/message?idUser=${user?._id}`
        );
        setMessages(data.messageList);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [user?._id]);

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("join_conversation", user?._id);

    socket.on("newMessage", (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const sender = user?.name;

    if (!messages || messages.length === 0) {
      socket.emit("create_conversation", user);

      socket.on("response_room", async (conversation: any) => {
        const payload = {
          sender,
          message: newMessage,
          idConversation: conversation._id,
        };
        const { data } = await axiosInstance.post(`/chats/save`, payload);
        socket.emit("chat", data);
      });
    } else {
      const idConversation =
        messages[0].idConversation._id || messages[0].idConversation;
      const payload = {
        sender,
        message: newMessage,
        idConversation,
      };
      const { data } = await axiosInstance.post(`chats/save`, payload);
      socket.emit("chat", data);
    }

    setNewMessage("");
  };

  return (
    <div>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors duration-200"
        aria-label="Open chat"
      >
        <FaComments className="w-6 h-6" />
      </button>

      {isChatOpen && (
        <div className="fixed bottom-16 right-4 flex flex-col h-96 w-80 bg-gray-100 shadow-xl rounded-lg overflow-hidden">
          <div className="bg-white shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Chat {user?.name}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender === "ADMIN" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-end space-x-2">
                  {message.sender !== "ADMIN" && (
                    <img
                      src={message?.idConversation?.idUser?.pictureImg}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
                      }}
                    />
                  )}
                  <div
                    className={`max-w-xs ${
                      message.sender === "ADMIN"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    } rounded-lg px-4 py-2`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {message.sender === "ADMIN" && (
                    <img
                      src={message?.idConversation?.idUser?.pictureImg}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                aria-label="Send message"
              >
                <IoSendSharp className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
