"use client";

import { ChevronDown } from "lucide-react";

type SelectProps = {
  id: string;
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  name?: string;
  required?: boolean;
};

export function Select({
  id,
  label,
  options,
  value,
  onChange,
  error = false,
  errorMessage,
  name,
  required,
}: SelectProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          required={required}
          className={`w-full p-2 border rounded-md appearance-none pe-10 cursor-pointer ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-950/30 focus:border-red-500"
              : "border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus-within:border-emerald-600"
          } focus:outline-none`}
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
