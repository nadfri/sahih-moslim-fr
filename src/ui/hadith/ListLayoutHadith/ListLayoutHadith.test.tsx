import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { mockHadiths } from "@/src/mocks/mockHadiths";
import { ListLayoutHadith } from "./ListLayoutHadith";

// Mock useAuth hook
const mockUseAuth = vi.fn(() => ({
  user: null,
  profile: null,
  loading: false,
  signInWithGitHub: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ListLayoutHadith", () => {
  it("renders title, name, hadith count and hadiths", () => {
    renderWithI18n(
      <ListLayoutHadith
        title="Chapter"
        name="Faith"
        hadiths={mockHadiths}
      />
    );
    // Title and name
    expect(screen.getByText("Chapter")).toBeInTheDocument();
    expect(screen.getByText("Faith")).toBeInTheDocument();
    // Hadith count (BadgeNumberOfHadith renders the number)
    expect(screen.getByText("102")).toBeInTheDocument();
    // Hadiths content
    expect(screen.getByText("Premier hadith")).toBeInTheDocument();
    expect(screen.getByText("Deuxième hadith")).toBeInTheDocument();
  });
});
