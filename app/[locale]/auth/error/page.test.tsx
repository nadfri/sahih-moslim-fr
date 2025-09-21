import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Page from "./page";

// Mock React's use hook
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    use: vi.fn((promise) => promise), // Simply return the promise value directly
  };
});

describe("AuthErrorPage", () => {
  it("renders error message", () => {
    // Create a mock searchParams with resolved value
    const mockSearchParams = Promise.resolve({
      error: "Authentication Error",
    });

    // Render the page with the mock searchParams
    render(<Page searchParams={mockSearchParams} />);

    expect(screen.getByText(/authentication error/i)).toBeInTheDocument();
  });
});
