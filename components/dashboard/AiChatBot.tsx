"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, BrainCircuit, MessageCircle, Send, User, X } from "lucide-react";
import { aiService, AiChatMessage } from "@/services/ai.service";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "ai",
  content:
    "Chào homie! Tôi là Trợ lý tài chính AI. Bạn cần tôi tư vấn gì không?",
};

export function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const buildChatHistory = (currentMessages: Message[]): AiChatMessage[] => {
    return currentMessages.map((message) => ({
      role: message.role === "ai" ? "assistant" : "user",
      content: message.content,
    }));
  };

  const handleSend = async () => {
    const userMessage = input.trim();

    if (!userMessage || isLoading) return;

    const history = buildChatHistory(messages);

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const aiAnswer = await aiService.chat(userMessage, history);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: aiAnswer || "AI chưa có phản hồi rõ ràng homie ơi.",
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Lỗi rồi homie ơi, tôi không kết nối được với bộ não trung tâm!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    handleSend();
  };

  return (
    <div className="fixed bottom-8 right-8 z-100 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-125 w-87.5 flex-col overflow-hidden rounded-4xl border-2 border-primary/20 bg-background shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 md:w-100">
          <div className="flex items-center justify-between bg-primary p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <BrainCircuit size={20} />
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">
                  Homie AI Advisor
                </h3>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">
                    Đang trực tuyến
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="transition-transform hover:rotate-90"
              aria-label="Đóng chat AI"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="scrollbar-thin flex-1 space-y-4 overflow-y-auto bg-muted/20 p-5"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-sm",
                    message.role === "ai"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {message.role === "ai" ? (
                    <Bot size={16} />
                  ) : (
                    <User size={16} />
                  )}
                </div>

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl p-4 text-xs font-medium leading-relaxed shadow-sm",
                    message.role === "ai"
                      ? "border border-border/40 bg-white text-foreground"
                      : "bg-primary text-white"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 animate-bounce items-center justify-center rounded-xl bg-primary text-white">
                  <Bot size={16} />
                </div>

                <div className="flex items-center gap-1 rounded-2xl border border-border/40 bg-white p-4">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border/40 bg-background p-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Hỏi AI bất cứ điều gì..."
                className="w-full rounded-2xl border-2 border-transparent bg-muted/40 py-3.5 pl-5 pr-12 text-sm outline-none transition-all focus:border-primary/20 focus:bg-background"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-primary transition-all hover:bg-primary/10 disabled:opacity-30"
                aria-label="Gửi tin nhắn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "group relative flex h-16 w-16 items-center justify-center rounded-[1.8rem] text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95",
          isOpen ? "rotate-90 bg-rose-500" : "bg-primary"
        )}
        aria-label={isOpen ? "Đóng chat AI" : "Mở chat AI"}
      >
        {isOpen ? (
          <X size={28} strokeWidth={3} />
        ) : (
          <>
            <MessageCircle
              size={28}
              strokeWidth={2.5}
              className="group-hover:animate-bounce"
            />
            <span className="absolute -right-1 -top-1 h-5 w-5 animate-ping rounded-full border-4 border-background bg-rose-500" />
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-background bg-rose-500" />
          </>
        )}
      </button>
    </div>
  );
}