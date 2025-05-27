import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { mockHadiths } from "@/src/utils/mocks/mockHadiths";
import SearchPage from "./page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => new URLSearchParams(),
}));

// Mock services
vi.mock("@/src/services/services", () => ({
  getAllHadiths: vi.fn().mockResolvedValue(mockHadiths),
  getNarratorNames: vi
    .fn()
    .mockResolvedValue(["Omar ibn al-Khattab", "Abu Bakr"]),
  getSahabaNames: vi
    .fn()
    .mockResolvedValue(["Omar ibn al-Khattab", "Abu Bakr"]),
  getTransmitterNames: vi.fn().mockResolvedValue(["Malik", "Nafi"]),
}));

describe("SearchPage", () => {
  it("renders initial prompt before searching", async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(
        /Veuillez saisir vos critères et cliquer sur "Rechercher"./i
      )
    ).toBeInTheDocument();
  });

  it("performs word search and displays matching hadith and count", async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Rechercher par mot/);
    await userEvent.type(input, "Premier");
    await userEvent.click(screen.getByRole("button", { name: /Rechercher/ }));

    // Check that results badge appears
    await waitFor(() => {
      const badge = screen.getByText((content) => {
        return content.includes("Hadith") && /\d+/.test(content);
      });
      expect(badge).toBeInTheDocument();
    });
  });

  it("performs sahaba search and displays matching hadith", async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    // Switch to sahaba mode
    await userEvent.click(
      screen.getByRole("radio", { name: /Par Compagnons/ })
    );

    // The actual placeholder text from the HTML output
    const sahabaInput = screen.getByPlaceholderText(
      /Choisir un ou plusieurs rapporteurs/
    );
    await userEvent.type(sahabaInput, "Omar");
    await userEvent.click(screen.getByRole("button", { name: /Rechercher/ }));

    // Check that results badge appears
    await waitFor(() => {
      const badge = screen.getByText((content) => {
        return content.includes("Hadith") && /\d+/.test(content);
      });
      expect(badge).toBeInTheDocument();
    });
  });

  it("performs transmitter search and displays matching hadith", async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    // Switch to transmitter mode
    await userEvent.click(
      screen.getByRole("radio", { name: /Par Transmetteurs/ })
    );

    // The actual placeholder text from the HTML output
    const transmitterInput = screen.getByPlaceholderText(
      /Choisir un ou plusieurs transmetteurs/
    );
    await userEvent.type(transmitterInput, "Malik");
    await userEvent.click(screen.getByRole("button", { name: /Rechercher/ }));

    // Check that results badge appears
    await waitFor(() => {
      const badge = screen.getByText((content) => {
        return content.includes("Hadith") && /\d+/.test(content);
      });
      expect(badge).toBeInTheDocument();
    });
  });

  it("shows no results message when no hadiths match", async () => {
    render(<SearchPage />);

    await waitFor(() => {
      expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Rechercher par mot/);
    await userEvent.type(input, "MotInexistant12345");
    await userEvent.click(screen.getByRole("button", { name: /Rechercher/ }));

    // The actual no results text from the HTML output
    await waitFor(() => {
      expect(
        screen.getByText(/Aucun hadith ne correspond à votre recherche/)
      ).toBeInTheDocument();
      expect(screen.getByText(/0.*Hadith/)).toBeInTheDocument();
    });
  });
});
