import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Edit3, BarChart3, Trash2, ArrowRight, MoreVertical,
  Shield, Zap, Code, Globe, Calendar, Copy, Check, X, Crown, Bot, Sparkles, Eye,
  CheckCircle,
  CopyCheck
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import { URL } from "../../../backend/utils/constants";

const BotCard = ({ bot, onDelete, isPro = false, onTrainViaUrl }) => {
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const menuRef = useRef(null);

  const handleProFeature = () => {
    console.log("Pro feature clicked");
  };

  // Handle click outside for menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Utility functions
  const getTypeIcon = (type) => {
    const icons = {
      ecommerce: "🛒",
      saas: "🚀",
      service: "🛠️",
      default: "🤖"
    };
    return icons[type] || icons.default;
  };

  const getTypeColor = (type) => {
    const colors = {
      ecommerce: "bg-purple-100 text-purple-600 border-purple-200",
      saas: "bg-blue-100 text-blue-600 border-blue-200",
      service: "bg-green-100 text-green-600 border-green-200",
      default: "bg-yellow-100 text-yellow-600 border-yellow-200"
    };
    return colors[type] || colors.default;
  };

  // Embed functionality
  const generateEmbedCode = () => {
    return `<script>
  window.LinguaBotConfig = {
    publicKey: "${bot.publicKey}"
  };
</script>
<script src="${URL}/widget.js"></script>`;
  };

  const copyEmbedCode = () => {
    const embedCode = generateEmbedCode();
    navigator.clipboard.writeText(embedCode);

    setEmbedCopied(true);

    toast.custom((t) => (
      <div className={`flex items-center gap-3 px-5 py-4 
  bg-gray-900 text-white rounded-2xl 
  border border-green-500/30 shadow-2xl
  transition-all duration-300 ${t.visible ? "animate-in slide-in-from-top-2" : "animate-out"
        }`}>

        <div className="bg-green-500/20 p-2 rounded-xl">
          <CopyCheck size={18} className="text-green-400" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold">
            Embed Code Copied
          </span>

          <span className="text-xs text-gray-400">
            Script copied to clipboard successfully
          </span>
        </div>

        <CheckCircle size={18} className="text-green-500 ml-2" />

      </div>));

    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const handleCopyConfirm = () => {
    copyEmbedCode();
    setIsEmbedModalOpen(false);
  };

  // Delete functionality
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(bot._id);
      setIsDeleteModalOpen(false);

      toast.success("Bot deleted successfully", {
        icon: '🗑️',
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333'
        }
      });
    } catch (err) {
      toast.error("Failed to delete bot. Please try again.", {
        icon: '❌',
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333'
        }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTrainClick = () => {
    if (isPro) {
      onTrainViaUrl(bot._id);
    } else {

      toast.custom((t) => (
        <div className={`flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl border border-gray-700 shadow-xl transition-all ${t.visible ? "animate-enter" : "animate-leave"
          }`}>

          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <Crown className="text-yellow-400" size={18} />
          </div>

          <div>
            <p className="font-semibold text-sm">
              Pro Feature
            </p>
            <p className="text-xs text-gray-400">
              Training via URL is coming soon...
            </p>
          </div>

        </div>
      ));

    }
  }

  return (
    <>
      <div className="group relative flex flex-col h-full bg-white rounded-2xl border-2 border-gray-100 hover:border-yellow-500 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${bot.isActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                aria-hidden="true"
              />
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {bot.isActive ? "Active" : "Draft"}
              </span>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${getTypeColor(bot.businessType)}`}>
              {bot.businessType || "General"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bot.allowedDomains?.length > 0 && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                <Shield size={12} className="text-blue-600" />
                <span className="text-[10px] font-bold text-blue-600">Secured</span>
              </div>
            )}
            <div className="bg-gray-100 px-2 py-1 rounded-full">
              <span className="text-[10px] font-mono font-bold text-gray-600">
                {bot.publicKey?.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Header with Icon and Actions */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTypeColor(bot.businessType)} flex items-center justify-center text-2xl border-2 border-white shadow-lg`}>
                {getTypeIcon(bot.businessType)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1">
                  {bot.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Bot size={14} className="text-yellow-500" />
                  <p className="text-xs font-medium text-gray-500">
                    {bot.industry || "General Assistant"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl transition-all ${isMenuOpen
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'hover:bg-yellow-50 text-gray-400 hover:text-yellow-600'
                  }`}
                aria-label="Bot actions"
                aria-expanded={isMenuOpen}
              >
                <MoreVertical size={18} />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 z-30 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  role="menu"
                >
                  <Link
                    to={`/bot/${bot._id}/edit`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    <Edit3 size={16} className="text-yellow-500" /> Edit Settings
                  </Link>

                  <Link
                    to={`/bot/${bot._id}/analytics`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    <BarChart3 size={16} className="text-blue-500" /> View Analytics
                  </Link>

                  <Link
                    to={`/bot/${bot._id}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    <Eye size={16} className="text-purple-500" /> Preview Bot
                  </Link>

                  <div className="h-px bg-gray-100 my-1" />

                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <Trash2 size={16} /> Delete Bot
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 flex-1 line-clamp-2 leading-relaxed mb-4">
            {bot.description || (
              <span className="text-gray-400 italic">
                ✨ Add a description to help users understand your bot's purpose.
              </span>
            )}
          </p>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-xs font-medium text-gray-700">
              <Globe size={14} className="text-yellow-500" />
              <span className="truncate capitalize font-semibold">
                {bot.language || "English"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 text-xs font-medium text-gray-700">
              <Calendar size={14} className="text-blue-500" />
              <span className="font-semibold">
                {new Date(bot.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleTrainClick}
              className={`flex-[1] flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${isPro
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-100 transform hover:-translate-y-0.5"
                : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
            >
              {isPro ? (
                <>
                  <Zap size={16} fill="" />
                  <span className="text-yellow-500 group-hover:text-white transition-colors duration-300">
                    TRAIN VIA URL
                  </span>
                </>
              ) : (
                <>
                  <Crown size={16} className="text-yellow-500  group-hover:text-yellow-500 transition-colors duration-300" />
                  <span className="group-hover:text-yellow-500 transition-colors duration-300">
                    PRO FEATURE
                  </span>
                </>
              )}
            </button>

            {/* Embed Code Button */}
            <button
              onClick={() => setIsEmbedModalOpen(true)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs text-black font-bold  transition-all duration-300 transform active:scale-95
               
                   bg-yellow-500  -translate-y-0.5 hover:bg-yellow-300
                 
              `}
            >
              <Code size={15} className="flex-shrink-0" />
              <span>GET EMBED</span>
            </button>
          </div>
        </div>

        {/* Footer CTA */}
        <Link
          to={`/bot/${bot._id}`}
          className="group/manage py-4 bg-gray-900 text-white text-xs font-black uppercase  text-center hover:bg-yellow-500 transition-all flex justify-center items-center gap-3"
        >
          <span>Open Chat Bot</span>
          <ArrowRight size={16} className="group-hover/manage:translate-x-2 transition-transform" />
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Bot"
        message={
          <div>
            <p className="mb-2">Are you absolutely sure you want to delete <span className="font-bold text-red-600">"{bot.name}"</span>?</p>
            <p className="text-sm text-red-500">This action cannot be undone and will permanently remove:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>All training data and configurations</li>
              <li>Analytics and conversation history</li>
              <li>Custom settings and integrations</li>
            </ul>
          </div>
        }
        type="danger"
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />

      {/* Embed Code Confirmation Modal */}
      <ConfirmationModal
        isOpen={isEmbedModalOpen}
        title="Copy Embed Code"
        message={
          <div>
            <p>Copy the embed script for <span className="font-bold text-yellow-600">"{bot.name}"</span>?</p>
            <div className="mt-4 p-3 bg-gray-900 rounded-xl">
              <pre className="text-xs text-yellow-300 font-mono overflow-x-auto">
                {`<script>
  window.LinguaBotConfig = {
    publicKey: "${bot.publicKey?.slice(0, 15)}..."
  };
</script>`}
              </pre>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              The complete script will be copied to your clipboard.
            </p>
          </div>
        }
        type="warning"
        confirmText={embedCopied ? "Copied!" : "Yes, Copy Code"}
        cancelText="Close"
        onConfirm={handleCopyConfirm}
        onCancel={() => setIsEmbedModalOpen(false)}
        isLoading={false}
      />
    </>
  );
};

export default BotCard;