// Tests for ChaptersPage
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";

vi.mock("@/src/services/services", () => ({
  getAllChapters: async () => [
    { slug: "intro", name_fr: "Introduction", hadithCount: 5 },
    { slug: "faith", name_fr: "Faith", hadithCount: 12 },
  ],
}));

describe("ChaptersPage", () => {
  // Mock simple de getTranslations
  vi.mock("next-intl/server", () => ({
    getTranslations: async () => (key: string) => {
      const translations: Record<string, string> = {
        title: "Liste des Chapitres",
      };
      return translations[key] || key;
    },
    setRequestLocale: vi.fn(),
  }));
  it("affiche la page et les chapitres", async () => {
    const { default: ChaptersPage } = await import("./page");
    const params = Promise.resolve({ locale: "fr" as const });
    const node = await ChaptersPage({ params });
    render(
      <NextIntlClientProvider
        locale="fr"
        messages={{}}
      >
        {node}
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Liste des Chapitres")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
  });
});
