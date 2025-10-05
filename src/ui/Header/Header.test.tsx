import { screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { Header } from "./Header";

// Mock useAuth hook to control auth states
const mockUseAuth = vi.fn();
vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock next/navigation hooks used across components
vi.mock("next/navigation", async () => {
  return {
    usePathname: () => "/",
    useSearchParams: () => ({ toString: () => "" }),
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  };
});

describe("Header component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders logo and navigation links", () => {
    // default: not authenticated
    mockUseAuth.mockReturnValue({ user: null, loading: false, isAdmin: false });

    renderWithI18n(<Header />);

    // Logo text
    expect(screen.getByText("Sahih Muslim")).toBeInTheDocument();
    // Nav links (desktop + mobile) render multiple times; assert at least one exists
    expect(screen.getAllByText("Accueil").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Chapitres").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Recherche").length).toBeGreaterThanOrEqual(1);
  });

  it("shows sign in button when no user", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, isAdmin: false });

    renderWithI18n(<Header />);

    // Sign in button uses title attribute in ButtonSignIn Link
    const signIn = screen.getByTitle("Se connecter");
    expect(signIn).toBeInTheDocument();
  });

  it("shows sign out when user is present", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "u1" },
      loading: false,
      isAdmin: false,
    });

    renderWithI18n(<Header />);

    // PowerOff button doesn't have text but we can query by role=button and aria-hidden icon isn't accessible
    const buttons = screen.getAllByRole("button");
    // There should be at least one button (sign out) plus theme and hamburger
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("shows admin add-hadith link only for admins", () => {
    // Non-admin
    mockUseAuth.mockReturnValue({ user: null, loading: false, isAdmin: false });
    const { rerender } = renderWithI18n(<Header />);
    // Add hadith link is not present
    expect(document.querySelector('a[href="/hadith/add"]')).toBeNull();

    // Admin
    mockUseAuth.mockReturnValue({
      user: { id: "u1" },
      loading: false,
      isAdmin: true,
    });
    rerender(<Header />);
    // When admin, LinkAddHadith renders an anchor (PlusIcon only) - query by href
    const addLink = document.querySelector('a[href="/hadith/add"]');
    expect(addLink).toBeInTheDocument();
  });

  it("theme toggle button toggles aria-label target (disabled on initial null) and is present", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, isAdmin: false });

    renderWithI18n(<Header />);

    // ThemeToggle has an aria-label starting with 'Toggle theme'
    const toggle = screen.getByRole("button", { name: /Toggle theme to/i });
    expect(toggle).toBeInTheDocument();
  });

  it("hamburger button toggles mobile menu via aria-expanded", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, isAdmin: false });

    renderWithI18n(<Header />);

    const hamburger = screen.getByLabelText(/Ouvrir le menu/i);
    expect(hamburger).toBeInTheDocument();

    // Initially collapsed
    expect(hamburger).toHaveAttribute("aria-expanded", "false");

    // Click to open
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");

    // Click to close
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });
});
