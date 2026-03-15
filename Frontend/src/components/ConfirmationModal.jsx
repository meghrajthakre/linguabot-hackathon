import React from 'react';
import ReactDOM from 'react-dom';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure?',
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const iconMap = {
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    danger: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  };

  const { icon: Icon, color, bg, border } = iconMap[type];

  const confirmButtonStyles = {
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-200 disabled:bg-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 disabled:bg-gray-300',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 disabled:bg-gray-300',
    info: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200 disabled:bg-gray-300',
  };

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
        onClick={onCancel}
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl border border-[#e8e0d0] w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className={`${bg} px-6 py-5 border-b ${border} flex items-start justify-between rounded-t-2xl`}>
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-2 rounded-full ${color} bg-white shadow-sm`}>
                <Icon className={color} size={24} />
              </div>
              <h2 id="modal-title" className="text-lg font-bold text-gray-900">
                {title}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition p-1.5 hover:bg-white/50 rounded-lg"
              aria-label="Close"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content – note: using div instead of p to avoid nesting errors */}
          <div className="px-6 py-6">
            <div className="text-sm text-gray-600 leading-relaxed">{message}</div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-200 rounded-b-2xl flex gap-3 justify-center">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold text-sm transition-all disabled:opacity-50 min-w-[100px]"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 min-w-[120px] ${confirmButtonStyles[type]}`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ConfirmationModal;