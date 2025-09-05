import { describe, expect, it } from "vitest";

import type { ItemType } from "../src/types/types";
import { nextAvailableIndex } from "../src/utils/nextAvailableIndex";

describe("nextAvailableIndex", () => {
  it('should return 1 if items array is empty and variant is "chapters"', () => {
    const items: ItemType[] = [];
    expect(nextAvailableIndex(items, "chapters")).toBe(1);
  });

  it('should return 1 if items array only contains the "Unknown" chapter (index 999) and variant is "chapters"', () => {
    const items: ItemType[] = [
      { id: "unknown", index: 999, name_fr: "Unknown", slug: "unknown" },
    ];
    expect(nextAvailableIndex(items, "chapters")).toBe(1);
  });

  it("should return the next available index for chapters, excluding 999", () => {
    const items: ItemType[] = [
      { id: "1", index: 1, name_fr: "Chapter 1", slug: "chapter-1" },
      { id: "2", index: 2, name_fr: "Chapter 2", slug: "chapter-2" },
      { id: "unknown", index: 999, name_fr: "Unknown", slug: "unknown" },
      { id: "3", index: 5, name_fr: "Chapter 5", slug: "chapter-5" },
    ];
    expect(nextAvailableIndex(items, "chapters")).toBe(6);
  });

  it("should return next available index correctly when highest index is just before 999", () => {
    const items: ItemType[] = [
      { id: "1", index: 1, name_fr: "Chapter 1", slug: "chapter-1" },
      { id: "2", index: 998, name_fr: "Chapter 998", slug: "chapter-998" },
      { id: "unknown", index: 999, name_fr: "Unknown", slug: "unknown" },
    ];
    expect(nextAvailableIndex(items, "chapters")).toBe(999); // This is correct as 999 is excluded from being the *max*, but can be the *next*
  });

  it("should return 2 if items array contains only chapter with index 1", () => {
    const items: ItemType[] = [
      { id: "1", index: 1, name_fr: "Chapter 1", slug: "chapter-1" },
    ];
    expect(nextAvailableIndex(items, "chapters")).toBe(2);
  });

  it("should handle items with index 0 correctly", () => {
    const items: ItemType[] = [
      { id: "0", index: 0, name_fr: "Chapter 0", slug: "chapter-0" },
      { id: "1", index: 1, name_fr: "Chapter 1", slug: "chapter-1" },
    ];
    expect(nextAvailableIndex(items, "chapters")).toBe(2);
  });

  it("should handle items with missing index (treated as 0 by the function logic)", () => {
    // Simulating an item where index might be null/undefined from data source,
    // though ItemType expects number. The function uses `?? 0`.
    const items: ItemType[] = [
      {
        id: "no-index",
        name_fr: "No Index Chapter",
        slug: "no-index-chapter",
      } as unknown as ItemType, // Force type for test
      { id: "1", index: 1, name_fr: "Chapter 1", slug: "chapter-1" },
    ];
    // nextAvailableIndex uses `chapter.index ?? 0`, so 'no-index' becomes 0. Max of [0, 1] is 1. Next is 2.
    expect(nextAvailableIndex(items, "chapters")).toBe(2);
  });

  it("should return 1 if all items have index 999", () => {
    const items: ItemType[] = [
      { id: "unknown1", index: 999, name_fr: "Unknown 1", slug: "unknown-1" },
      { id: "unknown2", index: 999, name_fr: "Unknown 2", slug: "unknown-2" },
    ];
    expect(nextAvailableIndex(items, "chapters")).toBe(1);
  });
});
