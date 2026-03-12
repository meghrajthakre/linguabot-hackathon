import React from "react";
import { Trash2 } from "lucide-react";
import { INPUT_CLASSES, VALIDATION_RULES } from "../../../constants";

/**
 * FAQ Item Component
 */
export const FaqItem = ({ faq, index, onUpdate, onRemove }) => (
  <div className="bg-white rounded-xl p-3 border border-[#e8e0d0] space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-yellow-500 w-4">Q</span>
      <input
        value={faq.question}
        onChange={(e) => onUpdate(index, "question", e.target.value)}
        placeholder="What is your return policy?"
        maxLength={VALIDATION_RULES.faqQuestion.maxLength}
        className={`${INPUT_CLASSES.base} flex-1`}
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-1.5 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-50"
        aria-label="Remove FAQ"
      >
        <Trash2 size={14} />
      </button>
    </div>
    <div className="flex items-start gap-2">
      <span className="text-xs font-bold text-gray-400 w-4 mt-2.5">A</span>
      <textarea
        value={faq.answer}
        onChange={(e) => onUpdate(index, "answer", e.target.value)}
        placeholder="We accept returns within 30 days..."
        rows={2}
        maxLength={VALIDATION_RULES.faqAnswer.maxLength}
        className={`${INPUT_CLASSES.base} ${INPUT_CLASSES.textarea} flex-1`}
      />
    </div>
  </div>
);