import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HadithType, ItemType } from "@/src/types/types";
import { SearchBar } from "./SearchBar";

// Minimal mock for ItemType
const mockItem = (name: string): ItemType => ({
  id: name.toLowerCase().replace(/\s/g, "-"),
  name,
  slug: name.toLowerCase().replace(/\s/g, "-"),
});

describe("SearchBar", () => {
  const hadiths: HadithType[] = [
    {
      id: "1",
      numero: 100,
      matn_fr: "Le Prophète a dit ...",
      matn_ar: "قال النبي ...",
      chapter: mockItem("Chapitre 1"),
      narrator: mockItem("Anas"),
      mentionedSahabas: [mockItem("Abu Bakr")],
      isnadTransmitters: [mockItem("Yahya")],
    },
    {
      id: "2",
      numero: 200,
      matn_fr: "Un autre hadith ...",
      matn_ar: "حديث آخر ...",
      chapter: mockItem("Chapitre 2"),
      narrator: mockItem("Omar"),
      mentionedSahabas: [mockItem("Omar")],
      isnadTransmitters: [mockItem("Zayd")],
    },
  ];
  const narrators = ["Anas", "Omar"];
  const sahabas = ["Abu Bakr", "Omar"];
  const transmitters = ["Yahya", "Zayd"];

  it("affiche le placeholder initial", () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    // Vérifie le placeholder initial
    expect(
      screen.getByText(/Veuillez saisir vos critères/i)
    ).toBeInTheDocument();
  });

  it("recherche par mot (mot clé)", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const input = screen.getByPlaceholderText(/3 lettres min/i);
    await userEvent.type(input, "Proph");
    await waitFor(() => {
      // Use getAllByText to avoid multiple match error, then check at least one matches
      const nodes = screen.getAllByText(
        (_content, node) =>
          !!node &&
          typeof node.textContent === "string" &&
          node.textContent.includes("Le Prophète a dit")
      );
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  it("recherche par narrateur", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const narratorRadio = screen.getByLabelText(/Par Narrateur/i);
    await userEvent.click(narratorRadio);
    const select = screen.getByPlaceholderText(/Choisir un narrateur/i);
    await userEvent.click(select);
    await userEvent.click(screen.getByText("Omar"));
    await waitFor(() => {
      expect(screen.getByText(/Un autre hadith/i)).toBeInTheDocument();
    });
  });

  it("recherche par sahaba", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const sahabaRadio = screen.getByLabelText(/Par Compagnon/i);
    await userEvent.click(sahabaRadio);
    const select = screen.getByPlaceholderText(/rapporteurs/i);
    await userEvent.click(select);
    await userEvent.click(screen.getByText("Abu Bakr"));
    await waitFor(() => {
      const nodes = screen.getAllByText(
        (_content, node) =>
          !!node &&
          typeof node.textContent === "string" &&
          node.textContent.includes("Le Prophète a dit")
      );
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  it("recherche par transmetteur", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const transmitterRadio = screen.getByLabelText(/Par Transmetteur/i);
    await userEvent.click(transmitterRadio);
    const select = screen.getByPlaceholderText(/transmetteurs/i);
    await userEvent.click(select);
    await userEvent.click(screen.getByText("Yahya"));
    await waitFor(() => {
      const nodes = screen.getAllByText(
        (_content, node) =>
          !!node &&
          typeof node.textContent === "string" &&
          node.textContent.includes("Le Prophète a dit")
      );
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  it("recherche par numéro", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const numeroRadio = screen.getByLabelText(/Par Numéro/i);
    await userEvent.click(numeroRadio);
    const input = screen.getByPlaceholderText(/Numéro du hadith/i);
    await userEvent.type(input, "200");
    await waitFor(() => {
      expect(screen.getByText(/Un autre hadith/i)).toBeInTheDocument();
    });
  });

  it("affiche un message si aucun résultat", async () => {
    render(
      <SearchBar
        hadiths={hadiths}
        narrators={narrators}
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const input = screen.getByPlaceholderText(/3 lettres min/i);
    await userEvent.type(input, "xyzxyz");
    await waitFor(() => {
      expect(
        screen.getByText(/Aucun hadith ne correspond/i)
      ).toBeInTheDocument();
    });
  });
});
