import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { highlightText, highlightTextAsHTML } from "@/src/utils/highlightText";

describe("highlightText (React components)", () => {
  it("returns text unchanged when no highlight is provided", () => {
    const result = highlightText("Hello world");
    expect(result).toBe("Hello world");

    const result2 = highlightText("Text without highlight", undefined);
    expect(result2).toBe("Text without highlight");
  });

  it("returns React elements with mark tags", () => {
    const result = highlightText("Hello world", "world");
    const { container } = render(React.createElement("div", {}, result));
    expect(container.innerHTML).toContain("<mark");
    expect(container.textContent).toBe("Hello world");
  });

  it("handles case-insensitive matching", () => {
    const result = highlightText("Hello World", "world");
    const { container } = render(React.createElement("div", {}, result));
    expect(container.textContent).toBe("Hello World");
    expect(container.innerHTML).toContain("<mark");
  });
});

describe("highlightTextAsHTML (HTML strings)", () => {
  it("returns text unchanged when no highlight is provided", () => {
    expect(highlightTextAsHTML("Hello world")).toBe("Hello world");
    expect(highlightTextAsHTML("Text without highlight", undefined)).toBe(
      "Text without highlight"
    );
  });

  it("wraps matched text in mark tags", () => {
    expect(highlightTextAsHTML("Hello world", "world")).toBe(
      'Hello <mark class="bg-yellow-200">world</mark>'
    );
    expect(highlightTextAsHTML("The Prophet said", "Prophet")).toBe(
      'The <mark class="bg-yellow-200">Prophet</mark> said'
    );
  });

  it("handles case-insensitive matching", () => {
    expect(highlightTextAsHTML("Hello World", "world")).toBe(
      'Hello <mark class="bg-yellow-200">World</mark>'
    );
    expect(highlightTextAsHTML("PROPHÈTE", "prophète")).toBe(
      '<mark class="bg-yellow-200">PROPHÈTE</mark>'
    );
  });

  it("highlights multiple occurrences", () => {
    expect(highlightTextAsHTML("test test test", "test")).toBe(
      '<mark class="bg-yellow-200">test</mark> <mark class="bg-yellow-200">test</mark> <mark class="bg-yellow-200">test</mark>'
    );
  });

  it("escapes special regex characters", () => {
    expect(highlightTextAsHTML("Abu (Bakr)", "(")).toBe(
      'Abu <mark class="bg-yellow-200">(</mark>Bakr)'
    );
    expect(highlightTextAsHTML("Test.$pattern", ".")).toBe(
      'Test<mark class="bg-yellow-200">.</mark>$pattern'
    );
  });

  it("handles partial matches within words", () => {
    expect(highlightTextAsHTML("Muhammad", "ham")).toBe(
      'Mu<mark class="bg-yellow-200">ham</mark>mad'
    );
  });

  it("handles empty highlight string", () => {
    expect(highlightTextAsHTML("Hello world", "")).toBe("Hello world");
  });

  it("handles text with existing HTML", () => {
    expect(highlightTextAsHTML("Text with <strong>bold</strong>", "bold")).toBe(
      'Text with <strong><mark class="bg-yellow-200">bold</mark></strong>'
    );
  });

  it("handles Arabic text", () => {
    expect(highlightTextAsHTML("النبي صلى الله عليه وسلم", "النبي")).toBe(
      '<mark class="bg-yellow-200">النبي</mark> صلى الله عليه وسلم'
    );
  });
});
