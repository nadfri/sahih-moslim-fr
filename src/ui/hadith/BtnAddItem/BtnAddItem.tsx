import { Plus } from "lucide-react";

export function BtnAddItem({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label="Ajouter un élément"
      onClick={onOpen}
      className="bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-md flex items-center justify-center h-[42px] aspect-square"
    >
      <Plus />
    </button>
  );
}
