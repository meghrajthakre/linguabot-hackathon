const ChatPreview = ({ botName, botDescription }) => {
  const bottomRef = useRef(null);

  const getInitialMessages = () => [
    {
      from: "bot",
      text: `Hi! I'm ${botName || "your AI assistant"} 👋`,
    },
    { from: "user", text: "What can you do?" },
    {
      from: "bot",
      text: botDescription || "I help answer customer queries.",
    },
  ];

  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setMessages(getInitialMessages());
  }, [botName, botDescription]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            botDescription ||
            "I'm here to assist you with any customer queries.",
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  const reset = () => {
    setMessages(getInitialMessages());
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-xl">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              {botName || "Bot Preview"}
            </h3>
            <p className="text-xs text-gray-500">
              Live conversation simulation
            </p>
          </div>
        </div>

        <span className="text-xs text-green-500 font-medium">
          ● Online
        </span>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${
              m.from === "user" ? "justify-end" : ""
            }`}
          >
            {m.from === "bot" && (
              <div className="bg-yellow-400 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold">
                B
              </div>
            )}

            <div
              className={`px-4 py-2.5 text-sm rounded-2xl max-w-[75%]
                ${
                  m.from === "user"
                    ? "bg-yellow-400 text-black rounded-br-sm"
                    : "bg-[#f5f0e8] border border-[#e8e0d0] text-gray-800 rounded-bl-sm"
                }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold">
              B
            </div>
            <div className="px-4 py-2 bg-[#f5f0e8] border border-[#e8e0d0] rounded-2xl text-sm">
              Typing...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 border border-[#e8e0d0] rounded-xl px-4 py-2 text-sm bg-[#f5f0e8] focus:ring-2 focus:ring-yellow-300 outline-none"
          placeholder="Type a message..."
        />

        <button
          onClick={send}
          className="px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 font-semibold shadow transition"
        >
          Send
        </button>
      </div>

      <button
        onClick={reset}
        className="text-xs text-gray-400 hover:text-gray-600 mt-3 self-end"
      >
        Reset Chat
      </button>
    </>
  );
};