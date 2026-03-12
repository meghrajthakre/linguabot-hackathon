import React from "react";

const ChatPreview = () => {
  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg h-[420px] flex flex-col overflow-hidden">

      {/* header */}
      <div className="bg-yellow-400 text-white px-4 py-3 font-semibold">
        🤖 LinguaBot Preview
      </div>

      {/* messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm">
        <div className="bg-gray-100 px-3 py-2 rounded-xl w-fit">
          👋 Hi! How can I help you?
        </div>

        <div className="bg-yellow-400 text-white px-3 py-2 rounded-xl w-fit ml-auto">
          Do you have discount?
        </div>

        <div className="bg-gray-100 px-3 py-2 rounded-xl w-fit">
          Yes! We offer student discount 🎓
        </div>
      </div>

      {/* input */}
      <div className="p-3 border-t bg-white/60 flex gap-2">
        <input
          placeholder="Type message..."
          className="flex-1 px-3 py-2 rounded-xl border bg-white outline-none"
        />
        <button className="px-4 py-2 bg-yellow-400 text-white rounded-xl">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPreview;
