import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ItemType } from "@/src/types/types";
import { FilteredCardsEdit } from "./FilteredCardsEdit";

// Mock dependencies
vi.mock("@/src/ui/inputs/Input/Input", () => ({
  Input: vi.fn(({ id, label, placeholder, value, onChange }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-testid="search-input"
      />
    </div>
  )),
}));

vi.mock("../CardEdit/CardEdit", () => ({
  CardEdit: vi.fn(({ item, variant }) => (
    <div data-testid={`card-edit-${item.id}`}>
      Card for {item.name_fr} - {variant}
    </div>
  )),
}));

const mockChapters: ItemType[] = [
  { id: "1", name_fr: "La Foi", slug: "la-foi", index: 1, hadithCount: 15 },
  {
    id: "2",
    name_fr: "La Purification",
    slug: "la-purification",
    index: 2,
    hadithCount: 25,
  },
  {
    id: "3",
    name_fr: "La Prière",
    slug: "la-priere",
    index: 3,
    hadithCount: 30,
  },
];

const mockSahabas: ItemType[] = [
  {
    id: "1",
    name_fr: "Ali ibn Abi Talib",
    slug: "ali-ibn-abi-talib",
    hadithCount: 18,
  },
  { id: "2", name_fr: "Aisha", slug: "aisha", hadithCount: 12 },
];

const mockTransmitters: ItemType[] = [
  { id: "1", name_fr: "Malik", slug: "malik", hadithCount: 8 },
  { id: "2", name_fr: "Nafi", slug: "nafi", hadithCount: 5 },
];

describe("FilteredCardsEdit Component", () => {
  it("should render correct title for chapters variant", () => {
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    expect(screen.getByText("Liste des chapitres")).toBeInTheDocument();
  });

  it("should render correct title for sahabas variant", () => {
    render(
      <FilteredCardsEdit
        items={mockSahabas}
        variant="sahabas"
      />
    );

    expect(screen.getByText("Liste des sahabas")).toBeInTheDocument();
  });

  it("should render correct title for transmitters variant", () => {
    render(
      <FilteredCardsEdit
        items={mockTransmitters}
        variant="transmitters"
      />
    );

    expect(screen.getByText("Liste des transmetteurs")).toBeInTheDocument();
  });

  it("should render search input with correct placeholder", () => {
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    const searchInput = screen.getByTestId("search-input");
    expect(searchInput).toHaveAttribute(
      "placeholder",
      "Rechercher un chapitre..."
    );
  });

  it("should render all items initially", () => {
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    expect(screen.getByTestId("card-edit-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-edit-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-edit-3")).toBeInTheDocument();
  });

  it("should filter items based on search input", async () => {
    const user = userEvent.setup();
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    const searchInput = screen.getByTestId("search-input");

    // Search for "foi"
    await user.type(searchInput, "foi");

    // Only "La Foi" should be visible
    expect(screen.getByTestId("card-edit-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-edit-2")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card-edit-3")).not.toBeInTheDocument();
  });

  it("should perform case-insensitive search", async () => {
    const user = userEvent.setup();
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    const searchInput = screen.getByTestId("search-input");

    // Search with different case
    await user.type(searchInput, "PURIFICATION");

    expect(screen.getByTestId("card-edit-2")).toBeInTheDocument();
    expect(screen.queryByTestId("card-edit-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("card-edit-3")).not.toBeInTheDocument();
  });

  it("should show no results message when no items match", async () => {
    const user = userEvent.setup();
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    const searchInput = screen.getByTestId("search-input");

    // Search for something that doesn't exist
    await user.type(searchInput, "inexistant");

    expect(screen.getByText("Aucun chapitre trouvé")).toBeInTheDocument();
    expect(screen.queryByTestId("card-edit-1")).not.toBeInTheDocument();
  });

  it("should show correct no results message for different variants", async () => {
    const user = userEvent.setup();

    // Test sahabas
    const { rerender } = render(
      <FilteredCardsEdit
        items={mockSahabas}
        variant="sahabas"
      />
    );
    const searchInput = screen.getByTestId("search-input");

    await user.type(searchInput, "inexistant");
    expect(screen.getByText("Aucun sahaba trouvé")).toBeInTheDocument();

    // Test transmitters
    await user.clear(searchInput);
    rerender(
      <FilteredCardsEdit
        items={mockTransmitters}
        variant="transmitters"
      />
    );
    await user.type(searchInput, "inexistant");
    expect(screen.getByText("Aucun transmetteur trouvé")).toBeInTheDocument();
  });

  it("should clear search and show all items", async () => {
    const user = userEvent.setup();
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    const searchInput = screen.getByTestId("search-input");

    // Search first
    await user.type(searchInput, "foi");
    expect(screen.getByTestId("card-edit-1")).toBeInTheDocument();
    expect(screen.queryByTestId("card-edit-2")).not.toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);

    // All items should be visible again
    expect(screen.getByTestId("card-edit-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-edit-2")).toBeInTheDocument();
    expect(screen.getByTestId("card-edit-3")).toBeInTheDocument();
  });

  it("should handle empty items array", () => {
    render(
      <FilteredCardsEdit
        items={[]}
        variant="chapters"
      />
    );

    expect(screen.getByText("Aucun chapitre trouvé")).toBeInTheDocument();
  });

  it("should pass correct props to CardEdit components", () => {
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    // Check that CardEdit receives the correct props
    expect(screen.getByText("Card for La Foi - chapters")).toBeInTheDocument();
    expect(
      screen.getByText("Card for La Purification - chapters")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Card for La Prière - chapters")
    ).toBeInTheDocument();
  });

  it("should maintain search state during typing", async () => {
    const user = userEvent.setup();
    render(
      <FilteredCardsEdit
        items={mockChapters}
        variant="chapters"
      />
    );

    const searchInput = screen.getByTestId("search-input");

    // Type gradually - searching for "prière" to match only "La Prière"
    await user.type(searchInput, "pri");
    expect(screen.queryByTestId("card-edit-1")).not.toBeInTheDocument(); // La Foi
    expect(screen.queryByTestId("card-edit-2")).not.toBeInTheDocument(); // La Purification
    expect(screen.getByTestId("card-edit-3")).toBeInTheDocument(); // La Prière

    await user.type(searchInput, "è");
    expect(screen.queryByTestId("card-edit-1")).not.toBeInTheDocument(); // La Foi
    expect(screen.queryByTestId("card-edit-2")).not.toBeInTheDocument(); // La Purification
    expect(screen.getByTestId("card-edit-3")).toBeInTheDocument(); // La Prière

    await user.type(searchInput, "re");
    expect(screen.queryByTestId("card-edit-1")).not.toBeInTheDocument(); // La Foi
    expect(screen.queryByTestId("card-edit-2")).not.toBeInTheDocument(); // La Purification
    expect(screen.getByTestId("card-edit-3")).toBeInTheDocument(); // La Prière only
  });
});
