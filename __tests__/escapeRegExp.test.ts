import { describe, expect, it } from "vitest";

import { escapeRegExp } from "../src/utils/escapeRegExp";

describe("escapeRegExp", () => {
  it("escapes special regex characters", () => {
    expect(escapeRegExp("hello.world")).toBe("hello\\.world");
    expect(escapeRegExp("test*pattern")).toBe("test\\*pattern");
    expect(escapeRegExp("query+more")).toBe("query\\+more");
    expect(escapeRegExp("optional?")).toBe("optional\\?");
    expect(escapeRegExp("start^end")).toBe("start\\^end");
    expect(escapeRegExp("price$")).toBe("price\\$");
  });

  it("escapes parentheses and brackets", () => {
    expect(escapeRegExp("(group)")).toBe("\\(group\\)");
    expect(escapeRegExp("[class]")).toBe("\\[class\\]");
    expect(escapeRegExp("{count}")).toBe("\\{count\\}");
  });

  it("escapes pipe and backslash", () => {
    expect(escapeRegExp("option1|option2")).toBe("option1\\|option2");
    expect(escapeRegExp("path\\to\\file")).toBe("path\\\\to\\\\file");
  });

  it("handles empty string", () => {
    expect(escapeRegExp("")).toBe("");
  });

  it("handles normal text without special characters", () => {
    expect(escapeRegExp("normal text")).toBe("normal text");
    expect(escapeRegExp("AbC123")).toBe("AbC123");
  });

  it("handles complex patterns", () => {
    expect(escapeRegExp("(test.*+?)")).toBe("\\(test\\.\\*\\+\\?\\)");
    expect(escapeRegExp("[a-z]{1,3}|\\d+")).toBe(
      "\\[a-z\\]\\{1,3\\}\\|\\\\d\\+"
    );
  });
});
