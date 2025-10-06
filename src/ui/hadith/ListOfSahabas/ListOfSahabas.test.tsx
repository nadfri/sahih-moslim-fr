import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ItemType } from "@/src/types/types";
import { ListOfSahabas } from "./ListOfSahabas";

const mockSahabas: ItemType[] = [
  { id: "1", name_fr: "Abu Bakr", slug: "abu-bakr" },
  { id: "2", name_fr: "Omar ibn al-Khattab", slug: "omar-ibn-al-khattab" },
];

const mockEmptySahabas: ItemType[] = [];

describe("ListOfSahabas", () => {
  it("renders list of sahabas with correct links", () => {
    renderWithI18n(<ListOfSahabas sahabas={mockSahabas} />);

    expect(screen.getByText("Sahabas mentionnés")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/sahabas/abu-bakr");
    expect(links[0]).toHaveTextContent("Abu Bakr");
    expect(links[1]).toHaveAttribute("href", "/sahabas/omar-ibn-al-khattab");
    expect(links[1]).toHaveTextContent("Omar ibn al-Khattab");
  });

  it("does not render when no sahabas are mentioned", () => {
    const { container } = renderWithI18n(
      <ListOfSahabas sahabas={mockEmptySahabas} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders without highlighting when no highlight prop is provided", () => {
    renderWithI18n(<ListOfSahabas sahabas={mockSahabas} />);

    expect(screen.getByText("Abu Bakr")).toBeInTheDocument();
    // Check that no mark elements exist since component doesn't support highlight
    const container = screen.getByText("Abu Bakr").closest("div");
    expect(container?.querySelector("mark")).toBeNull();
  });
});
