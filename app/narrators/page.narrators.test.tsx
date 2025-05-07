// Tests for NarratorsPage
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("NarratorsPage", () => {
  it("renders narrators list", async () => {
    // Dynamically import the server component and render it as a promise
    const { default: NarratorsPage } = await import("./page");
    // Render the async server component using .then
    await NarratorsPage().then((node) => {
      render(<>{node}</>);
    });
    // Check for expected content
    expect(
      await screen.findByText("Narrateurs des Hadiths")
    ).toBeInTheDocument();

    expect(await screen.findByText(/Abbad/i)).toBeInTheDocument();
    expect(await screen.findByText(/siddiq/i)).toBeInTheDocument();
    expect((await screen.findAllByText("0 Hadiths")).length).toBeGreaterThan(0);
  });
});
