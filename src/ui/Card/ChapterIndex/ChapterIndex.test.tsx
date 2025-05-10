import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChapterIndex } from "./ChapterIndex";

// Test ChapterIndex component rendering

describe("ChapterIndex", () => {
  it("renders chapter index when index is a number", () => {
    render(<ChapterIndex index={5} />);
    // Should display the chapter number
    expect(screen.getByText("Chapitre 5")).toBeInTheDocument();
  });

  it("renders empty placeholder when index is null", () => {
    render(<ChapterIndex index={null} />);
    // Should render an empty paragraph
    const p = screen.getByText(
      (content, element) => element?.tagName === "P" && content === ""
    );
    expect(p).toBeInTheDocument();
  });

  it("renders empty placeholder when index is undefined", () => {
    render(<ChapterIndex index={undefined} />);
    // Should render an empty paragraph
    const p = screen.getByText(
      (content, element) => element?.tagName === "P" && content === ""
    );
    expect(p).toBeInTheDocument();
  });
});
