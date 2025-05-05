import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { HadithType } from "@/src/types/types";
import { ListLayoutHadith } from "./ListLayoutHadith";

const mockHadiths: HadithType[] = [
  {
    id: "1",
    numero: 101,
    matn_fr: "Premier hadith",
    matn_ar: "أول حديث",
    isnad: null,
    chapter: {
      id: "ch1",
      title: "Test Chapter",
      slug: "test-chapter",
      hadithCount: 10,
    },
    narrator: {
      id: "n1",
      name: "Narrateur 1",
      slug: "narrateur-1",
      hadithCount: 5,
      nameArabic: null,
    },
    mentionedSahabas: [],
  },
  {
    id: "2",
    numero: 102,
    matn_fr: "Deuxième hadith",
    matn_ar: "ثاني حديث",
    isnad: null,
    chapter: {
      id: "ch1",
      title: "Test Chapter",
      slug: "test-chapter",
      hadithCount: 10,
    },
    narrator: {
      id: "n2",
      name: "Narrateur 2",
      slug: "narrateur-2",
      hadithCount: 3,
      nameArabic: null,
    },
    mentionedSahabas: [],
  },
];

describe("ListLayoutHadith", () => {
  it("renders title, name, hadith count and hadiths", () => {
    render(
      <ListLayoutHadith
        title="Chapter"
        name="Faith"
        hadiths={mockHadiths}
      />
    );
    // Title and name
    expect(screen.getByText("Chapter")).toBeInTheDocument();
    expect(screen.getByText("Faith")).toBeInTheDocument();
    // Hadith count (BadgeNumberOfHadith renders the number)
    expect(screen.getByText("102")).toBeInTheDocument();
    // Hadiths content
    expect(screen.getByText("Premier hadith")).toBeInTheDocument();
    expect(screen.getByText("Deuxième hadith")).toBeInTheDocument();
    expect(screen.getByText("Narrateur 1")).toBeInTheDocument();
    expect(screen.getByText("Narrateur 2")).toBeInTheDocument();
  });
});
