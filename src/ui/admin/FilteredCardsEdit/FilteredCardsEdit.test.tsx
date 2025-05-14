import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { ItemType } from "@/src/types/types";
import { FilteredCardsEdit } from "./FilteredCardsEdit";

const mockItems: ItemType[] = [
  { id: "1", name: "Chapitre 1", slug: "chapitre-1" },
  { id: "2", name: "Chapitre 2", slug: "chapitre-2" },
  { id: "3", name: "Autre Item", slug: "autre-item" },
];

describe("FilteredCardsEdit", () => {
  it("renders the component with initial items", () => {
    render(
      <FilteredCardsEdit
        items={mockItems}
        variant="chapters"
      />
    );

    expect(screen.getByText("Liste des chapitres")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Rechercher un chapitre...")
    ).toBeInTheDocument();
    expect(screen.getByText("Chapitre 1")).toBeInTheDocument();
    expect(screen.getByText("Chapitre 2")).toBeInTheDocument();
    expect(screen.getByText("Autre Item")).toBeInTheDocument();
  });

  it("filters items based on search input (name)", async () => {
    const user = userEvent.setup();
    render(
      <FilteredCardsEdit
        items={mockItems}
        variant="chapters"
      />
    );

    const searchInput = screen.getByPlaceholderText(
      "Rechercher un chapitre..."
    );
    await user.type(searchInput, "Chapitre");

    expect(screen.getByText("Chapitre 1")).toBeInTheDocument();
    expect(screen.getByText("Chapitre 2")).toBeInTheDocument();
    expect(screen.queryByText("Autre Item")).not.toBeInTheDocument();
  });

  it("shows 'Aucun chapters trouvé' message when no items match", async () => {
    const user = userEvent.setup();
    render(
      <FilteredCardsEdit
        items={mockItems}
        variant="chapters"
      />
    );

    const searchInput = screen.getByPlaceholderText(
      "Rechercher un chapitre..."
    );
    await user.type(searchInput, "Inexistant");

    expect(screen.getByText("Aucun chapters trouvé")).toBeInTheDocument();
    expect(screen.queryByText("Chapitre 1")).not.toBeInTheDocument();
  });

  it("renders correct title for narrators variant", () => {
    render(
      <FilteredCardsEdit
        items={mockItems}
        variant="narrators"
      />
    );
    expect(screen.getByText("Liste des narrateurs")).toBeInTheDocument();
  });

  it("renders correct title for sahabas variant", () => {
    render(
      <FilteredCardsEdit
        items={mockItems}
        variant="sahabas"
      />
    );
    expect(screen.getByText("Liste des sahabas")).toBeInTheDocument();
  });
});
