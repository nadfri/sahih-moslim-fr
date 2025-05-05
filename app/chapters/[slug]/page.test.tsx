// Simple test for PageByChapters: only check that the chapter title is rendered
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock getChapterWithHadiths service
vi.mock("@/src/services/services", () => ({
  getChapterWithHadiths: vi.fn().mockResolvedValue({
    chapter: { slug: "intro", title: "Introduction" },
    hadiths: [],
  }),
}));

describe("PageByChapters", () => {
  it("renders chapter title", async () => {
    const { default: PageByChapters } = await import("./page");
    const params = Promise.resolve({ slug: "intro" });
    await PageByChapters({ params }).then((node: React.ReactNode) => {
      render(<>{node}</>);
    });
    expect(await screen.findByText("Introduction")).toBeInTheDocument();
  });
});
