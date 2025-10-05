import { describe, it, expect } from "vitest";
import { renderWithI18n } from "@/__tests__/renderWithI18n";
import Page from "./page";

describe("Auth Error Page", () => {
  it("renders error message", async () => {
    // Mock params et searchParams comme Promises
    const params = Promise.resolve({ locale: "fr" as const });
    const searchParams = Promise.resolve({ error: "Configuration" });

    // On attend le composant async
    const jsx = await Page({ params, searchParams });
    const { findByText } = renderWithI18n(jsx);

    // Vérifie que le message d'erreur de configuration s'affiche
    expect(await findByText(/configuration/i)).toBeInTheDocument();
  });
});
