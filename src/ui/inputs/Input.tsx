"use client";

import React from "react";

type InputProps = {
  id: string;
  label: string;
  type?: "text" | "number" | "email" | "password" | "textarea";
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: React.FocusEventHandler;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  required?: boolean;
  min?: number;
  max?: number;
  rows?: number;
  dir?: "ltr" | "rtl";
  register?: unknown; // For react-hook-form
  helperText?: string;
  readOnly?: boolean;
};

export function Input({
  id,
  label,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  error = false,
  errorMessage,
  className = "",
  required,
  min,
  max,
  rows = 3,
  dir = "ltr",
  register,
  helperText,
  readOnly,
}: InputProps) {
  const inputClasses = `w-full p-2 border rounded-md ${
    error
      ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-emerald-600 focus:ring-emerald-600 bg-white"
  } focus:ring-1 focus:outline-none ${className}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          dir={dir}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          required={required}
          {...(register || {})}
          readOnly={readOnly}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          max={max}
          required={required}
          dir={dir}
          {...(register || {})}
          readOnly={readOnly}
        />
      )}

      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
