import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { mockHadith } from "@/__tests__/mocks/mockHadith";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

const locale = "fr" as const;

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));

const notFoundMock = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

vi.mock("@/src/services/services", () => ({
  getHadithByNumero: vi.fn(async () => mockHadith),
}));

vi.mock("@/app/[locale]/hadith/utils/getHadithNavigation", () => ({
  getHadithNavigation: vi.fn(async () => ({
    previousNumero: 120,
    nextNumero: 124,
  })),
}));

vi.mock("@/src/utils/getNarratorName", () => ({
  getNarratorName: () => "Narrator",
}));

type HadithProps = {
  hadith: { numero: number };
};

vi.mock("@/src/ui/hadith/Hadith/Hadith", () => ({
  Hadith: ({ hadith }: HadithProps) => (
    <div data-testid="hadith">{hadith.numero}</div>
  ),
}));

vi.mock("@/src/ui/hadith/Hadith/HadithSkeleton", () => ({
  HadithSkeleton: () => <div data-testid="hadith-skeleton" />,
}));

type HadithNavigationProps = {
  previousNumero: number | null;
  nextNumero: number | null;
};

vi.mock("@/app/[locale]/hadith/[numero]/HadithNavigation", () => ({
  HadithNavigation: ({ previousNumero, nextNumero }: HadithNavigationProps) => (
    <div data-testid="hadith-nav">
      {previousNumero}-{nextNumero}
    </div>
  ),
}));

describe("Hadith page", () => {
  it("renders the title and navigation", async () => {
    const { default: PageByNumero } =
      await import("@/app/[locale]/hadith/[numero]/page");

    const ui = await PageByNumero({
      params: Promise.resolve({ numero: "123", locale }),
    });

    renderWithI18n(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "title"
    );
    expect(screen.getByTestId("hadith")).toHaveTextContent("123");
    expect(screen.getByTestId("hadith-nav")).toHaveTextContent("120-124");
  });

  it("calls notFound when hadith is missing", async () => {
    const { default: PageByNumero } =
      await import("@/app/[locale]/hadith/[numero]/page");
    const services = await import("@/src/services/services");

    vi.mocked(services.getHadithByNumero).mockResolvedValueOnce(null);

    await PageByNumero({
      params: Promise.resolve({ numero: "404", locale }),
    });

    expect(notFoundMock).toHaveBeenCalled();
  });
});
