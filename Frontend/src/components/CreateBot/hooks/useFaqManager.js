import { useState, useCallback } from "react";

/**
 * Hook for managing FAQ state
 */
export const useFaqManager = () => {
  const [faqs, setFaqs] = useState([]);

  const addFaq = useCallback(() => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }, []);

  const updateFaq = useCallback((index, field, value) => {
    setFaqs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removeFaq = useCallback((index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const cleanFaqs = useCallback(() => {
    return faqs
      .filter((f) => f.question.trim() && f.answer.trim())
      .map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      }));
  }, [faqs]);

  return { faqs, addFaq, updateFaq, removeFaq, cleanFaqs };
};