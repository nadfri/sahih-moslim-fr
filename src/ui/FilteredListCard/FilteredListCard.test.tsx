import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FilteredListCard } from "./FilteredListCard";

// Mock data for testing
const items = [
  { id: "1", name: "Item 1", slug: "item-1" },
  { id: "2", name: "Item 2", slug: "item-2" },
  { id: "3", name: "Item 3", slug: "item-3" },
];

describe("FilteredListCard", () => {
  it("renders all items initially", () => {
    render(
      <FilteredListCard
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
    render(
      <FilteredListCard
        items={items}
        variant="chapters"
      />
    );
    const user = userEvent.setup();
    // Type "Item 2" into the search input
    const input = screen.getByPlaceholderText("Rechercher un chapitre...");
    await user.click(input);
    await user.type(input, "Item 2");

    // There should be only one Card with 'Item 2' (the filtered result)
    const cards = screen.getAllByText("Item 2");
    // One in the Card, one in the dropdown, so check at least one Card is present
    expect(cards.length).toBeGreaterThanOrEqual(1);
    // The Card for 'Item 2' should be visible, the others not
    expect(screen.getByText("Item 2", { selector: "h2" })).toBeInTheDocument();
    expect(
      screen.queryByText("Item 1", { selector: "h2" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Item 3", { selector: "h2" })
    ).not.toBeInTheDocument();
  });

  it("filters items when an option is selected from dropdown", async () => {
    render(
      <FilteredListCard
        items={items}
        variant="chapters"
      />
    );
    const user = userEvent.setup();
    // Type "Item 2" into the search input
    const input = screen.getByPlaceholderText("Rechercher un chapitre...");
    await user.click(input);
    await user.type(input, "Item 2");
    // Simulate selecting the option from the dropdown
    const option = await screen.findByRole("option", { name: "Item 2" });
    await user.click(option);
    // Only the Card for 'Item 2' should be visible
    expect(screen.getByText("Item 2", { selector: "h2" })).toBeInTheDocument();
    expect(
      screen.queryByText("Item 1", { selector: "h2" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Item 3", { selector: "h2" })
    ).not.toBeInTheDocument();
  });
});
