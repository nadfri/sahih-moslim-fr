// Tests for ChaptersPage
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import frMessages from "@/src/messages/fr.json";
import type { Mock } from "vitest";

// Mock getAllChapters
vi.mock("@/src/services/services", () => ({
  getAllChapters: vi.fn().mockResolvedValue([
    { slug: "intro", name_fr: "Introduction", hadithCount: 5 },
    { slug: "faith", name_fr: "Faith", hadithCount: 12 },
  ]),
}));

describe("ChaptersPage", () => {
  it("renders chapters list", async () => {
    // Ensure i18n: map keys to FR messages for 'chapters'
    const mockedGetTranslations = getTranslations as unknown as Mock;
    const chaptersDict = (
      frMessages as unknown as {
        chapters: Record<string, string>;
      }
    ).chapters;
    mockedGetTranslations.mockReturnValue((key: string) => {
      return chaptersDict[key] ?? key;
    });

    // Dynamically import the server component and render it as a promise
    const { default: ChaptersPage } = await import("./page");
    // Provide params as a Promise with locale (Next.js 15 behavior)
    const params = Promise.resolve({ locale: "fr" as Locale });
    // Render the async server component using .then
    await ChaptersPage({
      params,
    } as { params: Promise<{ locale: Locale }> }).then((node) => {
      render(<>{node}</>);
    });
    // Check for expected content
    // Title comes from i18n: messages.chapters.title = "Liste des Chapitres"
    expect(await screen.findByText("Liste des Chapitres")).toBeInTheDocument();

    expect(await screen.findByText("Introduction")).toBeInTheDocument();
    expect(await screen.findByText("Faith")).toBeInTheDocument();
    expect(await screen.findByText("5 Hadiths")).toBeInTheDocument();
    expect(await screen.findByText("12 Hadiths")).toBeInTheDocument();
  });
});
