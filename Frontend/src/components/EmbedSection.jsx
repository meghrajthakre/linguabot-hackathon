import React, { useState } from "react";
import { Copy, Check, KeyRound, Code } from "lucide-react";
import toast from "react-hot-toast";
import { URL } from "../../../backend/utils/constants";

const EmbedSection = ({ bot }) => {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script>
  window.LinguaBotConfig = {
    publicKey: "${bot.publicKey}"
  };
</script>
<script src="${URL}/widget.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
     toast.success("Embed code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-5 bg-gradient-to-br from-gray-50 to-white border border-[#e8e0d0] rounded-xl p-5 space-y-4 shadow-sm">

      {/* Section Header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Code size={16} className="text-yellow-600" />
        Embed Widget
      </div>

      {/* Public Key */}
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <KeyRound size={12} />
          Public Key
        </div>

        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
          <span className="text-xs font-mono truncate text-gray-700">
            {bot.publicKey}
          </span>
        </div>
      </div>

      {/* Embed Code Box */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500">Embed Code</p>

        <div className="relative">
          <pre className="text-xs bg-gray-900 text-green-400 border rounded-lg p-4 overflow-x-auto leading-relaxed">
            {embedCode}
          </pre>

          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 hover:bg-yellow-600 transition shadow-sm"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="text-[11px] text-gray-400 leading-relaxed">
        Add this code before your website’s <strong>&lt;/body&gt;</strong> tag.
      </div>
    </div>
  );
};

export default EmbedSection;