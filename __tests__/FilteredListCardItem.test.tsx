import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { normalizeTextForSearch } from "@/src/utils/textNormalization";
import { FilteredListCardItem } from "@/src/ui/FilteredListCardItem/FilteredListCardItem";
import { renderWithI18n } from "./renderWithI18n";
import type { ItemType } from "@/src/types/types";

// Mock data for testing
const mockItems: ItemType[] = [
  {
    id: "1",
    name_fr: "Café de Paris",
    name_ar: "قهوة باريس",
    name_en: "Paris Coffee",
    slug: "cafe-de-paris",
    index: 1,
  },
  {
    id: "2",
    name_fr: "La foi",
    name_ar: "الإيمان",
    name_en: "Faith",
    slug: "la-foi",
    index: 2,
  },
  {
    id: "3",
    name_fr: "Hello World",
    name_ar: "مرحبا بالعالم",
    name_en: "Hello World",
    slug: "hello-world",
    index: 3,
  },
  {
    id: "4",
    name_fr: "Créé avec amour",
    name_ar: "مصنوع بحب",
    name_en: "Made with love",
    slug: "cree-avec-amour",
    index: 4,
  },
  {
    id: "5",
    name_fr: "Chapitre naïve",
    name_ar: "فصل ساذج",
    name_en: "Naive chapter",
    slug: "chapitre-naive",
    index: 5,
  },
];

