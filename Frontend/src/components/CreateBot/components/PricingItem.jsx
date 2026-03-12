import React from "react";
import { Trash2 } from "lucide-react";
import { INPUT_CLASSES, VALIDATION_RULES } from "../../../constants";

/**
 * Pricing Item Component
 */
export const PricingItem = ({ pricing, index, onUpdate, onRemove }) => (
  <div className="bg-white rounded-2xl p-4 border border-[#e8e0d0] space-y-3 shadow-sm hover:shadow-md transition">
    <div className="flex gap-3 items-center">
      <div className="flex-1">
        <label className="text-[11px] text-gray-400 uppercase block mb-1">
          Plan Name
        </label>
        <input
          value={pricing.plan || ""}
          onChange={(e) => onUpdate(index, "plan", e.target.value)}
          placeholder="Pro"
          maxLength={VALIDATION_RULES.pricingPlan.maxLength}
          className={INPUT_CLASSES.base}
        />
      </div>

      <div className="w-32">
        <label className="text-[11px] text-gray-400 uppercase block mb-1">
          Price
        </label>
        <input
          value={pricing.price || ""}
          onChange={(e) => onUpdate(index, "price", e.target.value)}
          placeholder="$29/mo"
          maxLength={VALIDATION_RULES.pricingPrice.maxLength}
          className={INPUT_CLASSES.base}
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
        aria-label="Remove pricing plan"
      >
        <Trash2 size={16} />
      </button>
    </div>

    <div>
      <label className="text-[11px] text-gray-400 uppercase block mb-1">
        Features (comma separated)
      </label>
      <input
        value={pricing.features || ""}
        onChange={(e) => onUpdate(index, "features", e.target.value)}
        placeholder="Unlimited messages, Priority support, API access"
        maxLength={VALIDATION_RULES.pricingFeatures.maxLength}
        className={INPUT_CLASSES.base}
      />
      <p className="text-[11px] text-gray-400 mt-1">
        Separate features using commas.
      </p>
    </div>
  </div>
);