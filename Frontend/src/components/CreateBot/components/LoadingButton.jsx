import React from "react";

/**
 * Loading Button Component
 */
export const LoadingButton = ({ loading, children, ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-semibold px-6 py-2.5 rounded-xl shadow-sm transition text-sm"
  >
    {loading ? (
      <>
        <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
        {typeof children === "string" ? `${children}...` : children}
      </>
    ) : (
      children
    )}
  </button>
);