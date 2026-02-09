import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { mockHadiths } from "@/__tests__/mocks/mockHadiths";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

type Transmitter = {
  id: string;
  name_fr: string;
  slug: string;
  hadithCount: number;
  name_ar: string | null;
  name_en: string | null;
};

const locale = "fr" as const;

const transmitter: Transmitter = {
  id: "t1",
  name_fr: "Transmitter One",
  slug: "transmitter-one",
  hadithCount: 3,
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
  getTransmitterWithHadiths: vi.fn(async () => ({
    transmitter,
    hadiths: mockHadiths,
  })),
  getTransmitterBySlug: vi.fn(async () => transmitter),
  getAllTransmitters: vi.fn(async () => [transmitter]),
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

describe("Transmitter detail page", () => {
  it("renders the list layout for a transmitter", async () => {
    const { default: PageByTransmitter } =
      await import("@/app/[locale]/transmitters/[slug]/page");

    const ui = await PageByTransmitter({
      params: Promise.resolve({ slug: "transmitter-one", locale }),
    });

    renderWithI18n(ui);

    expect(screen.getByTestId("list-layout")).toHaveTextContent(
      "Localized Name"
    );
  });

  it("calls notFound when transmitter is missing", async () => {
    const { default: PageByTransmitter } =
      await import("@/app/[locale]/transmitters/[slug]/page");
    const services = await import("@/src/services/services");

    vi.mocked(services.getTransmitterWithHadiths).mockResolvedValueOnce({
      transmitter: null,
      hadiths: [],
    });

    await PageByTransmitter({
      params: Promise.resolve({ slug: "missing", locale }),
    });

    expect(notFoundMock).toHaveBeenCalled();
  });
});
