"use client";

import React from "react";

type DataOption = {
  key: string;
  label: string;
  icon: React.ComponentType<Record<string, unknown>>;
  import?: { endpoint: string; color?: string };
};

type Props = {
  dataOptions: DataOption[];
  handleFileChange: (file: File | undefined, endpoint: string) => void;
};

export function ImportSection({ dataOptions, handleFileChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300">
          Importer depuis JSON
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {dataOptions.map((option) => {
          const Icon = option.icon;
          return (
            <label
              key={`${option.key}-import`}
              className="group flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-900/30">
                  <Icon className={`w-5 h-5 ${option.import?.color || ""}`} />
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <span className="text-sm font-medium">Importer</span>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const input = e.currentTarget as HTMLInputElement;
                  const file = input.files?.[0];
                  handleFileChange(file, option.import!.endpoint);
                  input.value = "";
                }}
                className="sr-only"
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
