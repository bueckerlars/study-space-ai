import { useState, forwardRef, useImperativeHandle } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./chat-message";
import ProjectSummary from "../ProjectSummery";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  message: string;
}

export interface ChatScrollBoxRef {
  addMessage: (newMessage: ChatMessage) => void;
}

interface ChatScrollBoxProps {
  projectId: string;
}

const ChatScrollBox = forwardRef<ChatScrollBoxRef, ChatScrollBoxProps>(({ projectId }, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (newMessage: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useImperativeHandle(ref, () => ({
    addMessage,
  }));

  return (
    <ScrollArea className="h-full w-full p-4">
      <ProjectSummary projectId={projectId} />
      <div className="flex flex-col gap-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} message={msg.message} />
        ))}
      </div>
    </ScrollArea>
  );
});

ChatScrollBox.displayName = "ChatScrollBox";

export default ChatScrollBox;