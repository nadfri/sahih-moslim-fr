"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type MdTextAreaProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  label: string;
  control: Control<T>;
  error?: boolean;
  errorMessage?: string;
  height?: number;
  placeholder?: string;
  onValueChange?: (value: string) => string;
};

export function MdTextArea<T extends FieldValues>({
  id,
  name,
  label,
  control,
  error = false,
  errorMessage,
  height = 200,
  placeholder,
  onValueChange,
}: MdTextAreaProps<T>) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div
        className={`rounded-md overflow-hidden transition-all duration-200 ${
          error
            ? "ring-2 ring-red-500"
            : isFocused
              ? "ring-2 ring-blue-500"
              : "ring-1 ring-gray-300"
        }`}
      >
        <div
          data-color-mode="light"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <MDEditor
                value={field.value}
                onChange={(value) => {
                  const processedValue = onValueChange
                    ? onValueChange(value || "")
                    : value || "";
                  field.onChange(processedValue);
                }}
                preview="edit"
                height={height}
                textareaProps={{
                  placeholder,
                  onFocus: () => setIsFocused(true),
                  onBlur: () => setIsFocused(false),
                }}
              />
            )}
          />
        </div>
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
