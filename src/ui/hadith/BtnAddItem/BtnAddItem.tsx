import { Plus } from "lucide-react";

import { VariantType } from "@/src/types/types"; // Importer VariantType

// Ajouter la prop variant au type des props et au composant
export function BtnAddItem({
  onOpen,
  variant,
}: {
  onOpen: () => void;
  variant: VariantType;
}) {
  // Improved aria-label for better accessibility
  const ariaLabelText = `Ajouter ${
    variant === "chapters"
      ? "un chapitre"
      : variant === "narrators"
        ? "un narrateur"
        : variant === "sahabas"
          ? "un compagnon"
          : "un élément" // Fallback, though VariantType should cover known types
  }`;

  return (
    <button
      type="button"
      aria-label={ariaLabelText} // Utiliser le label aria amélioré
      onClick={onOpen}
      className="bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors rounded-md h-[42px] w-[42px] flex items-center justify-center"
    >
      <Plus />
    </button>
  );
}
