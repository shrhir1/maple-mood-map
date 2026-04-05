import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface MapleSupportChatProps {
  emotion: string;
  severity: number;
}

const SYSTEM_PROMPT =
  "You are Maple, a warm caring mental wellness mushroom companion. Help the user find real San Diego mental health resources including UCSD Counseling at caps.ucsd.edu, 211 San Diego at 211sandiego.org, and NAMI San Diego at namisandiego.org. Be warm, gentle, and supportive. Always recommend professional help for serious concerns.";

const OPENING_MESSAGE =
  "I can see you're going through something really hard. I'm here to help you find real support. What's on your mind?";

const MapleSupportChat: React.FC<MapleSupportChatProps> = ({ emotion, severity }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch("https://gateway.fetch.ai/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_ASI1_API_KEY}`,
        },
        body: JSON.stringify({ model: "asi1", messages: apiMessages }),
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || "I'm here for you. Could you tell me more?";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now, but please reach out to UCSD Counseling at caps.ucsd.edu or call 211 San Diego. You're not alone. 💛" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="w-full rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#FFF5F0",
        border: "1px solid #F5C6D0",
        height: 380,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: "#FFF0F3", borderBottom: "1px solid #F5C6D0" }}
      >
        <span className="text-xl">🍄</span>
        <span className="font-bold text-sm" style={{ color: "#6B2737" }}>
          Maple Support Chat
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="rounded-2xl px-4 py-2.5 max-w-[80%] text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? { background: "#6B2737", color: "#FFFFFF" }
                  : { background: "#FFF8F0", color: "#3D2B1F", border: "1px solid #F0E0D0" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-3 flex gap-1.5 items-center"
              style={{ background: "#FFF8F0", border: "1px solid #F0E0D0" }}
            >
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#6B2737", animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#6B2737", animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#6B2737", animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-3 flex gap-2" style={{ borderTop: "1px solid #F5C6D0" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 rounded-xl px-4 py-2.5 text-sm border-none outline-none"
          style={{ background: "#FFFFFF", color: "#3D2B1F" }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="rounded-xl px-4 py-2.5 flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "#6B2737", color: "#FFFFFF" }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MapleSupportChat;
