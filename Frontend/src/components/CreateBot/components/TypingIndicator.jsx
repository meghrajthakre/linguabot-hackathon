import React from "react";

/**
 * TypingIndicator component
 */
export const TypingIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="bg-yellow-400 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
      B
    </div>
    <div className="px-4 py-3 bg-[#f5f0e8] border border-[#e8e0d0] rounded-2xl rounded-bl-sm flex gap-1">
      {[0, 1, 2].map((n) => (
        <span
          key={n}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          style={{ animation: `bounce 1s ease-in-out ${n * 0.2}s infinite` }}
        />
      ))}
    </div>
  </div>
);