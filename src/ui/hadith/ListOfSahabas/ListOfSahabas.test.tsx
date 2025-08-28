import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ItemType } from "@/src/types/types";
import { ListOfSahabas } from "./ListOfSahabas";

const mockSahabas: ItemType[] = [
  { id: "1", name: "Abu Bakr", slug: "abu-bakr" },
  { id: "2", name: "Omar ibn al-Khattab", slug: "omar-ibn-al-khattab" },
];

const mockEmptySahabas: ItemType[] = [];

describe("ListOfSahabas", () => {
  it("renders list of sahabas with correct links", () => {
    render(<ListOfSahabas sahabas={mockSahabas} />);

    expect(screen.getByText("Sahaba(s) mentionné(s)")).toBeInTheDocument();

    const abuBakrLink = screen.getByRole("link", { name: "Abu Bakr" });
    expect(abuBakrLink).toHaveAttribute("href", "/sahabas/abu-bakr");

    const omarLink = screen.getByRole("link", { name: "Omar ibn al-Khattab" });
    expect(omarLink).toHaveAttribute("href", "/sahabas/omar-ibn-al-khattab");
  });

  it("does not render when no sahabas are mentioned", () => {
    const { container } = render(<ListOfSahabas sahabas={mockEmptySahabas} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders without highlighting when no highlight prop is provided", () => {
    render(<ListOfSahabas sahabas={mockSahabas} />);

    expect(screen.getByText("Abu Bakr")).toBeInTheDocument();
    // Check that no mark elements exist since component doesn't support highlight
    const container = screen.getByText("Abu Bakr").closest("div");
    expect(container?.querySelector("mark")).toBeNull();
  });
});
