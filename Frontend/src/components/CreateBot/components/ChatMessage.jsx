import React from "react";

/**
 * ChatMessage component
 */
export const ChatMessage = ({ message, index }) => (
  <div
    className={`flex items-end gap-2 ${message.from === "user" ? "justify-end" : ""}`}
    style={{ animation: `fadeIn 0.2s ease-out ${index * 0.05}s both` }}
  >
    {message.from === "bot" && (
      <div className="bg-yellow-400 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm flex-shrink-0">
        B
      </div>
    )}
    <div
      className={`px-4 py-2.5 text-sm rounded-2xl max-w-[78%] shadow-sm ${
        message.from === "user"
          ? "bg-yellow-400 text-gray-900 rounded-br-sm"
          : "bg-[#f5f0e8] border border-[#e8e0d0] text-gray-800 rounded-bl-sm"
      }`}
    >
      {message.text}
    </div>
  </div>
);