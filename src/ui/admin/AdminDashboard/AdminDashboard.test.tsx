"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ItemType } from "@/src/types/types";
import { AdminDashboard } from "./AdminDashboard";

// Mock data for testing
const mockChapters: ItemType[] = [
  { id: "ch1", name: "Chapter 1", slug: "chapter-1" },
  { id: "ch2", name: "Chapter 2", slug: "chapter-2" },
];

const mockNarrators: ItemType[] = [
  { id: "n1", name: "Narrator 1", slug: "narrator-1" },
  { id: "n2", name: "Narrator 2", slug: "narrator-2" },
];

const mockSahabas: ItemType[] = [
  { id: "s1", name: "Sahaba 1", slug: "sahaba-1" },
  { id: "s2", name: "Sahaba 2", slug: "sahaba-2" },
];

const mockTransmitters: ItemType[] = [
  { id: "t1", name: "Transmitter 1", slug: "transmitter-1" },
  { id: "t2", name: "Transmitter 2", slug: "transmitter-2" },
];

// Mock the child components to isolate the AdminDashboard logic
vi.mock("@/src/ui/admin/FilteredCardsEdit/FilteredCardsEdit", () => ({
  FilteredCardsEdit: vi.fn(({ items, variant }) => (
    <div data-testid="filtered-cards-edit">
      <p>Variant: {variant}</p>
      <ul>
        {items.map((item: ItemType) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )),
}));

vi.mock("@/src/ui/forms/AddItemForm", () => ({
  AddItemForm: vi.fn(({ items, variant }) => (
    <div data-testid="add-item-form">
      <p>Add Form for: {variant}</p>
      <p>First item: {items.length > 0 ? items[0].name : "No items"}</p>
    </div>
  )),
}));

describe("AdminDashboard", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("renders with default variant (chapters) selected", () => {
    render(
      <AdminDashboard
        chapters={mockChapters}
        narrators={mockNarrators}
        sahabas={mockSahabas}
        transmitters={mockTransmitters}
      />
    );

    // Check if the Chapters radio button is selected
    const chapterRadioButton = screen.getByLabelText("Chapitres");
    expect(chapterRadioButton).toBeChecked();

    // Check if FilteredCardsEdit and AddItemForm are rendered with chapter data
    const filteredCardsEdit = screen.getByTestId("filtered-cards-edit");
    expect(filteredCardsEdit).toHaveTextContent("Variant: chapters");
    expect(filteredCardsEdit).toHaveTextContent("Chapter 1");

    const addItemForm = screen.getByTestId("add-item-form");
    expect(addItemForm).toHaveTextContent("Add Form for: chapters");
    expect(addItemForm).toHaveTextContent("First item: Chapter 1");
  });

  it("switches to narrators variant when Narrators radio button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AdminDashboard
        chapters={mockChapters}
        narrators={mockNarrators}
        sahabas={mockSahabas}
        transmitters={mockTransmitters}
      />
    );

    const narratorRadioButton = screen.getByLabelText("Narrateurs");
    await user.click(narratorRadioButton);

    expect(narratorRadioButton).toBeChecked();

    const filteredCardsEdit = screen.getByTestId("filtered-cards-edit");
    expect(filteredCardsEdit).toHaveTextContent("Variant: narrators");
    expect(filteredCardsEdit).toHaveTextContent("Narrator 1");

    const addItemForm = screen.getByTestId("add-item-form");
    expect(addItemForm).toHaveTextContent("Add Form for: narrators");
    expect(addItemForm).toHaveTextContent("First item: Narrator 1");
  });

  it("switches to sahabas variant when Sahabas radio button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AdminDashboard
        chapters={mockChapters}
        narrators={mockNarrators}
        sahabas={mockSahabas}
        transmitters={mockTransmitters}
      />
    );

    const companionRadioButton = screen.getByLabelText("Compagnons");
    await user.click(companionRadioButton);

    expect(companionRadioButton).toBeChecked();

    const filteredCardsEdit = screen.getByTestId("filtered-cards-edit");
    expect(filteredCardsEdit).toHaveTextContent("Variant: sahabas");
    expect(filteredCardsEdit).toHaveTextContent("Sahaba 1");

    const addItemForm = screen.getByTestId("add-item-form");
    expect(addItemForm).toHaveTextContent("Add Form for: sahabas");
    expect(addItemForm).toHaveTextContent("First item: Sahaba 1");
  });

  it("switches to transmitters variant when Transmitters radio button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AdminDashboard
        chapters={mockChapters}
        narrators={mockNarrators}
        sahabas={mockSahabas}
        transmitters={mockTransmitters}
      />
    );

    const transmitterRadioButton = screen.getByLabelText("Transmetteurs");
    await user.click(transmitterRadioButton);

    expect(transmitterRadioButton).toBeChecked();

    const filteredCardsEdit = screen.getByTestId("filtered-cards-edit");
    expect(filteredCardsEdit).toHaveTextContent("Variant: transmitters");
    expect(filteredCardsEdit).toHaveTextContent("Transmitter 1");

    const addItemForm = screen.getByTestId("add-item-form");
    expect(addItemForm).toHaveTextContent("Add Form for: transmitters");
    expect(addItemForm).toHaveTextContent("First item: Transmitter 1");
  });

  it("passes the correct items to child components when variant changes", async () => {
    const user = userEvent.setup();
    render(
      <AdminDashboard
        chapters={mockChapters}
        narrators={mockNarrators}
        sahabas={mockSahabas}
        transmitters={mockTransmitters}
      />
    );

    // Initially chapters
    let filteredCardsEdit = screen.getByTestId("filtered-cards-edit");
    expect(filteredCardsEdit).toHaveTextContent("Chapter 1");
    expect(filteredCardsEdit).not.toHaveTextContent("Narrator 1");

    let addItemForm = screen.getByTestId("add-item-form");
    expect(addItemForm).toHaveTextContent("First item: Chapter 1");

    // Switch to narrators
    const narratorRadioButton = screen.getByLabelText("Narrateurs");
    await user.click(narratorRadioButton);

    filteredCardsEdit = screen.getByTestId("filtered-cards-edit"); // Re-query after update
    expect(filteredCardsEdit).toHaveTextContent("Narrator 1");
    expect(filteredCardsEdit).not.toHaveTextContent("Chapter 1");

    addItemForm = screen.getByTestId("add-item-form"); // Re-query after update
    expect(addItemForm).toHaveTextContent("First item: Narrator 1");

    // Switch to sahabas
    const sahabaRadioButton = screen.getByLabelText("Compagnons");
    await user.click(sahabaRadioButton);

    filteredCardsEdit = screen.getByTestId("filtered-cards-edit"); // Re-query after update
    expect(filteredCardsEdit).toHaveTextContent("Sahaba 1");
    expect(filteredCardsEdit).not.toHaveTextContent("Narrator 1");

    addItemForm = screen.getByTestId("add-item-form"); // Re-query after update
    expect(addItemForm).toHaveTextContent("First item: Sahaba 1");

    // Switch to transmitters
    const transmitterRadioButton = screen.getByLabelText("Transmetteurs");
    await user.click(transmitterRadioButton);

    filteredCardsEdit = screen.getByTestId("filtered-cards-edit"); // Re-query after update
    expect(filteredCardsEdit).toHaveTextContent("Transmitter 1");
    expect(filteredCardsEdit).not.toHaveTextContent("Sahaba 1");

    addItemForm = screen.getByTestId("add-item-form"); // Re-query after update
    expect(addItemForm).toHaveTextContent("First item: Transmitter 1");
  });
});
