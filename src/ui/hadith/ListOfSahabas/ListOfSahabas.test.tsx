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

    expect(screen.getByText("Sahaba(s) mentionné(s) :")).toBeInTheDocument();

    const abuBakrLink = screen.getByRole("link", { name: "Abu Bakr" });
    expect(abuBakrLink).toHaveAttribute("href", "/sahabas/abu-bakr");

    const omarLink = screen.getByRole("link", { name: "Omar ibn al-Khattab" });
    expect(omarLink).toHaveAttribute("href", "/sahabas/omar-ibn-al-khattab");
  });

  it("highlights search terms in sahaba names", () => {
    render(
      <ListOfSahabas
        sahabas={mockSahabas}
        highlight="Abu"
      />
    );

    const highlightedText = screen.getByText("Abu");
    expect(highlightedText.tagName).toBe("MARK");
    expect(highlightedText).toHaveClass("bg-yellow-200");
  });

  it("does not render when no sahabas are mentioned", () => {
    const { container } = render(<ListOfSahabas sahabas={mockEmptySahabas} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders without highlighting when no highlight prop is provided", () => {
    render(<ListOfSahabas sahabas={mockSahabas} />);

    expect(screen.getByText("Abu Bakr")).toBeInTheDocument();
    // Check that no mark elements exist when no highlight is provided
    const container = screen.getByText("Abu Bakr").closest("div");
    expect(container?.querySelector("mark")).toBeNull();
  });

  it("handles case-insensitive highlighting", () => {
    render(
      <ListOfSahabas
        sahabas={mockSahabas}
        highlight="abu"
      />
    );

    // Use getByText with exact match for the highlighted part
    const highlightedText = screen.getByText("Abu");
    expect(highlightedText.tagName).toBe("MARK");
    expect(highlightedText).toHaveClass("bg-yellow-200");
  });

  it("escapes special regex characters in highlight", () => {
    const specialCharSahabas: ItemType[] = [
      { id: "1", name: "Abu (Bakr)", slug: "abu-bakr" },
    ];

    render(
      <ListOfSahabas
        sahabas={specialCharSahabas}
        highlight="("
      />
    );

    const marks = screen.getAllByText("(");
    const highlightedMark = marks.find((el) => el.tagName === "MARK");
    expect(highlightedMark).toBeDefined();
  });
});
