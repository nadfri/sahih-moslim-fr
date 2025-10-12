import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { HadithType, ItemType } from "@/src/types/types";
import { renderWithI18n } from "@/__tests__/renderWithI18n";

// Hoist-safe mock factory for the useSearch hook. It exports setter functions
// so tests can control the hook return value reliably.
type MockSearchState = {
  results: HadithType[];
  isLoading: boolean;
  hasSearched: boolean;
  // allow extra fields if needed by hook
  [key: string]: unknown;
};

vi.mock("@/src/hooks/useSearch", () => {
  let state: MockSearchState = {
    results: [],
    isLoading: false,
    hasSearched: false,
  };
  return {
    useSearch: () => state,
    __setMockSearch: (v: MockSearchState) => {
      state = v;
    },
    __resetMockSearch: () => {
      state = { results: [], isLoading: false, hasSearched: false };
    },
  };
});

// Mock useAuth to avoid requiring AuthProvider for nested components
const mockUseAuth = vi.fn(() => ({
  user: null,
  profile: null,
  loading: false,
  signInWithGitHub: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@/src/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

// Stub the Hadith component to avoid rendering nested components that require
// context (ActionsBtns -> useAuth). This makes the DOM simple and stable for
// text-based assertions.
type MockHadithProps = { hadith?: HadithType };
vi.mock("@/src/ui/hadith/Hadith/Hadith", () => {
  const MockHadith = (props: MockHadithProps) => {
    return React.createElement("div", null, props.hadith?.matn_fr ?? "");
  };
  return { Hadith: MockHadith };
});

// Stub SearchSelect: renders an input-like element with the placeholder and
// a list of option buttons that call onChange when clicked.
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
      // render an element with the placeholder so tests can find it
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

// Stub MultiSelect similarly
type MultiSelectProps = {
  options: string[];
  selected?: string[];
  onChange?: (v: string[]) => void;
  placeholder?: string;
};
vi.mock("@/src/ui/inputs/MultiSelect/MultiSelect", () => {
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

// Dynamic import to access the exported mock control functions from the mocked module.
// @ts-expect-error - test-only dynamic import
const { __setMockSearch, __resetMockSearch } = await import(
  "@/src/hooks/useSearch"
);

// Import the component after mocks are defined
import { SearchBar } from "./SearchBar";

const makeItem = (name: string): ItemType => ({
  id: name,
  name_fr: name,
  slug: name,
});

describe("SearchBar", () => {
  const hadiths: HadithType[] = [
    {
      id: "1",
      numero: 100,
      matn_fr: "Le Prophète a dit ...",
      matn_ar: "قَالَ النَّبِي ...",
      chapter: makeItem("Chapitre 1"),
      mentionedSahabas: [makeItem("Abu Bakr")],
      isnadTransmitters: [makeItem("Yahya")],
    },
    {
      id: "2",
      numero: 200,
      matn_fr: "Un autre hadith ...",
      matn_ar: "حديث آخر ...",
      chapter: makeItem("Chapitre 2"),
      mentionedSahabas: [makeItem("Omar")],
      isnadTransmitters: [makeItem("Zayd")],
    },
  ];

  const sahabas = ["Abu Bakr", "Omar"];
  const transmitters = ["Yahya", "Zayd"];

  beforeEach(() => {
    // Reset the mock hook state before each test
    __resetMockSearch();
  });

  it("affiche le placeholder initial", () => {
    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    expect(screen.getByPlaceholderText(/3 lettres min/i)).toBeInTheDocument();
  });

  it("recherche par mot (mot clé)", async () => {
    __setMockSearch({
      results: [hadiths[0]],
      isLoading: false,
      hasSearched: true,
    });

    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const input = screen.getByPlaceholderText(/3 lettres min/i);
    await userEvent.type(input, "Proph");

    await waitFor(() => {
      const nodes = screen.getAllByText((_content, node) => {
        return (
          !!node &&
          typeof node.textContent === "string" &&
          node.textContent.includes("Le Prophète a dit")
        );
      });
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  it("recherche par sahaba", async () => {
    __setMockSearch({
      results: [hadiths[0]],
      isLoading: false,
      hasSearched: true,
    });

    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const modeBtn = screen.getByRole("button", { name: /Par Compagnon/i });
    await userEvent.click(modeBtn);
    const select = screen.getByPlaceholderText(
      /Choisir un ou plusieurs compagnons/i
    );
    await userEvent.click(select);
    await userEvent.click(screen.getByText("Abu Bakr"));

    await waitFor(() => {
      const nodes = screen.getAllByText((_content, node) => {
        return (
          !!node &&
          typeof node.textContent === "string" &&
          node.textContent.includes("Le Prophète a dit")
        );
      });
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  it("recherche par transmetteur", async () => {
    __setMockSearch({
      results: [hadiths[0]],
      isLoading: false,
      hasSearched: true,
    });

    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const modeBtn = screen.getByRole("button", { name: /Par Transmetteur/i });
    await userEvent.click(modeBtn);
    const select = screen.getByPlaceholderText(
      /Choisir un ou plusieurs transmetteurs/i
    );
    await userEvent.click(select);
    await userEvent.click(screen.getByText("Yahya"));

    await waitFor(() => {
      const nodes = screen.getAllByText((_content, node) => {
        return (
          !!node &&
          typeof node.textContent === "string" &&
          node.textContent.includes("Le Prophète a dit")
        );
      });
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  it("recherche par numéro", async () => {
    __setMockSearch({
      results: [hadiths[1]],
      isLoading: false,
      hasSearched: true,
    });

    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const modeBtn = screen.getByRole("button", { name: /Par Numéro/i });
    await userEvent.click(modeBtn);
    const input = screen.getByPlaceholderText(/Numéro du hadith/i);
    await userEvent.type(input, "200");

    await waitFor(() => {
      const nodes = screen.getAllByText((_content, node) => {
        return (
          !!node &&
          typeof node.textContent === "string" &&
          node.textContent.includes("Un autre hadith")
        );
      });
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  it("affiche un message si aucun résultat", async () => {
    __setMockSearch({ results: [], isLoading: false, hasSearched: true });

    renderWithI18n(
      <SearchBar
        sahabas={sahabas}
        transmitters={transmitters}
      />
    );
    const input = screen.getByPlaceholderText(/3 lettres min/i);
    await userEvent.type(input, "xyzxyz");

    await waitFor(() => {
      // Allow the ellipsis/spacing variance by matching a substring
      expect(screen.getByText(/Aucun hadith trouv/i)).toBeInTheDocument();
    });
  });
});
