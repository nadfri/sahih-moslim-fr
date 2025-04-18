"use client";

import { ChevronDown } from "lucide-react";

type SelectProps = {
  id: string;
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
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
  className = "",
  error = false,
  errorMessage,
  name,
  required,
}: SelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
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
          className={`w-full p-2 border rounded-md appearance-none pr-10 cursor-pointer ${
            error
              ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } focus:ring-2 focus:outline-none ${className}`}
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
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
