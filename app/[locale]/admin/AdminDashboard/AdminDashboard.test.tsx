import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { ItemType } from "@/src/types/types";
import { AdminDashboard } from "./AdminDashboard";

// Mock the child components
vi.mock("../FilteredCardsEdit/FilteredCardsEdit", () => ({
  FilteredCardsEdit: vi.fn(({ items, variant }) => (
    <div data-testid="filtered-cards-edit">
      FilteredCardsEdit - {variant} - {items.length} items
    </div>
  )),
}));

vi.mock("@/src/ui/forms/AddItemForm/AddItemForm", () => ({
  AddItemForm: vi.fn(({ items, variant }) => (
    <div data-testid="add-item-form">
      AddItemForm - {variant} - {items.length} items
    </div>
  )),
}));

vi.mock("../DataManagement/DataManagement", () => ({
  DataManagement: vi.fn(() => (
    <div data-testid="data-management">DataManagement Component</div>
  )),
}));

const mockChapters: ItemType[] = [
  { id: "1", name_fr: "Chapter 1", slug: "chapter-1", hadithCount: 5 },
  { id: "2", name_fr: "Chapter 2", slug: "chapter-2", hadithCount: 3 },
];

const mockSahabas: ItemType[] = [
  { id: "1", name_fr: "Sahaba 1", slug: "sahaba-1", hadithCount: 7 },
  { id: "2", name_fr: "Sahaba 2", slug: "sahaba-2", hadithCount: 2 },
];

const mockTransmitters: ItemType[] = [
  { id: "1", name_fr: "Transmitter 1", slug: "transmitter-1", hadithCount: 4 },
];

const mockHadithsCount = 42;

describe("AdminDashboard Component", () => {
  const defaultDatas = {
    chapters: mockChapters,
    sahabas: mockSahabas,
    transmitters: mockTransmitters,
    hadithsCount: mockHadithsCount,
  };

  it("should render DataManagement component", () => {
    render(<AdminDashboard datas={defaultDatas} />);

    expect(screen.getByTestId("data-management")).toBeInTheDocument();
  });

  it("should render all variant selector buttons", () => {
    render(<AdminDashboard datas={defaultDatas} />);

    expect(
      screen.getByRole("radio", { name: /Chapitres/ })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", { name: /Compagnons/ })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", { name: /Transmetteurs/ })
    ).toBeInTheDocument();
  });

  it("should have chapters selected by default", () => {
    render(<AdminDashboard datas={defaultDatas} />);

    const chaptersRadio = screen.getByRole("radio", { name: /Chapitres/ });
    expect(chaptersRadio).toBeChecked();

    // Check that children components receive chapters data
    expect(screen.getByTestId("add-item-form")).toHaveTextContent(
      "chapters - 2 items"
    );
    expect(screen.getByTestId("filtered-cards-edit")).toHaveTextContent(
      "chapters - 2 items"
    );
  });

  it("should switch to sahabas when selected", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard datas={defaultDatas} />);

    const sahabasRadio = screen.getByRole("radio", { name: /Compagnons/ });
    await user.click(sahabasRadio);

    expect(sahabasRadio).toBeChecked();
    expect(screen.getByTestId("add-item-form")).toHaveTextContent(
      "sahabas - 2 items"
    );
    expect(screen.getByTestId("filtered-cards-edit")).toHaveTextContent(
      "sahabas - 2 items"
    );
  });

  it("should switch to transmitters when selected", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard datas={defaultDatas} />);

    const transmittersRadio = screen.getByRole("radio", {
      name: /Transmetteurs/,
    });
    await user.click(transmittersRadio);

    expect(transmittersRadio).toBeChecked();
    expect(screen.getByTestId("add-item-form")).toHaveTextContent(
      "transmitters - 1 items"
    );
    expect(screen.getByTestId("filtered-cards-edit")).toHaveTextContent(
      "transmitters - 1 items"
    );
  });

  it("should apply correct styling to selected variant", () => {
    render(<AdminDashboard datas={defaultDatas} />);

    const chaptersLabel = screen
      .getByRole("radio", { name: /Chapitres/ })
      .closest("label");

    // Selected (chapters) should have emerald styling with dark mode support
    expect(chaptersLabel).toHaveClass(
      "bg-emerald-100",
      "dark:bg-emerald-900/50",
      "border-emerald-300",
      "dark:border-emerald-700",
      "text-emerald-600",
      "dark:text-emerald-400"
    );
  });

  it("should render AddItemForm and FilteredCardsEdit components", () => {
    render(<AdminDashboard datas={defaultDatas} />);

    expect(screen.getByTestId("add-item-form")).toBeInTheDocument();
    expect(screen.getByTestId("filtered-cards-edit")).toBeInTheDocument();
  });

  it("should handle empty arrays gracefully", () => {
    const emptyDatas = {
      chapters: [],
      sahabas: [],
      transmitters: [],
      hadithsCount: 0,
    };
    render(<AdminDashboard datas={emptyDatas} />);

    expect(screen.getByTestId("add-item-form")).toHaveTextContent(
      "chapters - 0 items"
    );
    expect(screen.getByTestId("filtered-cards-edit")).toHaveTextContent(
      "chapters - 0 items"
    );
  });

  it("should update child components when variant changes", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard datas={defaultDatas} />);

    // Initially chapters
    expect(screen.getByTestId("add-item-form")).toHaveTextContent(
      "chapters - 2 items"
    );

    // Switch to sahabas
    await user.click(screen.getByRole("radio", { name: /Compagnons/ }));
    expect(screen.getByTestId("add-item-form")).toHaveTextContent(
      "sahabas - 2 items"
    );

    // Switch to transmitters
    await user.click(screen.getByRole("radio", { name: /Transmetteurs/ }));
    expect(screen.getByTestId("add-item-form")).toHaveTextContent(
      "transmitters - 1 items"
    );
  });
});
