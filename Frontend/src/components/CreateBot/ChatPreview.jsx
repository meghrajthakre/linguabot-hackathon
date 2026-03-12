import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bot, RotateCcw, Send } from "lucide-react";
import { ChatMessage, TypingIndicator } from "./components";
import { TIMINGS } from "../../constants";

/**
 * Chat Preview Component
 */
export const ChatPreview = ({ botName, botDescription }) => {
  const messagesContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const getInitialMessages = useCallback(
    () => [
      { from: "bot", text: `Hi! I'm ${botName || "your AI assistant"} 👋` },
      { from: "user", text: "What can you do?" },
      { from: "bot", text: botDescription || "I help answer customer queries." },
    ],
    [botName, botDescription]
  );

  useEffect(() => {
    setMessages(getInitialMessages());
  }, [getInitialMessages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = useCallback(() => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setTyping(true);

    const timeoutId = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: botDescription || "I'm here to assist you with any customer queries.",
        },
      ]);
      setTyping(false);
    }, TIMINGS.CHAT_PREVIEW_DELAY);

    return () => clearTimeout(timeoutId);
  }, [input, botDescription]);

  const reset = useCallback(() => {
    setMessages(getInitialMessages());
    setInput("");
    setTyping(false);
  }, [getInitialMessages]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return (
    <div className="rounded-3xl shadow-lg p-6 flex flex-col h-[600px] bg-white">
      <div className="flex items-center justify-between border-b border-[#f0e8d8] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-xl shadow-sm">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">
              {botName || "Bot Preview"}
            </h3>
            <p className="text-xs text-gray-400">Live conversation simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-500 font-medium">Online</span>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin"
      >
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} index={i} />
        ))}

        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-[#e8e0d0] rounded-xl px-4 py-2.5 text-sm bg-[#f5f0e8] focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder-gray-400"
          placeholder="Type a message..."
          aria-label="Chat message input"
        />
        <button
          onClick={send}
          className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 font-semibold shadow-sm transition flex items-center gap-1.5 text-sm"
          aria-label="Send message"
        >
          <Send size={14} /> Send
        </button>
      </div>

      <button
        onClick={reset}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-3 self-end transition"
        aria-label="Reset chat"
      >
        <RotateCcw size={11} /> Reset Chat
      </button>
    </div>
  );
};