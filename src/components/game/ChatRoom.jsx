import { useState, useEffect, useRef } from "react";
import "tailwindcss/tailwind.css";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { RECEIVE_MESSAGE, SEND_MESSAGE } from "@/constants/game";

export const ChatRoom = ({ game_id }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const { socket } = useAuth();

  const sender = localStorage.getItem("username");

  const handleSend = () => {
    if (input.trim()) {
      const message = {
        content: input,
        sender: sender,
        timestamp: new Date(),
      };
      socket.emit(SEND_MESSAGE, { game_id, message });
      // setMessages([...messages, input]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(RECEIVE_MESSAGE, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off(RECEIVE_MESSAGE);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader className="flex flex-col ml-2 p-2 text-gray-700">
        <CardTitle>Chat room</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex-grow overflow-y-auto h-full no-scrollbar text-sm">
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start ${
                message.sender === sender
                  ? "border-l-4 border-green-600 pl-2"
                  : "pl-3"
              }`}
            >
              <div className="p-1 rounded-lg w-full break-words">
                <span className="font-bold text-gray-500 text-sm tracking-tight">
                  {message.sender}{" "}
                </span>
                <span className="text-gray-800 break-words">{message.content}</span>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="shadow-lg rounded-b-lg">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Send message..."
        />
      </CardFooter>
    </Card>
  );
};
