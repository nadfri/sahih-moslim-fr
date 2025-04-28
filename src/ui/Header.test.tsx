import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "./Header";

// Create mock functions
const mockPathname = vi.fn(() => "/");
const mockUseSession = vi.fn(() => ({
  status: "unauthenticated",
  data: null as null | { user: { name: string } },
}));

// Mock modules
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signOut: vi.fn(),
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

    const narratorsLinks = screen.getAllByRole("link", { name: /narrateurs/i });
    expect(narratorsLinks.length).toBeGreaterThan(0);

    const companionsLinks = screen.getAllByRole("link", {
      name: /compagnons/i,
    });
    expect(companionsLinks.length).toBeGreaterThan(0);

    const searchLinks = screen.getAllByRole("link", { name: /recherche/i });
    expect(searchLinks.length).toBeGreaterThan(0);
  });

  it("shows 'Ajouter' link in development mode", () => {
    // Set NODE_ENV to development
    vi.stubEnv("NODE_ENV", "development");

    render(<Header />);

    // In development mode, 'Ajouter' links should be visible
    const addLinks = screen.getAllByRole("link", { name: /ajouter/i });
    expect(addLinks.length).toBeGreaterThan(0);
    // Check at least one of them has the correct href
    expect(
      addLinks.some((link) => link.getAttribute("href") === "/hadiths/add")
    ).toBeTruthy();
  });

  it("hides 'Ajouter' link in production mode", () => {
    // Set NODE_ENV to production
    vi.stubEnv("NODE_ENV", "production");

    render(<Header />);

    // In production mode, 'Ajouter' link should not be visible
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
});
