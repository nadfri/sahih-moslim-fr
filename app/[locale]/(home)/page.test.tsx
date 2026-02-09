import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";
import { mockHadiths } from "@/__tests__/mocks/mockHadiths";

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));

vi.mock("@/src/services/services", () => ({
  getAllHadiths: vi.fn(async () => mockHadiths),
}));

vi.mock("@/app/[locale]/(home)/Descriptive/Descriptive", () => ({
  Descriptive: () => <div data-testid="descriptive" />,
}));

type ListLayoutHadithProps = {
  hadiths: unknown[];
};

vi.mock("@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith", () => ({
  ListLayoutHadith: ({ hadiths }: ListLayoutHadithProps) => (
    <div data-testid="hadith-list">{hadiths.length}</div>
  ),
}));

describe("Home page", () => {
  it("renders the title and list", async () => {
    const { default: Home } = await import("@/app/[locale]/(home)/page");
    const ui = await Home({ params: Promise.resolve({ locale: "fr" }) });

    renderWithI18n(ui);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByTestId("hadith-list").textContent).toBe(
      String(mockHadiths.length)
    );
  });
});