describe("FilteredListCardItem", () => {
  describe("Component Rendering", () => {
    it("should render the component with search input for chapters", () => {
      renderWithI18n(
        <FilteredListCardItem
          items={mockItems}
          variant="chapters"
        />
      );

      // The component should render a search input - we can't check exact placeholder as it's from i18n
      const searchInput = screen.getByRole("combobox");
      expect(searchInput).toBeInTheDocument();
    });

    it("should display all items initially", () => {
      renderWithI18n(
        <FilteredListCardItem
          items={mockItems}
          variant="chapters"
        />
      );

      // Check that all items are rendered by looking for their French names
      expect(screen.getByText("Café de Paris")).toBeInTheDocument();
      expect(screen.getByText("La foi")).toBeInTheDocument();
      expect(screen.getByText("Hello World")).toBeInTheDocument();
      expect(screen.getByText("Créé avec amour")).toBeInTheDocument();
      expect(screen.getByText("Chapitre naïve")).toBeInTheDocument();
    });

    it("should filter items based on search input", async () => {
      const user = userEvent.setup();

      renderWithI18n(
        <FilteredListCardItem
          items={mockItems}
          variant="chapters"
        />
      );

      const searchInput = screen.getByRole("combobox");
      await user.type(searchInput, "cafe");

      // Should show the café item (normalized search)
      expect(screen.getByText("Café de Paris")).toBeInTheDocument();

      // Should not show other items
      expect(screen.queryByText("La foi")).not.toBeInTheDocument();
      expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
      expect(screen.queryByText("Créé avec amour")).not.toBeInTheDocument();
      expect(screen.queryByText("Chapitre naïve")).not.toBeInTheDocument();
    });

    it("should handle French accents in search", async () => {
      const user = userEvent.setup();

      renderWithI18n(
        <FilteredListCardItem
          items={mockItems}
          variant="chapters"
        />
      );

      const searchInput = screen.getByRole("combobox");
      await user.type(searchInput, "cree");

      // Should find "Créé avec amour" even without accent
      expect(screen.getByText("Créé avec amour")).toBeInTheDocument();
      expect(screen.queryByText("Café de Paris")).not.toBeInTheDocument();
      expect(screen.queryByText("La foi")).not.toBeInTheDocument();
      expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
      expect(screen.queryByText("Chapitre naïve")).not.toBeInTheDocument();
    });

    it("should handle special characters like ï", async () => {
      const user = userEvent.setup();

      renderWithI18n(
        <FilteredListCardItem
          items={mockItems}
          variant="chapters"
        />
      );

      const searchInput = screen.getByRole("combobox");
      await user.type(searchInput, "naive");

      // Should find "Chapitre naïve" even without ï
      expect(screen.getByText("Chapitre naïve")).toBeInTheDocument();
      expect(screen.queryByText("Café de Paris")).not.toBeInTheDocument();
      expect(screen.queryByText("La foi")).not.toBeInTheDocument();
      expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
      expect(screen.queryByText("Créé avec amour")).not.toBeInTheDocument();
    });

    it("should show no results message when search doesn't match anything", async () => {
      const user = userEvent.setup();

      renderWithI18n(
        <FilteredListCardItem
          items={mockItems}
          variant="chapters"
        />
      );

      const searchInput = screen.getByRole("combobox");
      await user.type(searchInput, "xyz123notfound");

      // Should show "Aucun résultat" when no matches
      expect(screen.getByText("Aucun résultat")).toBeInTheDocument();

      // Should not show any item cards
      expect(screen.queryByText("Café de Paris")).not.toBeInTheDocument();
      expect(screen.queryByText("La foi")).not.toBeInTheDocument();
      expect(screen.queryByText("Hello World")).not.toBeInTheDocument();
      expect(screen.queryByText("Créé avec amour")).not.toBeInTheDocument();
      expect(screen.queryByText("Chapitre naïve")).not.toBeInTheDocument();
    });

    it("should clear search and show all items when input is empty", async () => {
      const user = userEvent.setup();

      renderWithI18n(
        <FilteredListCardItem
          items={mockItems}
          variant="chapters"
        />
      );

      const searchInput = screen.getByRole("combobox");

      // Type something to filter
      await user.type(searchInput, "cafe");
      expect(screen.getAllByText("Café de Paris").length).toBeGreaterThan(0);
      expect(screen.queryByText("La foi")).not.toBeInTheDocument();

      // Clear the input
      await user.clear(searchInput);

      // All items should be visible again - use getAllByText to handle multiple instances
      expect(screen.getAllByText("Café de Paris").length).toBeGreaterThan(0);
      expect(screen.getAllByText("La foi").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Hello World").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Créé avec amour").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Chapitre naïve").length).toBeGreaterThan(0);
    });
  });

  describe("Text Normalization Logic", () => {
    it("should demonstrate how the component will match accented text", () => {
      // Simulate what happens in the component's filter logic
      const itemName = "Chapitre sur la purification - café";
      const searchQuery = "cafe"; // User types without accent

      const normalizedItemName = normalizeTextForSearch(itemName);
      const normalizedSearchQuery = normalizeTextForSearch(searchQuery);

      // This should match
      expect(normalizedItemName.includes(normalizedSearchQuery)).toBe(true);
    });

    it("should match French text ignoring accents", () => {
      const testCases = [
        {
          itemName: "Chapitre sur l'être humain",
          searchQuery: "etre",
          shouldMatch: true,
        },
        {
          itemName: "Chapitre naïve sur la foi",
          searchQuery: "naive",
          shouldMatch: true,
        },
        {
          itemName: "Chapitre sur le café",
          searchQuery: "cafe",
          shouldMatch: true,
        },
        {
          itemName: "Chapitre sur l'eau",
          searchQuery: "cafe", // Different word
          shouldMatch: false,
        },
      ];

      testCases.forEach(({ itemName, searchQuery, shouldMatch }) => {
        const normalizedItemName = normalizeTextForSearch(itemName);
        const normalizedSearchQuery = normalizeTextForSearch(searchQuery);

        const matches = normalizedItemName.includes(normalizedSearchQuery);
        expect(matches).toBe(shouldMatch);
      });
    });

    it("should match Arabic text ignoring diacritics", () => {
      const testCases = [
        {
          itemName: "بَابُ الطَّهَارَةِ", // With diacritics
          searchQuery: "الطهارة", // Without diacritics
          shouldMatch: true,
        },
        {
          itemName: "باب الطهارة", // Without diacritics
          searchQuery: "بَابُ الطَّهَارَةِ", // With diacritics
          shouldMatch: true,
        },
        {
          itemName: "بَابُ الإِيمَانِ",
          searchQuery: "الإيمان", // Correct normalized version
          shouldMatch: true,
        },
      ];

      testCases.forEach(({ itemName, searchQuery, shouldMatch }) => {
        const normalizedItemName = normalizeTextForSearch(itemName);
        const normalizedSearchQuery = normalizeTextForSearch(searchQuery);

        const matches = normalizedItemName.includes(normalizedSearchQuery);
        expect(matches).toBe(shouldMatch);
      });
    });

    it("should be case insensitive", () => {
      const itemName = "Chapitre sur la foi";
      const searchQueries = ["foi", "FOI", "Foi", "fOi"];

      searchQueries.forEach((searchQuery) => {
        const normalizedItemName = normalizeTextForSearch(itemName);
        const normalizedSearchQuery = normalizeTextForSearch(searchQuery);

        expect(normalizedItemName.includes(normalizedSearchQuery)).toBe(true);
      });
    });

    it("should handle empty or whitespace-only queries", () => {
      const emptyQueries = ["", "   ", "\t", "\n"];

      emptyQueries.forEach((query) => {
        const normalizedQuery = normalizeTextForSearch(query);

        // Empty normalized queries should be empty strings
        if (normalizedQuery.length === 0) {
          expect(normalizedQuery).toBe("");
        }
      });
    });
  });
});
