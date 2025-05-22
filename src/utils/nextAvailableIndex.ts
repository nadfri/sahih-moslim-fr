import { ItemType, VariantType } from "../types/types";

// Get the next available index for chapters (never 999)
export function nextAvailableIndex(
  items: ItemType[],
  variant: VariantType
): number | undefined {
  if (variant !== "chapters") return undefined;
  // Exclude the "Unknown" chapter (index 999)
  const filtered = items.filter((chapter) => chapter.index !== 999);
  if (filtered.length === 0) return 1;
  return Math.max(...filtered.map((chapter) => chapter.index ?? 0)) + 1;
}
