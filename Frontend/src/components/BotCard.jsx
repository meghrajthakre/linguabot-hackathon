import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  Edit3,
  BarChart3,
  Trash2,
  ArrowRight,
  MoreVertical,
  Clock,
  Code,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationModal from "../components/ConfirmationModal";
import { URL } from "../constants/baseUrl";

const LANGUAGE_COLORS = {
  english: "bg-blue-100 text-blue-700",
  hindi: "bg-orange-100 text-orange-700",
  spanish: "bg-red-100 text-red-700",
  french: "bg-purple-100 text-purple-700",
  german: "bg-green-100 text-green-700",
  portuguese: "bg-yellow-100 text-yellow-700",
  arabic: "bg-pink-100 text-pink-700",
  japanese: "bg-indigo-100 text-indigo-700",
  chinese: "bg-rose-100 text-rose-700",
  korean: "bg-cyan-100 text-cyan-700",
  russian: "bg-gray-100 text-gray-700",
};

const DEFAULT_LANGUAGE_COLOR = "bg-gray-100 text-gray-700";

const BotCard = ({ bot, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const menuRef = useRef(null);
  const location = useLocation();



  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleDeleteClick = useCallback(() => {
    setIsMenuOpen(false);
    setIsModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await onDelete(bot._id);
      toast.success("Bot deleted successfully 🗑️");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete bot");
    } finally {
      setIsDeleting(false);
    }
  }, [bot._id, onDelete]);

  const getLanguageColor = (lang) =>
    LANGUAGE_COLORS[lang?.toLowerCase()] || DEFAULT_LANGUAGE_COLOR;

  const formatDate = (date) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleCopyEmbed = () => {
    const embedCode = `<script>
  window.LinguaBotConfig = {
    publicKey: "${bot.publicKey}"
  };
</script>
<script src="${URL}/widget.js"><\/script>`;

    navigator.clipboard.writeText(embedCode).then(() => {
      setEmbedCopied(true);
      toast.success("Embed code copied!");
      setTimeout(() => setEmbedCopied(false), 2000);
    });
  };

  return (
    <>
      {/* CARD */}
      <div className="group relative h-full rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col hover:border-yellow-200 overflow-visible">

        {/* HEADER */}
        <div className="relative h-20 bg-gradient-to-br from-yellow-400 to-yellow-500">
          <div className="h-full px-6 py-3 flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-xl">
              🤖
            </div>

            {/* MENU */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="p-2 rounded-lg text-white hover:bg-white/20 transition"
              >
                <MoreVertical size={20} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-xl shadow-2xl border z-[999]">
                  <div className="py-2">
                    <Link
                      to={`/bot/${bot._id}/edit`}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-yellow-50"
                    >
                      <Edit3 size={18} className="text-yellow-600" />
                      Edit Bot
                    </Link>

                    <Link
                      to={`/bot/${bot._id}/analytics`}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-yellow-50"
                    >
                      <BarChart3 size={18} className="text-blue-600" />
                      View Analytics
                    </Link>

                    <div className="border-t my-2" />

                    <button
                      onClick={handleDeleteClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                      Delete Bot
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold">
              {bot.name || "Untitled Bot"}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {bot.description || "No description provided"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border space-y-3">
            <div className="flex justify-between">
              <span className="text-xs font-semibold">Language</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getLanguageColor(
                  bot.language
                )}`}
              >
                🌍 {bot.language || "English"}
              </span>
            </div>

            <div className="flex justify-between border-t pt-2">
              <span className="text-xs font-semibold flex items-center gap-1">
                <Clock size={12} />
                Created
              </span>
              <span className="text-xs">
                {formatDate(bot.createdAt)}
              </span>
            </div>
          </div>

          {/* EMBED BUTTON */}
          <button
            onClick={() => setIsEmbedOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-yellow-400 text-yellow-600 font-semibold rounded-xl hover:bg-yellow-50 transition"
          >
            <Code size={16} />
            Get Embed Code
          </button>
          
        </div>

        {/* FOOTER */}
        <div className="p-6 pt-0">
          <Link
            to={`/bot/${bot._id}`}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-xl transition hover:scale-[1.02]"
          >
            View Bot
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* EMBED MODAL */}
      {isEmbedOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEmbedOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4 flex justify-between">
                <h2 className="font-bold text-gray-900">Embed Code</h2>
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="text-gray-800 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  {`<script>
                window.LinguaBotConfig = {
                  publicKey: "${bot.publicKey}"
                };
              </script>
              <script src="${URL}/widget.js"><\/script>`}
                </div>
              </div>

              <div className="border-t p-4 flex gap-3">
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="flex-1 bg-gray-100 py-2 rounded-lg"
                >
                  Close
                </button>

                <button
                  onClick={handleCopyEmbed}
                  className={`flex-1 py-2 rounded-lg ${embedCopied
                    ? "bg-green-500 text-white"
                    : "bg-yellow-400 text-gray-900"
                    }`}
                >
                  {embedCopied ? "✓ Copied" : "Copy Code"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* DELETE MODAL */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Bot"
        message={`Are you sure you want to delete "${bot.name || "this bot"
          }"?`}
        type="danger"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
};

export default BotCard;