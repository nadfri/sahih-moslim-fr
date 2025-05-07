import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { HadithType } from "@/src/types/types";
import { mockHadiths } from "@/src/utils/mocks/mockHadiths";
import { SearchBar } from "./SearchBar";

// Mock next/navigation useSearchParams to avoid null errors
vi.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => new URLSearchParams(),
}));

// Derive options from mock data
const hadiths: HadithType[] = mockHadiths;
const narrators = Array.from(new Set(mockHadiths.map((h) => h.narrator.name)));
const sahabas = Array.from(
  new Set(mockHadiths.flatMap((h) => h.mentionedSahabas.map((s) => s.name)))
);

describe("SearchBar", () => {
  it("renders initial prompt before searching", () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
      />
    );
    expect(
      screen.getByText(
        /Veuillez saisir vos critères et cliquer sur "Rechercher"./i
      )
    ).toBeInTheDocument();
  });

  it("performs word search and displays matching hadith and count", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
      />
    );
    const input = screen.getByPlaceholderText(/Rechercher par mot/);
    // Search for 'Premier'
    await userEvent.type(input, "Premier");
    await userEvent.click(screen.getByRole("button", { name: /Rechercher/ }));
    // Expect French text appears and badge shows '1 Hadith'
    expect(screen.getByText(/Premier/)).toBeInTheDocument();
    expect(screen.getByText(/1\s*Hadith/)).toBeInTheDocument();
  });

  it("performs narrator search and displays matching hadith", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
      />
    );
    // switch to narrator mode
    await userEvent.click(screen.getByRole("radio", { name: /Par Narrateur/ }));
    const narratorInput = screen.getByPlaceholderText(/Choisir un narrateur/);
    // Type first narrator name
    await userEvent.type(narratorInput, narrators[0]);
    await userEvent.click(screen.getByRole("button", { name: /Rechercher/ }));
    // Expect hadith with this narrator appears and badge shows count
    const expectedHadith = mockHadiths.find(
      (h) => h.narrator.name === narrators[0]
    );
    expect(
      screen.getByText(new RegExp(expectedHadith?.matn_fr || ""))
    ).toBeInTheDocument();
    expect(screen.getByText(/1\s*Hadith/)).toBeInTheDocument();
  });

  it("performs sahaba search and displays matching hadith", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
      />
    );
    // switch to sahaba mode
    await userEvent.click(
      screen.getByRole("radio", { name: /Par Compagnons/ })
    );
    // open the dropdown list
    const toggleButton = screen.getByLabelText("Ouvrir la liste");
    await userEvent.click(toggleButton);
    // click the first sahaba option (li elements have no role)
    const optionItem = screen.getByText(sahabas[0]);
    await userEvent.click(optionItem);
    await userEvent.click(screen.getByRole("button", { name: /Rechercher/ }));
    const expectedHadith2 = mockHadiths.find((h) =>
      h.mentionedSahabas.some((s) => s.name === sahabas[0])
    );
    expect(
      screen.getByText(new RegExp(expectedHadith2?.matn_fr || ""))
    ).toBeInTheDocument();
    expect(screen.getByText(/1\s*Hadith/)).toBeInTheDocument();
  });
});
