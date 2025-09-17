import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === "callbackUrl" ? "/admin" : null),
  }),
}));

// Mock Supabase client
vi.mock("@/src/lib/auth/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: vi.fn(),
    },
  }),
}));

// Mock useAuth hook
vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => ({
    signInWithGitHub: vi.fn().mockImplementation(async (callbackUrl) => {
      // Simulate successful OAuth redirect with relative path
      const nextPath = callbackUrl
        ? new URL(callbackUrl, "http://localhost:3000").pathname
        : "/";
      mockPush(
        `/auth/callback?code=test-code&next=${encodeURIComponent(nextPath)}`
      );
    }),
    user: null,
    loading: false,
  }),
}));

describe("Authentication Flow - Redirect After Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  it("should redirect to protected page after successful login", async () => {
    const { ButtonGithub } = await import("@/src/ui/SignButtons/ButtonGithub");

    render(<ButtonGithub />);

    const signInButton = screen.getByRole("button", {
      name: /connexion avec github/i,
    });
    expect(signInButton).toBeInTheDocument();

    await userEvent.click(signInButton);

    // Verify that signInWithGitHub was called and redirected to callback with correct path
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        "/auth/callback?code=test-code&next=%2Fadmin"
      );
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
});
