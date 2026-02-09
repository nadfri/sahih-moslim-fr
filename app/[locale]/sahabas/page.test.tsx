import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";

type Item = {
  id: string;
  name_fr: string;
  slug: string;
  hadithCount: number;
};

const sahabas: Item[] = [
  { id: "s1", name_fr: "Sahaba One", slug: "sahaba-one", hadithCount: 5 },
];

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));

vi.mock("@/src/services/services", () => ({
  getAllSahabas: vi.fn(async () => sahabas),
}));

type FilteredListCardItemProps = {
  items: Item[];
  variant: string;
};

vi.mock("@/src/ui/FilteredListCardItem/FilteredListCardItem", () => ({
  FilteredListCardItem: ({ items, variant }: FilteredListCardItemProps) => (
    <div
      data-testid="filtered-list"
      data-variant={variant}
    >
      {items.length}
    </div>
  ),
}));

describe("Sahabas page", () => {
  it("renders the title and list", async () => {
    const { default: SahabasPage } =
      await import("@/app/[locale]/sahabas/page");
    const ui = await SahabasPage({
      params: Promise.resolve({ locale: "fr" }),
    });

    renderWithI18n(ui);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByTestId("filtered-list").textContent).toBe("1");
  });
});
