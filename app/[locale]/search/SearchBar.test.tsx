import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { HadithType, ItemType } from "@/src/types/types";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

vi.mock("@/src/hooks/useSearch", () => {
  let state = {
    results: [],
    isLoading: false,
    hasSearched: false,
  };
  return {
    useSearch: () => state,
    __setMockSearch: (v: typeof state) => {
      state = v;
    },
    __resetMockSearch: () => {
      state = { results: [], isLoading: false, hasSearched: false };
    },
  };
});

vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    loading: false,
    signInWithGitHub: vi.fn(),
    signOut: vi.fn(),
  }),
}));

type MockHadithProps = { hadith?: HadithType };
vi.mock("@/src/ui/hadith/Hadith/Hadith", () => {
  const MockHadith = (props: MockHadithProps) => {
    return React.createElement("div", null, props.hadith?.matn_fr ?? "");
  };
  return { Hadith: MockHadith };
});

type SearchSelectProps = {
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
};
vi.mock("@/src/ui/inputs/SearchSelect/SearchSelect", () => {
  const SearchSelect = (props: SearchSelectProps) => {
    const onChange = props.onChange ?? (() => {});
    return React.createElement(
      "div",
      null,
      React.createElement("input", { placeholder: props.placeholder ?? "" }),
      React.createElement(
        "div",
        null,
        props.options.map((o) =>
          React.createElement(
            "button",
            {
              key: o,
              type: "button",
              onClick: () => onChange(o),
            },
            o
          )
        )
      )
    );
  };
  return { SearchSelect };
});

type MultiSelectProps = {
  options: string[];
  selected?: string[];
  onChange?: (v: string[]) => void;
  placeholder?: string;
};
vi.mock("@/src/ui/forms/inputs/MultiSelect/MultiSelect", () => {
  const MultiSelect = (props: MultiSelectProps) => {
    const onChange = props.onChange ?? (() => {});
    return React.createElement(
      "div",
      null,
      React.createElement("input", { placeholder: props.placeholder ?? "" }),
      React.createElement(
        "div",
        null,
        props.options.map((o) =>
          React.createElement(
            "button",
            {
              key: o,
              type: "button",
              onClick: () => onChange([o]),
            },
            o
          )
        )
      )
    );
  };
  return { MultiSelect };
});

// @ts-expect-error - test-only dynamic import
const { __setMockSearch, __resetMockSearch } = await import(
  "@/src/hooks/useSearch"
);

import { SearchBar } from "./SearchBar";

const makeItem = (name: string): ItemType => ({
  id: name,
  name_fr: name,
  slug: name,
  name_ar: name,
  name_en: name,
});

describe("SearchBar", () => {
  const hadiths: HadithType[] = [
    {
      id: "1",
      numero: 100,
      matn_fr: "Le Prophète a dit ...",
      matn_ar: "قَالَ النَّبِي ...",
      chapter: makeItem("Chapitre 1"),
      mentionedSahabas: [makeItem("Abu Bakr")],
      isnadTransmitters: [makeItem("Yahya")],
    },
  ];

  const sahabas = ["Abu Bakr", "Omar"];
  const transmitters = ["Yahya", "Zayd"];

  beforeEach(() => {
    __resetMockSearch();
  });

  it("displays initial placeholder", () => {
    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
        onSearchResults={vi.fn()}
      />
    );
    expect(screen.getByPlaceholderText(/3 lettres min/i)).toBeInTheDocument();
  });

  it("displays search mode buttons", () => {
    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
        onSearchResults={vi.fn()}
      />
    );
    expect(
      screen.getByRole("button", { name: /Par mot/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Par Compagnon/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Par Transmetteur/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Par Numéro/i })
    ).toBeInTheDocument();
  });

  it("calls onSearchResults when search changes", async () => {
    const onSearchResults = vi.fn();
    __setMockSearch({
      results: hadiths,
      isLoading: false,
      hasSearched: true,
    });

    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
        onSearchResults={onSearchResults}
      />
    );

    await waitFor(() => {
      expect(onSearchResults).toHaveBeenCalled();
    });
  });

  it("allows changing search mode to sahaba", async () => {
    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
        onSearchResults={vi.fn()}
      />
    );

    const sahabaBtn = screen.getByRole("button", { name: /Par Compagnon/i });
    await userEvent.click(sahabaBtn);

    expect(
      screen.getByPlaceholderText(/Choisir un ou plusieurs compagnons/i)
    ).toBeInTheDocument();
  });

  it("allows changing search mode to transmitter", async () => {
    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
        onSearchResults={vi.fn()}
      />
    );

    const transmitterBtn = screen.getByRole("button", {
      name: /Par Transmetteur/i,
    });
    await userEvent.click(transmitterBtn);

    expect(
      screen.getByPlaceholderText(/Choisir un ou plusieurs transmetteurs/i)
    ).toBeInTheDocument();
  });

  it("allows changing search mode to numero", async () => {
    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
        onSearchResults={vi.fn()}
      />
    );

    const numeroBtn = screen.getByRole("button", { name: /Par Numéro/i });
    await userEvent.click(numeroBtn);

    expect(
      screen.getByPlaceholderText(/Numéro du hadith/i)
    ).toBeInTheDocument();
  });
});
