import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/__tests__/renderWithI18n";

const sahabas = ["Sahaba One"];
const transmitters = ["Transmitter One"];

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => null,
}));

vi.mock("@/src/services/services", () => ({
  getSahabaNames: vi.fn(async () => sahabas),
  getTransmitterNames: vi.fn(async () => transmitters),
}));

describe("Search page", () => {
  it("renders the title and passes data to the search container", async () => {
    const { default: SearchPage } = await import("@/app/[locale]/search/page");
    const ui = await SearchPage({ params: Promise.resolve({ locale: "fr" }) });

    renderWithI18n(ui);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Par mot" })).toBeInTheDocument();
  });
});
