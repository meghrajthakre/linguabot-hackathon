import React from "react";

const EmbedCodeModal = ({ open = false, onClose = () => {} }) => {
  if (!open) return null;

  const code = `<script src="https://linguabot.app/widget.js" data-bot-id="abc123"></script>`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-[#f3efe6] to-[#e8e1d2] w-full max-w-xl p-6 rounded-3xl shadow-2xl border border-white/40">

        <h2 className="text-xl font-bold mb-3">Install LinguaBot</h2>
        <p className="text-sm text-gray-600 mb-4">
          Copy and paste this code before closing body tag
        </p>

        <pre className="bg-black text-green-400 p-4 rounded-xl text-sm overflow-auto">
          {code}
        </pre>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbedCodeModal;
