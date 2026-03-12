import React, { useState } from "react";
import { createBot } from "../api/bot.api";

const CreateBotButton = ({ botData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await createBot(botData);

      if (res.success) {
        onSuccess && onSuccess(res.bot);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-xl font-bold shadow-sm hover:shadow-md transition disabled:opacity-60"
      >
        {loading ? "Creating..." : "🚀 Create Bot"}
      </button>

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default CreateBotButton;