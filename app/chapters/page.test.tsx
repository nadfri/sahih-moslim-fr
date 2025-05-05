// Tests for ChaptersPage
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock getAllChapters
vi.mock("@/src/services/services", () => ({
  getAllChapters: vi.fn().mockResolvedValue([
    { slug: "intro", title: "Introduction", hadithCount: 5 },
    { slug: "faith", title: "Faith", hadithCount: 12 },
  ]),
}));

describe("ChaptersPage", () => {
  it("renders chapters list", async () => {
    // Dynamically import the server component and render it as a promise
    const { default: ChaptersPage } = await import("./page");
    // Render the async server component using .then
    await ChaptersPage().then((node) => {
      render(<>{node}</>);
    });
    // Check for expected content
    expect(
      await screen.findByText("Chapitres de Sahih Muslim")
    ).toBeInTheDocument();

    screen.debug(); // Log the current state of the DOM
    expect(await screen.findByText("Introduction")).toBeInTheDocument();
    expect(await screen.findByText("Faith")).toBeInTheDocument();
    expect(await screen.findByText("5 Hadiths")).toBeInTheDocument();
    expect(await screen.findByText("12 Hadiths")).toBeInTheDocument();
  });
});
