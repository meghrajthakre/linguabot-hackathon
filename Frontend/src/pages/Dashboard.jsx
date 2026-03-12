import React, { useEffect, useState } from "react";
import { Plus, Zap, Globe, BarChart3, Sparkles } from "lucide-react";
import BotCard from "../components/BotCard";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBots = async () => {
    try {
      const res = await api.get("/bots");
      setBots(res.data);
    } catch (error) {
      console.error("Error fetching bots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bots/${id}`);
      setBots((prev) => prev.filter((bot) => bot._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const uniqueLanguages = [...new Set(bots.map((b) => b.language))].length;
  const activeBots = bots.filter((b) => b.status === "active").length;

  return (
    <div className="min-h-screen ">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-[#e8e0d0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Learn Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Sparkles size={18} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  New to AI Bots?
                </h3>
                <p className="text-sm text-gray-600">
                  Learn how to create, train and deploy your assistant in minutes.
                </p>
              </div>
            </div>

            <Link
              to="/how-to-make-bot"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-yellow-700 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-100 transition"
            >
              View Guide →
            </Link>
          </div>

          {/* Title + Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                Your Bots
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage, monitor and optimize your AI assistants
              </p>
            </div>

            <button
              onClick={() => navigate("/create-bot")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus size={18} />
              Create Bot
            </button>
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Stats Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard icon={BarChart3} label="Total Bots" value={bots.length} />
          <StatCard icon={Globe} label="Languages" value={uniqueLanguages} />
          <StatCard icon={Zap} label="Active Bots" value={activeBots} />
        </div>

        {/* Bots Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">My Bots</h2>

          {loading ? (
            <LoadingSkeletons />
          ) : bots.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bots.map((bot) => (
                <div
                  key={bot._id}
                  className="hover:scale-[1.02] transition-transform duration-200"
                >
                  <BotCard bot={bot} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl bg-white border border-[#e8e0d0] p-6 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>

      <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
        <Icon size={22} className="text-yellow-600" />
      </div>
    </div>
  </div>
);

/* ================= EMPTY STATE ================= */
const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white border border-[#e8e0d0] p-10 text-center shadow-sm">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-xl flex items-center justify-center">
          <Sparkles size={28} className="text-yellow-600" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            No bots created yet
          </h3>
          <p className="text-gray-600 mt-2">
            Start building your AI assistant to automate conversations and grow your business.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => navigate("/create-bot")}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
          >
            Create Your First Bot
          </button>
          <Link
            to="/how-to-make-bot"
            className="px-6 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg transition"
          >
            Read Documentation
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ================= LOADING SKELETON ================= */
const LoadingSkeletons = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl border border-[#e8e0d0] p-6 shadow-sm"
      >
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-5/6 bg-gray-100 rounded" />
          <div className="h-8 w-full bg-gray-100 rounded mt-4" />
        </div>
      </div>
    ))}
  </div>
);

export default Dashboard;