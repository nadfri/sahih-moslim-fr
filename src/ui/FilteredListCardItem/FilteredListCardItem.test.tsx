import { screen } from "@testing-library/react";
import { renderWithI18n } from "@/__tests__/renderWithI18n";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FilteredListCardItem } from "./FilteredListCardItem";

// Mock data for testing
const items = [
  { id: "1", name_fr: "Item 1", name_ar: null, name_en: null, slug: "item-1" },
  { id: "2", name_fr: "Item 2", name_ar: null, name_en: null, slug: "item-2" },
  { id: "3", name_fr: "Item 3", name_ar: null, name_en: null, slug: "item-3" },
];

describe("FilteredListCardItem", () => {
  it("renders all items initially", () => {
    renderWithI18n(
      <FilteredListCardItem
        items={items}
        variant="chapters"
      />
    );
    // All items should be visible
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("filters items when search text is entered", async () => {
    renderWithI18n(
      <FilteredListCardItem
        items={items}
        variant="chapters"
      />
    );
    const user = userEvent.setup();
    // Type "Item 2" into the search input
    const input = screen.getByPlaceholderText("Rechercher un chapitre...");
    await user.type(input, "Item 2");

    // The Card for 'Item 2' should be visible, the others not
    expect(screen.getByText("Item 2", { selector: "h2" })).toBeInTheDocument();
    expect(
      screen.queryByText("Item 1", { selector: "h2" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Item 3", { selector: "h2" })
    ).not.toBeInTheDocument();
  });

  it("clears search and shows all items when input is cleared", async () => {
    renderWithI18n(
      <FilteredListCardItem
        items={items}
        variant="chapters"
      />
    );
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("Rechercher un chapitre...");

    // Type to filter
    await user.type(input, "Item 2");
    expect(screen.getByText("Item 2", { selector: "h2" })).toBeInTheDocument();
    expect(
      screen.queryByText("Item 1", { selector: "h2" })
    ).not.toBeInTheDocument();

    // Clear the input
    await user.clear(input);

    // All items should be visible again
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });
});
