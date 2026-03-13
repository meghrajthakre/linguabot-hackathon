import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Globe, Edit3, BarChart3, Trash2, Code, Sparkles, Zap } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { BotWebsiteManager } from "../components/BotWebsiteManager";
import ConfirmationModal from "../components/ConfirmationModal";
import { URL } from "../constants/baseUrl";

/**
 * BotDetailsPage Component - LinguaBot Theme
 * Yellow (#FCD34D) primary, modern design
 */
export const BotDetailsPage = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBot = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/bots/${botId}`);
        setBot(response.data);
      } catch (error) {
        console.error("Error fetching bot:", error);
        toast.error("Failed to load bot details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [botId, navigate]);

  const handleWebsitesChange = async () => {
    try {
      const response = await api.get(`/bots/${botId}`);
      setBot(response.data);
    } catch (error) {
      console.error("Error refreshing bot:", error);
    }
  };

  const handleDeleteBot = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/bots/${botId}`);
      toast.success("Bot deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting bot:", error);
      toast.error("Failed to delete bot");
    } finally {
      setIsDeleting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-200 border-t-yellow-400 mx-auto mb-6" />
          <p className="text-gray-600 font-medium">Loading bot details...</p>
        </div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4 text-lg">Bot not found</p>
          <Link to="/dashboard" className="text-yellow-600 hover:text-yellow-700 font-semibold">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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

  const getLanguageColor = (lang) =>
    LANGUAGE_COLORS[lang?.toLowerCase()] || "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-xl transition duration-200"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>

              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {bot.name.charAt(0)}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
                <p className="text-sm text-gray-500 mt-1">{bot.description}</p>
              </div>
            </div>

            {/* RIGHT - ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <Link
                to={`/bot/${bot._id}/edit`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-yellow-300 hover:bg-yellow-50 transition text-gray-700 font-medium"
              >
                <Edit3 size={16} />
                Edit
              </Link>

              <Link
                to={`/bot/${bot._id}/analytics`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-yellow-300 hover:bg-yellow-50 transition text-gray-700 font-medium"
              >
                <BarChart3 size={16} />
                Analytics
              </Link>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition text-red-600 font-medium"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* BOT INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LANGUAGE CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition p-6 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Language</p>
              <Sparkles size={18} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className={`inline-block px-4 py-3 rounded-xl font-semibold text-lg ${getLanguageColor(bot.language)}`}>
              🌍 {bot.language || "English"}
            </div>
          </div>

          {/* WEBSITES COUNT CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition p-6 group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Websites</p>
              <Zap size={18} className="text-yellow-500 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="flex items-end gap-3">
              <Globe size={24} className="text-yellow-500" />
              <span className="text-4xl font-bold text-gray-900">
                {bot.websiteSources?.length || 0}
              </span>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition p-6 group">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Status</p>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-bold text-lg text-gray-900">Active</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">Ready to chat</p>
          </div>
        </div>

        {/* WEBSITE MANAGER */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition">
          <BotWebsiteManager
            botId={bot._id}
            initialWebsites={bot.websiteSources || []}
            onWebsitesChange={handleWebsitesChange}
          />
        </div>

        {/* EMBED CODE SECTION */}
        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl border border-yellow-200 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Code size={24} className="text-yellow-600" />
                </div>
                Embed Your Bot
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Add your bot to any website using this embed code
              </p>
            </div>

            <button
              onClick={() => setIsEmbedOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg hover:shadow-xl"
            >
              View Code
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-6 rounded-2xl font-mono text-sm overflow-x-auto border border-gray-700">
            {`<script>
  window.LinguaBotConfig = {
    publicKey: "${bot.publicKey}"
  };
</script>
<script src="${URL}/widget.js"><\/script>`}
          </div>

          <button
            onClick={handleCopyEmbed}
            className={`w-full py-4 rounded-xl font-bold transition duration-200 transform hover:scale-105 ${
              embedCopied
                ? "bg-green-500 text-white shadow-lg"
                : "bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-md hover:shadow-lg"
            }`}
          >
            {embedCopied ? "✓ Copied to Clipboard" : "📋 Copy Embed Code"}
          </button>
        </div>

        {/* BOT STATS */}
        {bot.faqs?.length > 0 || bot.pricing?.length > 0 || bot.docs ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles size={28} className="text-yellow-500" />
              Knowledge Base
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bot.faqs?.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6 hover:shadow-lg transition">
                  <p className="text-sm font-bold text-blue-900 uppercase">FAQs</p>
                  <p className="text-5xl font-bold text-blue-600 mt-4">{bot.faqs.length}</p>
                  <p className="text-xs text-blue-700 mt-2">questions answered</p>
                </div>
              )}

              {bot.pricing?.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6 hover:shadow-lg transition">
                  <p className="text-sm font-bold text-green-900 uppercase">Pricing Plans</p>
                  <p className="text-5xl font-bold text-green-600 mt-4">{bot.pricing.length}</p>
                  <p className="text-xs text-green-700 mt-2">plans configured</p>
                </div>
              )}

              {bot.docs && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 p-6 hover:shadow-lg transition">
                  <p className="text-sm font-bold text-purple-900 uppercase">Documentation</p>
                  <p className="text-5xl font-bold text-purple-600 mt-4">✓</p>
                  <p className="text-xs text-purple-700 mt-2">docs added</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* EMBED MODAL */}
      {isEmbedOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setIsEmbedOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 transform transition"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Embed Code</h2>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-48">
              {`<script>
  window.LinguaBotConfig = {
    publicKey: "${bot.publicKey}"
  };
</script>
<script src="${URL}/widget.js"><\/script>`}
            </div>

            <button
              onClick={handleCopyEmbed}
              className={`w-full py-3 rounded-xl font-bold transition ${
                embedCopied
                  ? "bg-green-500 text-white"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              }`}
            >
              {embedCopied ? "✓ Copied" : "Copy Code"}
            </button>

            <button
              onClick={() => setIsEmbedOpen(false)}
              className="w-full py-3 bg-gray-100 text-gray-900 font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Bot"
        message={`Are you sure you want to delete "${bot.name}"? This action cannot be undone.`}
        type="danger"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleDeleteBot}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BotDetailsPage;