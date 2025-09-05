import { render, screen } from "@testing-library/react";
import { Matn_en } from "./Matn_en";
import { describe, it, expect } from "vitest";

describe("Matn_en", () => {
  it("affiche le texte anglais correctement", () => {
    render(<Matn_en matn="This is the hadith text in English." />);
    expect(
      screen.getByText("This is the hadith text in English.")
    ).toBeInTheDocument();
  });

  it("met en surbrillance le texte si highlight est fourni", () => {
    render(
      <Matn_en
        matn="Prophet said: Peace be upon him."
        highlight="Peace"
      />
    );
    const mark = screen.getByText("Peace");
    expect(mark.tagName).toBe("MARK");
  });
});
