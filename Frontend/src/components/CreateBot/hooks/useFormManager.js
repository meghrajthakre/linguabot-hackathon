import { useState, useCallback } from "react";
import { VALIDATION_RULES } from "../../../constants";

/**
 * Hook for managing form state with validation
 */
export const useFormManager = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "",
    docs: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Bot name is required";
    } else if (formData.name.length > VALIDATION_RULES.name.maxLength) {
      newErrors.name = `Bot name cannot exceed ${VALIDATION_RULES.name.maxLength} characters`;
    }

    if (!formData.language) {
      newErrors.language = "Language is required";
    }

    if (formData.description.length > VALIDATION_RULES.description.maxLength) {
      newErrors.description = `Description cannot exceed ${VALIDATION_RULES.description.maxLength} characters`;
    }

    if (formData.docs.length > VALIDATION_RULES.docs.maxLength) {
      newErrors.docs = `Documentation cannot exceed ${VALIDATION_RULES.docs.maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      language: "",
      docs: "",
    });
    setErrors({});
  }, []);

  return { formData, handleChange, validate, reset, errors };
};