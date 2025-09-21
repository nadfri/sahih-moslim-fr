"use client";

import { dataOptions } from "./dataOptions";
import { toast } from "react-toastify";

export function ImportSection() {
  const handleFileChange = (file: File | undefined, endpoint: string) => {
    if (!file) return;

    const reader = new FileReader();
    // We create a temporary reader here; the parent component will handle parsing
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        // Basic validation: ensure something parsed
        if (!json) throw new Error("Fichier vide");
        toast.success(`Fichier prêt pour import (${endpoint})`);
        // Dispatch a custom event so parent can pick up the file if needed
        const evt = new CustomEvent("admin:import-file", {
          detail: { file, endpoint },
        });
        window.dispatchEvent(evt);
      } catch (err) {
        // ...log and notify user on invalid JSON
        // English comment per project conventions
        console.error("Error reading import file:", err);
        toast.error("Fichier JSON invalide");
      }
    };
    reader.readAsText(file);
  };

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
                <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/30">
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
                  const inputEl = e.currentTarget as HTMLInputElement;
                  const file = inputEl.files?.[0];
                  handleFileChange(file, option.import!.endpoint);
                  inputEl.value = "";
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
