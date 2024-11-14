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

export const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader className="flex flex-col p-4 text-gray-700">
        <CardTitle>Chat room</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex-grow overflow-y-auto h-full no-scrollbar text-sm">
        <div className="flex flex-col space-y-2 p-2">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              {message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="shadow-lg">
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