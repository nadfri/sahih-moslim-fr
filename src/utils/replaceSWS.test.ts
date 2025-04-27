import { describe, expect, it } from "vitest";

import { replaceSWS } from "./replaceSWS";

describe("replaceSWS", () => {
  it("removes Zero Width Non-Joiner (\u200C)", () => {
    expect(replaceSWS("a\u200C b")).toBe("a b");
  });

  it("removes Zero Width Space (\u200B)", () => {
    expect(replaceSWS("a\u200Bb")).toBe("ab");
  });

  it("removes Zero Width Joiner (\u200D)", () => {
    expect(replaceSWS("a\u200Db")).toBe("ab");
  });

  it("removes BOM (\uFEFF)", () => {
    expect(replaceSWS("a\uFEFFb")).toBe("ab");
  });

  it("replaces 'sws' with ﷺ", () => {
    expect(replaceSWS("sws")).toBe("ﷺ");
    expect(replaceSWS("foo sws bar")).toBe("foo ﷺ bar");
  });

  it("replaces phrase with ﷺ (apostrophe)", () => {
    expect(
      replaceSWS("(que la prière d'Allah et Son salut soient sur lui)")
    ).toBe("ﷺ");
  });

  it("replaces phrase with ﷺ (right single quote)", () => {
    expect(
      replaceSWS("(que la prière d’Allah et Son salut soient sur lui)")
    ).toBe("ﷺ");
  });

  it("handles combined cases", () => {
    expect(
      replaceSWS(
        "sws\u200B(que la prière d'Allah et Son salut soient sur lui)\u200C"
      )
    ).toBe("ﷺﷺ");
  });
});
