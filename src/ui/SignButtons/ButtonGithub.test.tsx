import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ButtonGithub } from "./ButtonGithub";

// Mock search params to provide a callbackUrl
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "callbackUrl" ? "/test-callback" : null),
  }),
}));

// Provide a mock for the refactored useAuth hook
const mockSignInWithGitHub = vi.fn();
vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => ({ signInWithGitHub: mockSignInWithGitHub }),
}));

describe("ButtonGithub", () => {
  it("renders with correct text and triggers signInWithGitHub on click", async () => {
    const user = userEvent.setup();

    render(<ButtonGithub />);

    // Check that the button renders with the correct text
    const button = screen.getByRole("button", {
      name: /connexion avec github/i,
    });
    expect(button).toBeInTheDocument();

    // Check that the button has a Github icon
    const svgIcon = document.querySelector("svg");
    expect(svgIcon).toBeInTheDocument();

    // Click the button and verify signInWithGitHub was called with the callbackUrl
    await user.click(button);
    expect(mockSignInWithGitHub).toHaveBeenCalledWith("/test-callback");
  });
});
