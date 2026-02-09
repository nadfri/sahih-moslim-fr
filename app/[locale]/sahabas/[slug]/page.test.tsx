import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { mockHadiths } from "@/__tests__/mocks/mockHadiths";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

type Sahaba = {
  id: string;
  name_fr: string;
  slug: string;
  hadithCount: number;
  name_ar: string | null;
  name_en: string | null;
};

const locale = "fr" as const;

const sahaba: Sahaba = {
  id: "s1",
  name_fr: "Sahaba One",
  slug: "sahaba-one",
  hadithCount: 5,
  name_ar: null,
  name_en: null,
};

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));

const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

vi.mock("@/src/services/services", () => ({
  getSahabaWithHadiths: vi.fn(async () => ({
    sahaba,
    hadiths: mockHadiths,
  })),
  getSahabaBySlug: vi.fn(async () => sahaba),
  getAllSahabas: vi.fn(async () => [sahaba]),
}));

vi.mock("@/src/utils/getLocalizedName", () => ({
  getLocalizedName: () => "Localized Name",
}));

type ListLayoutHadithProps = {
  title?: string;
  name?: string;
  hadiths: unknown[];
};

vi.mock("@/src/ui/hadith/ListLayoutHadith/ListLayoutHadith", () => ({
  ListLayoutHadith: ({ title, name, hadiths }: ListLayoutHadithProps) => (
    <div data-testid="list-layout">
      <span>{title}</span>
      <span>{name}</span>
      <span>{hadiths.length}</span>
    </div>
  ),
}));

describe("Sahaba detail page", () => {
  it("renders the list layout for a sahaba", async () => {
    const { default: PageBySahabas } =
      await import("@/app/[locale]/sahabas/[slug]/page");

    const ui = await PageBySahabas({
      params: Promise.resolve({ slug: "sahaba-one", locale }),
    });

    renderWithI18n(ui);

    expect(screen.getByTestId("list-layout")).toHaveTextContent(
      "Localized Name"
    );
  });

  it("calls notFound when sahaba is missing", async () => {
    const { default: PageBySahabas } =
      await import("@/app/[locale]/sahabas/[slug]/page");
    const services = await import("@/src/services/services");

    vi.mocked(services.getSahabaWithHadiths).mockResolvedValueOnce({
      sahaba: null,
      hadiths: [],
    });

    await PageBySahabas({
      params: Promise.resolve({ slug: "missing", locale }),
    });

    expect(notFoundMock).toHaveBeenCalled();
  });
});
