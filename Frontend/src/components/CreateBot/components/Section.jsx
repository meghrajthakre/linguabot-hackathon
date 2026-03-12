import React from "react";

/**
 * Section wrapper component
 */
export const Section = ({ icon: Icon, label, color, children }) => (
  <div className="group rounded-2xl border border-[#e8e0d0] bg-[#fdf9f3] p-5 transition-all hover:border-yellow-300 hover:shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon size={15} />
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
    {children}
  </div>
);