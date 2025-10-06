// Simple test for PageByChapters: only check that the chapter title is rendered
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Locale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";

// Mock getChapterWithHadiths service
vi.mock("@/src/services/services", () => ({
  getChapterWithHadiths: vi.fn().mockResolvedValue({
    chapter: { slug: "intro", name_fr: "Introduction" },
    hadiths: [],
  }),
}));

// Mock NextIntl serveur
vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
  setRequestLocale: vi.fn(),
}));

// Mock useAuth to avoid requiring AuthProvider in components rendered by the page
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

describe("PageByChapters", () => {
  it("renders chapter title", async () => {
    const { default: PageByChapters } = await import("./page");
    const params = Promise.resolve({ slug: "intro", locale: "fr" as Locale });
    await PageByChapters({ params }).then((node: React.ReactNode) => {
      render(
        <NextIntlClientProvider
          locale="fr"
          messages={{}}
        >
          {node}
        </NextIntlClientProvider>
      );
    });
    expect(await screen.findByText("Introduction")).toBeInTheDocument();
  });
});
