import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure?",
  type = "warning", // warning, danger, success, info
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  const iconMap = {
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    danger: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    success: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50" },
  };

  const { icon: Icon, color, bg } = iconMap[type];

  const confirmButtonStyles = {
    warning:
      "bg-yellow-400 hover:bg-yellow-500 text-gray-900 disabled:bg-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300",
    success: "bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300",
    info: "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-xl border border-[#e8e0d0] max-w-sm w-full transform transition-all duration-200 scale-100 animate-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`${bg} px-6 py-4 border-b border-[#e8e0d0] flex items-start justify-between rounded-t-2xl`}>
            <div className="flex items-start gap-3 flex-1">
              <Icon className={`${color} flex-shrink-0 mt-0.5`} size={20} />
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-[#e8e0d0] rounded-b-2xl flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-[#e8e0d0] text-gray-700 hover:bg-[#fdf9f3] font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
                confirmButtonStyles[type]
              }`}
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : null}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;