import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, Send } from "lucide-react";
import BackButton from "../components/BackButton";

const BotView = () => {
    const { id } = useParams();

    const [bot, setBot] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);


    /* ===============================
       FETCH BOT INFO
    ============================== */
    useEffect(() => {
        const fetchBot = async () => {
            const res = await api.get(`/bots/${id}`);
            setBot(res.data);

            setMessages([
                {
                    from: "bot",
                    text: `Hi! I'm ${res.data.bot.name} 👋 How can I help you?`,
                },
            ]);
        };

        fetchBot();
    }, [id]);

    

    /* ===============================
       SEND MESSAGE
    ============================== */
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;

        setMessages((prev) => [
            ...prev,
            { from: "user", text: userMessage },
        ]);

        setInput("");
        setLoading(true);

        try {
            const res = await api.post(`/chat/${id}`, {
                message: userMessage,
            });

            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: res.data.aiResponse,
                    time: res.data.responseTimeMs,
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!bot) return null;

  return (
  <div className="h-90 mt-22 flex items-center justify-center p-4">
    
    <div className="w-full max-w-2xl h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">

      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-2xl shadow-sm">
            🤖
          </div>

          <div>
            <h1 className="font-semibold text-gray-900 text-lg">
              {bot.name}
            </h1>
            <p className="text-xs text-gray-500">
              {bot.language?.toUpperCase() || "EN"} • AI Assistant
            </p>
          </div>
        </div>

          <BackButton />
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
        <div className="p-6 space-y-6">

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition
                  ${
                    m.from === "user"
                      ? "bg-yellow-400 text-gray-900 rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                  }`}
              >
                {m.text}

                {m.time && (
                  <div className="text-xs text-gray-400 mt-2 text-right">
                    {m.time} ms
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl text-sm shadow-sm flex gap-2 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* INPUT */}
      <div className="px-6 py-4 border-t bg-white">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-yellow-400 transition">
          
          <input
            value={input}
            autoFocus={true}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-sm px-2"
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-lg bg-yellow-400 hover:bg-yellow-500 active:scale-95 flex items-center justify-center transition disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default BotView;