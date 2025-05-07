import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { mockHadiths } from "@/src/utils/mocks/mockHadiths";
import { ListLayoutHadith } from "./ListLayoutHadith";

describe("ListLayoutHadith", () => {
  it("renders title, name, hadith count and hadiths", () => {
    render(
      <ListLayoutHadith
        title="Chapter"
        name="Faith"
        hadiths={mockHadiths}
      />
    );
    // Title and name
    expect(screen.getByText("Chapter")).toBeInTheDocument();
    expect(screen.getByText("Faith")).toBeInTheDocument();
    // Hadith count (BadgeNumberOfHadith renders the number)
    expect(screen.getByText("102")).toBeInTheDocument();
    // Hadiths content
    expect(screen.getByText("Premier hadith")).toBeInTheDocument();
    expect(screen.getByText("Deuxième hadith")).toBeInTheDocument();
    expect(screen.getByText("Narrateur 1")).toBeInTheDocument();
    expect(screen.getByText("Narrateur 2")).toBeInTheDocument();
  });
});
