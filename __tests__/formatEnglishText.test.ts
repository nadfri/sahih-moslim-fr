import { describe, expect, it } from "vitest";
import {
  formatEnglishText,
  formatHadithNarration,
  splitIntoParagraphs,
  containsEnglish,
} from "../src/ui/hadith/matns/utils/formatEnglishText";

describe("formatEnglishText", () => {
  it("should format basic English text with proper spacing", () => {
    const input =
      "It is reported on the authority of Anas. The Prophet said: Something.";
    const result = formatEnglishText(input);

    expect(result).toContain("\n\n");
    expect(result).toContain("The Prophet said:");
  });

  it("should add paragraph breaks before narration patterns", () => {
    const input =
      "Some text. It is reported on the authority of Abu Bakr that...";
    const result = formatEnglishText(input);

    expect(result).toMatch(/\n\nIt is reported on the authority/);
  });

  it("should add paragraph breaks before Prophet's speech", () => {
    const input =
      "He came to the Prophet. The Messenger of Allah said: Peace be upon you.";
    const result = formatEnglishText(input);

    expect(result).toMatch(/\n\nThe Messenger of Allah.*said:/);
  });

  it("should add breaks before dialogue responses", () => {
    const input =
      "The Prophet asked him something. He (the bedouin) said: I understand.";
    const result = formatEnglishText(input);

    expect(result).toMatch(/\n\nHe \(the bedouin\) said:/);
  });

  it("should handle empty or null input", () => {
    expect(formatEnglishText("")).toBe("");
    expect(formatEnglishText("   ")).toBe("");
  });

  it("should normalize multiple spaces", () => {
    const input = "Text  with    multiple   spaces.";
    const result = formatEnglishText(input);

    expect(result).toBe("Text with multiple spaces.");
  });

  it("should clean up multiple line breaks", () => {
    const input = "Text\n\n\n\nMore text";
    const result = formatEnglishText(input);

    // The function normalizes spaces which converts line breaks to spaces
    expect(result).toBe("Text More text");
  });
});

describe("formatHadithNarration", () => {
  it("should convert Islamic expressions to symbols", () => {
    const input =
      "The Prophet (may peace of Allah be upon him) said something.";
    const result = formatHadithNarration(input);

    expect(result).toContain("ﷺ");
    expect(result).not.toContain("may peace of Allah be upon him");
  });

  it("should convert praise expressions", () => {
    const input = "Abu Bakr (may Allah be pleased with him) reported.";
    const result = formatHadithNarration(input);

    expect(result).toContain("رضي الله عنه");
    expect(result).not.toContain("may Allah be pleased with him");
  });

  it("should handle multiple Islamic expressions", () => {
    const input =
      "The Prophet (may peace of Allah be upon him) met Abu Bakr (may Allah be pleased with him).";
    const result = formatHadithNarration(input);

    expect(result).toContain("ﷺ");
    expect(result).toContain("رضي الله عنه");
  });

  it("should clean up spacing around Arabic symbols", () => {
    const input = "Prophet   ﷺ   said";
    const result = formatHadithNarration(input);

    expect(result).toBe("Prophet ﷺ said");
  });
});

describe("splitIntoParagraphs", () => {
  it("should split text into paragraphs by double line breaks", () => {
    const input = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.";
    const result = splitIntoParagraphs(input);

    expect(result).toHaveLength(3);
    expect(result[0]).toBe("First paragraph.");
    expect(result[1]).toBe("Second paragraph.");
    expect(result[2]).toBe("Third paragraph.");
  });

  it("should filter out empty paragraphs", () => {
    const input = "First paragraph.\n\n\n\nSecond paragraph.";
    const result = splitIntoParagraphs(input);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe("First paragraph.");
    expect(result[1]).toBe("Second paragraph.");
  });

  it("should return empty array for empty input", () => {
    expect(splitIntoParagraphs("")).toEqual([]);
    expect(splitIntoParagraphs("   ")).toEqual([]);
  });

  it("should handle single paragraph", () => {
    const input = "Just one paragraph without breaks.";
    const result = splitIntoParagraphs(input);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(input);
  });

  it("should trim whitespace from paragraphs", () => {
    const input = "  First paragraph  \n\n  Second paragraph  ";
    const result = splitIntoParagraphs(input);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe("First paragraph");
    expect(result[1]).toBe("Second paragraph");
  });
});

describe("containsEnglish", () => {
  it("should detect English text", () => {
    expect(containsEnglish("Hello world")).toBe(true);
    expect(containsEnglish("The Prophet said")).toBe(true);
    expect(containsEnglish("123 ABC")).toBe(true);
  });

  it("should detect mixed text with English", () => {
    expect(containsEnglish("Prophet ﷺ said")).toBe(true);
    expect(containsEnglish("قال النبي Prophet")).toBe(true);
  });

  it("should not detect non-English text", () => {
    expect(containsEnglish("قال رسول الله")).toBe(false);
    expect(containsEnglish("123 456")).toBe(false);
    expect(containsEnglish("ﷺ")).toBe(false);
    expect(containsEnglish("")).toBe(false);
  });

  it("should handle empty input", () => {
    expect(containsEnglish("")).toBe(false);
    expect(containsEnglish("   ")).toBe(false);
  });

  it("should handle mixed scripts", () => {
    expect(containsEnglish("العربية English")).toBe(true);
    expect(containsEnglish("Français عربي English")).toBe(true);
  });
});
