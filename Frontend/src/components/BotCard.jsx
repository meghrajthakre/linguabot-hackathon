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
  Loader,
  CheckCircle,
  AlertCircle,
  Globe,
  Zap,
} from "lucide-react";

import toast from "react-hot-toast";
import ConfirmationModal from "../components/ConfirmationModal";
import api from "../api/axios";

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
  const [menuPosition, setMenuPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(null);

  const menuRef = useRef(null);
  const location = useLocation();

  /* CLOSE MENU ON ROUTE CHANGE */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  /* OUTSIDE CLICK + ESC CLOSE */
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  /* CHECK TRAINING STATUS */
  useEffect(() => {
    if (!bot.website || !bot.websiteStatus) return;

    const checkStatus = async () => {
      try {
        const response = await api.get(`/bots/${bot._id}/train/status`);
        setTrainingStatus(response.data);
      } catch (error) {
        console.error("Failed to check training status:", error);
      }
    };

    checkStatus();

    if (bot.websiteStatus === "training") {
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [bot._id, bot.website, bot.websiteStatus]);

  /* MENU TOGGLE */
  const handleMenuToggle = (e) => {
    e.stopPropagation();

    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.right - 224,
    });

    setIsMenuOpen(true);
  };

  /* DELETE */
  const handleDeleteClick = useCallback(() => {
    setIsMenuOpen(false);
    setIsModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await onDelete(bot._id);
      toast.success("Bot deleted successfully");
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to delete bot");
    } finally {
      setIsDeleting(false);
    }
  }, [bot._id, onDelete]);

  /* RETRAIN */
  const handleRetrain = async () => {
    try {
      await api.post(`/bots/${bot._id}/train/retrain`);
      toast.success("Retraining started...");
      setTrainingStatus({ ...trainingStatus, status: "training" });
    } catch (error) {
      toast.error("Failed to start retraining");
    }
  };

  /* COPY EMBED */
  const handleCopyEmbed = () => {
    const embedCode = `<script>
window.LinguaBotConfig = {
publicKey: "${bot.publicKey}"
};
</script>
<script src="https://localhost:4000/widget.js"><\/script>`;

    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied!");
    setEmbedCopied(true);

    setTimeout(() => {
      setEmbedCopied(false);
    }, 2000);
  };

  const getLanguageColor = (lang) =>
    LANGUAGE_COLORS[lang?.toLowerCase()] || DEFAULT_LANGUAGE_COLOR;

  const formatDate = (date) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTrainingStatusDisplay = () => {
    if (!trainingStatus) return null;

    const status = trainingStatus.status;

    if (status === "training") {
      return (
        <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200/60 rounded-xl p-4 space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-blue-700">
                Training in progress
              </span>
            </div>
            <Loader size={12} className="text-blue-600 animate-spin" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-600/70">Chunks</span>
            <span className="text-sm font-bold text-blue-700">
              {trainingStatus.chunkCount || 0}
            </span>
          </div>
          <div className="w-full h-1.5 bg-blue-200/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((trainingStatus.chunkCount || 0) / 50 * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      );
    }

    if (status === "completed") {
      return (
        <div className="bg-gradient-to-br from-green-50 to-green-50/50 border border-green-200/60 rounded-xl p-4 space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700">
                Ready to use
              </span>
            </div>
            <Zap size={12} className="text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-green-600/70">Chunks indexed</span>
            <span className="text-sm font-bold text-green-700">
              {trainingStatus.chunkCount}
            </span>
          </div>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200/60 rounded-xl p-4 space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-red-600" />
              <span className="text-xs font-semibold text-red-700">
                Training failed
              </span>
            </div>
          </div>
          <div className="text-xs text-red-600/70 line-clamp-1">
            {trainingStatus.error || "Unknown error"}
          </div>
          <button
            onClick={handleRetrain}
            className="w-full text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* CARD */}
      <div className="group relative h-full rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col hover:border-yellow-300/60 overflow-hidden">

        {/* HEADER - IMPROVED */}
        <div className="relative h-24 bg-gradient-to-br from-yellow-400 via-yellow-450 to-yellow-500 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
          </div>

          <div className="relative h-full px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/90 shadow-lg flex items-center justify-center text-2xl backdrop-blur-sm border border-yellow-200/30 group-hover:shadow-xl transition">
                🤖
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {bot.name}
                </h3>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${getLanguageColor(
                    bot.language
                  )}`}
                >
                  {bot.language}
                </span>
              </div>
            </div>

            {/* MENU BUTTON */}
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition duration-200"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* BODY - IMPROVED */}
        <div className="flex-1 p-6 space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600/80 line-clamp-2 leading-relaxed">
            {bot.description || "No description provided"}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-gray-50/80 to-gray-50/40 rounded-lg p-3 border border-gray-200/40 backdrop-blur-sm">
              <span className="text-xs text-gray-500/70 font-medium block mb-1">
                Created
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {formatDate(bot.createdAt)}
              </span>
            </div>

            <div className="bg-gradient-to-br from-gray-50/80 to-gray-50/40 rounded-lg p-3 border border-gray-200/40 backdrop-blur-sm">
              <span className="text-xs text-gray-500/70 font-medium block mb-1">
                Status
              </span>
              <span className="text-sm font-semibold text-gray-700">
                Active ✓
              </span>
            </div>
          </div>

          {/* Website URL - IMPROVED */}
          {bot.website && (
            <div className="bg-gradient-to-br from-blue-50/60 to-blue-50/30 rounded-lg p-3 border border-blue-200/40 backdrop-blur-sm">
              <div className="flex items-start gap-2">
                <Globe size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-blue-600/60 font-medium block">
                    Website
                  </span>
                  <span
                    className="text-xs font-semibold text-blue-700 truncate block mt-0.5"
                    title={bot.website}
                  >
                    {bot.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Training Status */}
          {bot.website && getTrainingStatusDisplay()}

          {/* Buttons Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 border border-yellow-300/60 text-yellow-700 font-semibold rounded-lg hover:bg-yellow-50/60 transition duration-200 text-sm"
            >
              <Code size={15} />
              <span className="hidden sm:inline">Embed</span>
            </button>

            <Link
              to={`/bot/${bot._id}`}
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-lg transition duration-200 hover:shadow-lg hover:scale-[1.02] text-sm"
            >
              <span className="hidden sm:inline">View</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* DROPDOWN MENU - IMPROVED */}
      {isMenuOpen && menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="w-56 bg-white rounded-xl shadow-2xl border border-gray-200/60 z-[9999] backdrop-blur-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="py-1">
              <Link
                to={`/bot/${bot._id}/edit`}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-yellow-50/50 transition"
              >
                <Edit3 size={18} className="text-yellow-600" />
                <span className="font-medium">Edit Bot</span>
              </Link>

              <Link
                to={`/bot/${bot._id}/analytics`}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-yellow-50/50 transition"
              >
                <BarChart3 size={18} className="text-blue-600" />
                <span className="font-medium">Analytics</span>
              </Link>

              <div className="border-t border-gray-200/40 my-1" />

              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/50 transition"
              >
                <Trash2 size={18} />
                <span className="font-medium">Delete</span>
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* EMBED MODAL - IMPROVED */}
      {isEmbedOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setIsEmbedOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200/60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-5 flex justify-between items-center">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Code size={18} />
                  Embed Code
                </h2>
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="text-gray-800 hover:text-gray-900 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-600">
                  Copy this code and paste it into your website:
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-gray-800">
                  <code>{`<script>
  window.LinguaBotConfig = {
    publicKey: "${bot.publicKey}"
  };
</script>
<script src="...widget.js"><\/script>`}</code>
                </div>
              </div>

              <div className="border-t border-gray-200/40 p-4 flex gap-3 bg-gray-50/40">
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-lg font-semibold transition"
                >
                  Close
                </button>

                <button
                  onClick={handleCopyEmbed}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition ${
                    embedCopied
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                  }`}
                >
                  {embedCopied ? "✓ Copied!" : "Copy Code"}
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
        message={`Are you sure you want to delete "${bot.name}"? This action cannot be undone.`}
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