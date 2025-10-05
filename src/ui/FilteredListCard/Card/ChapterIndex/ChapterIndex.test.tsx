import { screen } from "@testing-library/react";
import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { describe, expect, it } from "vitest";

import { ChapterIndex } from "./ChapterIndex";

// Test ChapterIndex component rendering

describe("ChapterIndex", () => {
  it("renders chapter index when index is a number", () => {
    renderWithI18n(<ChapterIndex index={5} />);
    // Should display the chapter number (traduction dynamique)
    expect(screen.getByText(/Chapitre 5/)).toBeInTheDocument();
  });

  it("renders empty placeholder when index is null", () => {
    renderWithI18n(<ChapterIndex index={null} />);
    // Should render an empty paragraph
    const p = screen.getByText(
      (content, element) => element?.tagName === "P" && content === ""
    );
    expect(p).toBeInTheDocument();
  });

  it("renders empty placeholder when index is undefined", () => {
    renderWithI18n(<ChapterIndex index={undefined} />);
    // Should render an empty paragraph
    const p = screen.getByText(
      (content, element) => element?.tagName === "P" && content === ""
    );
    expect(p).toBeInTheDocument();
  });
});
