import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock Next.js router
const mockPush = vi.fn();
const mockGet = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
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

describe("Authentication Flow - Redirect After Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    mockGet.mockImplementation((key: string) =>
      key === "callbackUrl" ? "/admin" : null
    );
  });

  it("should call signInWithOAuth with correct redirect URL when callbackUrl is provided", async () => {
    const { ButtonGithub } = await import("@/src/ui/SignButtons/ButtonGithub");

    render(<ButtonGithub />);

    const signInButton = screen.getByRole("button", {
      name: /connexion avec github/i,
    });
    expect(signInButton).toBeInTheDocument();

    await userEvent.click(signInButton);

    // Verify that signInWithOAuth was called with correct options
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback?next=%2Fadmin",
      },
    });
  });

  it("should show loading state during sign-in process", async () => {
    const { ButtonGithub } = await import("@/src/ui/SignButtons/ButtonGithub");

    render(<ButtonGithub />);

    const signInButton = screen.getByRole("button", {
      name: /connexion avec github/i,
    });

    // Click to start loading
    await userEvent.click(signInButton);

    // Should show loading text
    expect(screen.getByText("Connexion en cours...")).toBeInTheDocument();
    expect(signInButton).toBeDisabled();
  });

  it("should use default redirect when no callbackUrl", async () => {
    mockGet.mockReturnValue(null);

    const { ButtonGithub } = await import("@/src/ui/SignButtons/ButtonGithub");

    render(<ButtonGithub />);

    const signInButton = screen.getByRole("button", {
      name: /connexion avec github/i,
    });

    await userEvent.click(signInButton);

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback?next=%2F",
      },
    });
  });
});
