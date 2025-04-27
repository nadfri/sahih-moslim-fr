import { describe, expect, it } from "vitest";

import { cleanArabicText } from "./cleanArabicText";

describe("cleanArabicText", () => {
  it("should return empty string for empty input", () => {
    expect(cleanArabicText("")).toBe("");
  });

  it("should remove zero-width characters", () => {
    const input = "مرح\u200Bبا\u200F";
    expect(cleanArabicText(input)).toBe("مرحبا");
  });

  it("should remove Tatweel characters", () => {
    const input = "مرــــــحبــــــا";
    expect(cleanArabicText(input)).toBe("مرحبا");
  });

  it("should remove specific quotes", () => {
    const input = `«مرح'با»"`;
    expect(cleanArabicText(input)).toBe("مرحبا");
  });

  it("should normalize non-breaking space to standard space", () => {
    const input = "مرح\u00A0با";
    expect(cleanArabicText(input)).toBe("مرح با");
  });

  it("should collapse multiple consecutive spaces", () => {
    const input = "مرح    با   ";
    expect(cleanArabicText(input)).toBe("مرح با");
  });

  it("should remove space before target punctuation marks", () => {
    const input = "مرحبا ، كيف حالك ؟";
    expect(cleanArabicText(input)).toBe("مرحبا، كيف حالك؟");
  });

  it("should trim leading and trailing whitespace", () => {
    const input = "   مرحبا   ";
    expect(cleanArabicText(input)).toBe("مرحبا");
  });

  it("should handle a complex mixed case", () => {
    const input = `  «مر\u200Bحب\u0640ا   ،  كيف حالك ؟»  `;
    expect(cleanArabicText(input)).toBe("مرحبا، كيف حالك؟");
  });

  it("should leave normal Arabic text untouched", () => {
    const input = "مرحبا بك في باريس.";
    expect(cleanArabicText(input)).toBe("مرحبا بك في باريس.");
  });

  it("should handle only punctuation", () => {
    const input = " ؟ ";
    expect(cleanArabicText(input)).toBe("؟");
  });

  it("should handle only Tatweel and zero-width", () => {
    const input = "\u0640\u200B\u200F";
    expect(cleanArabicText(input)).toBe("");
  });

  it("should not remove Arabic diacritics or letters", () => {
    const input = "مَرْحَبًا";
    expect(cleanArabicText(input)).toBe("مَرْحَبًا");
  });
});
