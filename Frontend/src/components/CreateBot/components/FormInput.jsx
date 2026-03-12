import React from "react";
import { ChevronDown } from "lucide-react";
import { INPUT_CLASSES } from "../../../constants";

/**
 * FormInput component - handles text, textarea, and select
 */
export const FormInput = ({
  type = "text",
  label,
  name,
  required = false,
  error,
  value,
  onChange,
  placeholder,
  rows,
  options,
  maxLength,
  showCharCount = false,
  ...props
}) => {
  const handleChange = (e) => {
    const { value } = e.target;

    if (maxLength && value.length > maxLength) {
      return;
    }

    onChange({ target: { name, value } });
  };

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
        {label}
        {required && <span className="text-yellow-500 ml-1">*</span>}
      </label>

      {type === "select" ? (
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={handleChange}
            className={`${INPUT_CLASSES.base} ${INPUT_CLASSES.select}`}
            {...props}
          >
            <option value="">Select {label}</option>
            {options?.map((opt) => (
              <option key={opt.code || opt.value} value={opt.code || opt.value}>
                {opt.flag && `${opt.flag} `}
                {opt.label || opt.name}
                {opt.speakers && ` (${opt.speakers})`}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      ) : type === "textarea" ? (
        <div>
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows || 3}
            maxLength={maxLength}
            className={`${INPUT_CLASSES.base} ${INPUT_CLASSES.textarea}`}
            {...props}
          />
          {showCharCount && maxLength && (
            <p className="text-xs text-gray-400 mt-1">
              {value.length} / {maxLength}
            </p>
          )}
        </div>
      ) : (
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            className={INPUT_CLASSES.base}
            {...props}
          />
          {showCharCount && maxLength && (
            <p className="text-xs text-gray-400 mt-1">
              {value.length} / {maxLength}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};