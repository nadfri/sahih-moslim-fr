import { describe, expect, it } from "vitest";

import { highlightText } from "../src/utils/highlightText";

describe("highlightText", () => {
  it("returns text unchanged when no highlight is provided", () => {
    expect(highlightText("Hello world")).toBe("Hello world");
    expect(highlightText("Text without highlight", undefined)).toBe(
      "Text without highlight"
    );
  });

  it("wraps matched text in mark tags", () => {
    expect(highlightText("Hello world", "world")).toBe(
      'Hello <mark class="bg-yellow-200">world</mark>'
    );
    expect(highlightText("The Prophet said", "Prophet")).toBe(
      'The <mark class="bg-yellow-200">Prophet</mark> said'
    );
  });

  it("handles case-insensitive matching", () => {
    expect(highlightText("Hello World", "world")).toBe(
      'Hello <mark class="bg-yellow-200">World</mark>'
    );
    expect(highlightText("PROPHÈTE", "prophète")).toBe(
      '<mark class="bg-yellow-200">PROPHÈTE</mark>'
    );
  });

  it("highlights multiple occurrences", () => {
    expect(highlightText("test test test", "test")).toBe(
      '<mark class="bg-yellow-200">test</mark> <mark class="bg-yellow-200">test</mark> <mark class="bg-yellow-200">test</mark>'
    );
  });

  it("escapes special regex characters", () => {
    expect(highlightText("Abu (Bakr)", "(")).toBe(
      'Abu <mark class="bg-yellow-200">(</mark>Bakr)'
    );
    expect(highlightText("Test.$pattern", ".")).toBe(
      'Test<mark class="bg-yellow-200">.</mark>$pattern'
    );
  });

  it("handles partial matches within words", () => {
    expect(highlightText("Muhammad", "ham")).toBe(
      'Mu<mark class="bg-yellow-200">ham</mark>mad'
    );
  });

  it("handles empty highlight string", () => {
    expect(highlightText("Hello world", "")).toBe("Hello world");
  });

  it("handles text with existing HTML", () => {
    expect(highlightText("Text with <strong>bold</strong>", "bold")).toBe(
      'Text with <strong><mark class="bg-yellow-200">bold</mark></strong>'
    );
  });

  it("handles Arabic text", () => {
    expect(highlightText("النبي صلى الله عليه وسلم", "النبي")).toBe(
      '<mark class="bg-yellow-200">النبي</mark> صلى الله عليه وسلم'
    );
  });
});
