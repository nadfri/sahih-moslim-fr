import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ButtonGithub } from "./ButtonGithub";

// Mock search params to provide a callbackUrl
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "callbackUrl" ? "/test-callback" : null),
  }),
}));

// Mock Supabase client
const mockSignInWithOAuth = vi.fn();
vi.mock("@/src/lib/auth/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}));

// Mock window.location
const mockLocation = {
  origin: "http://localhost:3000",
};
Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

describe("ButtonGithub", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithOAuth.mockResolvedValue({ error: null });
  });

  it("renders with correct text and triggers signInWithOAuth on click", async () => {
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

    // Click the button and verify signInWithOAuth was called with correct options
    await user.click(button);
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback?next=%2Ftest-callback",
      },
    });
  });

  it("shows loading state when clicked", async () => {
    const user = userEvent.setup();

    render(<ButtonGithub />);

    const button = screen.getByRole("button", {
      name: /connexion avec github/i,
    });

    await user.click(button);

    // Should show loading text
    expect(screen.getByText("Connexion en cours...")).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
