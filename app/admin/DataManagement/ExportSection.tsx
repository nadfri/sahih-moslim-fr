"use client";

import React from "react";

type DataOption = {
  key: string;
  label: string;
  icon: React.ComponentType<Record<string, unknown>>;
  export?: { endpoint: string; filename: string; color?: string };
};

type Props = {
  dataOptions: DataOption[];
  handleExport: (endpoint: string, filename: string) => void;
};

// ExportSection renders export buttons for each data type.
export function ExportSection({ dataOptions, handleExport }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
          Exporter en JSON
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {dataOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={`${option.key}-export`}
              type="button"
              aria-label={`Exporter ${option.label}`}
              onClick={() =>
                handleExport(option.export!.endpoint, option.export!.filename)
              }
              className="group flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/30">
                  <Icon className={`w-5 h-5 ${option.export?.color || ""}`} />
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="text-sm font-medium">Télécharger</span>
                <svg className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
