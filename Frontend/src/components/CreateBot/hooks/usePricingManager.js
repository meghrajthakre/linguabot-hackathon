import { useState, useCallback } from "react";

/**
 * Hook for managing Pricing state
 */
export const usePricingManager = () => {
  const [pricing, setPricing] = useState([]);

  const addPricing = useCallback(() => {
    setPricing((prev) => [...prev, { plan: "", price: "", features: "" }]);
  }, []);

  const updatePricing = useCallback((index, field, value) => {
    setPricing((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removePricing = useCallback((index) => {
    setPricing((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const cleanPricing = useCallback(() => {
    return pricing
      .filter(
        (p) =>
          (p.plan || "").trim() ||
          (p.price || "").trim() ||
          (p.features || "").trim()
      )
      .map((p) => ({
        plan: (p.plan || "").trim(),
        price: (p.price || "").trim(),
        features: (p.features || "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      }));
  }, [pricing]);

  return { pricing, addPricing, updatePricing, removePricing, cleanPricing };
};