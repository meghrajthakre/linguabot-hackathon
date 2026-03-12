import React, { useState } from "react";

const TrainingPanel = () => {
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["faq", "pricing", "docs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition
              ${activeTab === tab
                ? "bg-yellow-400 text-white shadow"
                : "bg-gray-100 text-gray-600"}
            `}
          >
            {tab === "faq" && "FAQs"}
            {tab === "pricing" && "Pricing"}
            {tab === "docs" && "Docs"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          <input
            placeholder="Question"
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
          <textarea
            placeholder="Answer"
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
          <button className="bg-yellow-400 px-4 py-2 rounded-xl text-white">
            + Add FAQ
          </button>
        </div>
      )}

      {activeTab === "pricing" && (
        <div className="space-y-4">
          <input
            placeholder="Plan Name"
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
          <input
            placeholder="Price"
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
          <input
            placeholder="Features (comma separated)"
            className="w-full p-3 border rounded-xl bg-gray-50"
          />
          <button className="bg-yellow-400 px-4 py-2 rounded-xl text-white">
            + Add Plan
          </button>
        </div>
      )}

      {activeTab === "docs" && (
        <textarea
          placeholder="Paste documentation or policies here..."
          className="w-full h-40 p-3 border rounded-xl bg-gray-50"
        />
      )}
    </div>
  );
};

export default TrainingPanel;