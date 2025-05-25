import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { highlightText } from "@/src/utils/highlightText";
import { mockHadith } from "@/src/utils/mocks/mockHadith";
import { Matn_fr } from "./Matn_fr";

// Mock the highlightText utility
vi.mock("@/src/utils/highlightText", () => ({
  highlightText: vi.fn((text: string, highlight?: string) => {
    if (!highlight) return text;
    return text.replace(
      new RegExp(highlight, "gi"),
      `<mark>${highlight}</mark>`
    );
  }),
}));

const mockedHighlightText = vi.mocked(highlightText);

describe("Matn_fr Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the French text content", () => {
    render(<Matn_fr matn={mockHadith.matn_fr} />);

    expect(screen.getByText(/Ceci est un/)).toBeInTheDocument();
    expect(screen.getByText(/de hadith en français/)).toBeInTheDocument();
  });

  it("should apply custom styling to strong elements", () => {
    const matnWithStrong = "Texte avec **mot important** dedans";

    render(<Matn_fr matn={matnWithStrong} />);

    const strongElement = screen.getByText("mot important");
    expect(strongElement).toHaveClass(
      "text-emerald-600",
      "dark:text-emerald-400",
      "font-medium"
    );
    expect(strongElement.tagName).toBe("SPAN");
  });

  it("should apply custom styling to em elements", () => {
    const matnWithEm = "Texte avec _note importante_ dedans";

    render(<Matn_fr matn={matnWithEm} />);

    const emElement = screen.getByText("note importante");
    expect(emElement).toHaveClass(
      "border-l-4",
      "rounded-md",
      "border-amber-500",
      "dark:border-amber-600",
      "bg-amber-50",
      "dark:bg-amber-900/30",
      "p-3",
      "my-4",
      "text-amber-800",
      "dark:text-amber-400",
      "italic",
      "block"
    );
    expect(emElement.tagName).toBe("EM");
  });

  it("should apply custom styling to del elements", () => {
    const matnWithDel = "Texte avec ~~texte barré~~ dedans";

    render(<Matn_fr matn={matnWithDel} />);

    const delElement = screen.getByText("texte barré");
    expect(delElement).toHaveClass(
      "text-blue-600",
      "dark:text-blue-500",
      "no-underline",
      "font-medium"
    );
    expect(delElement.tagName).toBe("DEL");
  });

  it("should call highlightText with correct parameters when highlight is provided", () => {
    render(
      <Matn_fr
        matn={mockHadith.matn_fr}
        highlight="test"
      />
    );

    expect(mockedHighlightText).toHaveBeenCalledWith(
      mockHadith.matn_fr,
      "test"
    );
    expect(mockedHighlightText).toHaveBeenCalledTimes(1);
  });

  it("should call highlightText with undefined when no highlight is provided", () => {
    render(<Matn_fr matn={mockHadith.matn_fr} />);

    expect(mockedHighlightText).toHaveBeenCalledWith(
      mockHadith.matn_fr,
      undefined
    );
    expect(mockedHighlightText).toHaveBeenCalledTimes(1);
  });

  it("should have proper container styling", () => {
    const { container } = render(<Matn_fr matn={mockHadith.matn_fr} />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "space-y-3",
      "text-gray-700",
      "dark:text-gray-300",
      "leading-relaxed",
      "text-pretty"
    );
  });

  it("should render empty content gracefully", () => {
    render(<Matn_fr matn="" />);

    expect(mockedHighlightText).toHaveBeenCalledWith("", undefined);
  });

  it("should process markdown correctly", () => {
    const matnWithMarkdown = "# Titre du hadith\n\nTexte normal avec **gras**.";

    render(<Matn_fr matn={matnWithMarkdown} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Titre du hadith"
    );
    expect(screen.getByText("gras")).toBeInTheDocument();
  });
});
