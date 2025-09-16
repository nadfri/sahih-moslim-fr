import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "./Header";

// Define types for testing
type MockUser = {
  id: string;
  name: string;
};

type MockProfile = {
  role: "USER" | "ADMIN";
};

// Create mock functions
const mockPathname = vi.fn(() => "/");
const mockUseAuth = vi.fn();

// Mock modules
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
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

    const transmetteursLinks = screen.getAllByRole("link", {
      name: /transmetteurs/i,
    });
    expect(transmetteursLinks.length).toBeGreaterThan(0);

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

  it("shows sign in link when user is not authenticated", () => {
    render(<Header />);

    // Should show sign in link when not authenticated (check both desktop and mobile versions)
    const signInLinks = screen.getAllByRole("link", { name: /se connecter/i });
    expect(signInLinks.length).toBeGreaterThan(0);

    // Verify the href attribute
    signInLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", "/auth/signin");
    });
  });

  it("shows sign out button and admin link when user is authenticated as admin", () => {
    // Update mock to return authenticated admin user
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Test Admin" } as MockUser,
      profile: { role: "ADMIN" } as MockProfile,
      loading: false,
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
    });

    render(<Header />);

    // Should show sign out buttons (desktop and mobile) when authenticated
    const signOutButtons = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.className.includes("bg-orange-50") ||
          button.className.includes("dark:bg-orange-700")
      );
    expect(signOutButtons.length).toBeGreaterThan(0);

    // Should show add hadith link for admin
    const addHadithLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/hadiths/add");
    expect(addHadithLinks.length).toBeGreaterThan(0);
  });

  it("shows sign out button but no admin link when user is authenticated as regular user", () => {
    // Update mock to return authenticated regular user
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Test User" } as MockUser,
      profile: { role: "USER" } as MockProfile,
      loading: false,
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
    });

    render(<Header />);

    // Should show sign out buttons (desktop and mobile) when authenticated
    const signOutButtons = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.className.includes("bg-orange-50") ||
          button.className.includes("dark:bg-orange-700")
      );
    expect(signOutButtons.length).toBeGreaterThan(0);

    // Should not show add hadith link for regular user
    const addHadithLinks = screen
      .queryAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/hadiths/add");
    expect(addHadithLinks).toHaveLength(0);
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
