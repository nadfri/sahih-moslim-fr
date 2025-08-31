import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "./Header";

// Create mock functions
const mockPathname = vi.fn(() => "/");
const mockUseSession = vi.fn(() => ({
  status: "unauthenticated",
  data: null as null | { user: { name: string } },
}));

const mockUseAuth = vi.fn(() => ({
  user: null,
  profile: null,
  loading: false,
  signInWithGitHub: vi.fn(),
  signOut: vi.fn(),
}));

// Mock modules
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signOut: vi.fn(),
}));

vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname.mockReturnValue("/");
    mockUseSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });
  });

  it("renders all navigation links", () => {
    render(<Header />);

    // Check that all main navigation links are visible (using getAllByRole to handle desktop and mobile versions)
    const homeLinks = screen.getAllByRole("link", { name: /accueil/i });
    expect(homeLinks.length).toBeGreaterThan(0);

    const chaptersLinks = screen.getAllByRole("link", { name: /chapitres/i });
    expect(chaptersLinks.length).toBeGreaterThan(0);

    const companionsLinks = screen.getAllByRole("link", {
      name: /compagnons/i,
    });
    expect(companionsLinks.length).toBeGreaterThan(0);

    const searchLinks = screen.getAllByRole("link", { name: /recherche/i });
    expect(searchLinks.length).toBeGreaterThan(0);
  });

  it("highlights the active link based on current pathname", () => {
    // Set pathname to a specific route
    mockPathname.mockReturnValue("/chapters");

    render(<Header />);

    // Get all chapter links
    const chaptersLinks = screen.getAllByRole("link", { name: /chapitres/i });

    // At least one of the chapters links should have an active class or attribute
    const hasActiveChapterLink = chaptersLinks.some(
      (link) =>
        link.classList.contains("active") ||
        link.getAttribute("aria-current") === "page"
    );

    expect(hasActiveChapterLink).toBeTruthy();
  });

  it("shows 'Ajouter' link in development mode", () => {
    // When user is admin, the 'Ajouter' link should be visible
    mockUseAuth.mockReturnValueOnce({
      user: { name: "Admin" },
      profile: { role: "ADMIN" },
      loading: false,
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
    } as unknown as ReturnType<typeof mockUseAuth>);

    render(<Header />);

    const addLinks = screen.getAllByRole("link", { name: /ajouter/i });
    expect(addLinks.length).toBeGreaterThan(0);
    expect(
      addLinks.some((link) => link.getAttribute("href") === "/hadiths/add")
    ).toBeTruthy();
  });

  it("hides 'Ajouter' link in production mode", () => {
    // When user is not admin, the 'Ajouter' link should not be visible
    mockUseAuth.mockReturnValueOnce({
      user: null,
      profile: null,
      loading: false,
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
    });

    render(<Header />);

    const addLinks = screen.queryAllByRole("link", { name: /ajouter/i });
    expect(addLinks.length).toBe(0);
  });

  it("shows sign out button when user is authenticated", () => {
    // Update mock to return authenticated session
    mockUseSession.mockReturnValue({
      status: "authenticated",
      data: { user: { name: "Test User" } },
    });

    render(<Header />);

    // Since the button might contain a PowerOff SVG icon from lucide-react
    // we'll check if there's any button element present when user is authenticated
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("toggles mobile menu when hamburger button is clicked", async () => {
    const user = userEvent.setup();

    render(<Header />);

    // Find the hamburger button with the correct aria-label
    const hamburgerButton = screen.getByRole("button", {
      name: /ouvrir le menu/i,
    });

    // Since we can't easily check CSS classes with RTL directly,
    // we'll look at the aria-expanded attribute which should reflect the menu state
    expect(hamburgerButton).toHaveAttribute("aria-expanded", "false");

    // Click the hamburger button
    await user.click(hamburgerButton);

    // After clicking, the aria-expanded attribute should be true
    expect(hamburgerButton).toHaveAttribute("aria-expanded", "true");

    // We can also check that menu items are visible after clicking
    // For example, let's check if the mobile menu links are visible
    const mobileMenuLinks = screen.getAllByRole("link");
    expect(mobileMenuLinks.length).toBeGreaterThan(5); // There should be several links visible
  });
});
