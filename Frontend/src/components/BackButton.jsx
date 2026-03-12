import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        group flex items-center gap-2
        px-4 py-2 rounded-xl
        bg-white/60 backdrop-blur-md
        border border-white/40
        shadow-sm hover:shadow-md
        text-sm font-medium text-gray-700
        transition-all duration-200
        hover:bg-yellow-400/20 cursor-pointer
        active:scale-95
      "
    >
      <ArrowLeft
        size={16}
        className="transition-transform duration-200 group-hover:-translate-x-1"
      />
      {label}
    </button>
  );
};

export default BackButton;