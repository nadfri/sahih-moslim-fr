// Tests for SahabasPage
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("SahabasPage", () => {
  it("renders Sahabas list", async () => {
    // Dynamically import the server component and render it as a promise
    const { default: SahabasPage } = await import("./page");
    // Render the async server component using .then
    await SahabasPage().then((node) => {
      render(<>{node}</>);
    });
    // Check for expected content
    expect(await screen.findByText(/compagnons/i)).toBeInTheDocument();

    expect(await screen.findByText(/Abdallah ibn Omar/i)).toBeInTheDocument();
    expect(await screen.findByText(/Zayd ibn Harithah/i)).toBeInTheDocument();
    expect((await screen.findAllByText("0 Hadiths")).length).toBeGreaterThan(0);
  });
});
