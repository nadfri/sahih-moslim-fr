import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Locale } from "next-intl";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

// Create mocks using vi.hoisted to ensure they're available before imports
const mockUse = vi.hoisted(() => vi.fn());

// Mock React.use hook
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    use: mockUse,
  };
});

// Mock next-intl/server
vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/fr/unauthorized"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

// Import after mocks are set up
import Page from "./page";

describe("UnauthorizedPage", () => {
  it("renders unauthorized message", () => {
    // Configure the use mock to return the resolved params
    mockUse.mockReturnValue({ locale: "fr" as Locale });

    const params = Promise.resolve({ locale: "fr" as Locale });

    renderWithI18n(<Page params={params} />);

    expect(screen.getByText(/accès non autorisé/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Vous n'avez pas les autorisations nécessaires/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Seuls les administrateurs/i)).toBeInTheDocument();
    expect(screen.getByText(/Retour à l'accueil/i)).toBeInTheDocument();
  });
});
