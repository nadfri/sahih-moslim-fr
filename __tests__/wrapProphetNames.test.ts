import { describe, expect, it } from "vitest";

import { wrapProphetNames } from "../src/utils/wrapProphetNames";

describe("wrapProphetNames", () => {
  it("wraps Messager", () => {
    expect(wrapProphetNames("Le Messager a dit...")).toBe(
      "Le ~~Messager~~ a dit..."
    );
  });
  it("wraps Messager ﷺ", () => {
    expect(wrapProphetNames("Le Messager ﷺ a dit...")).toBe(
      "Le ~~Messager~~ ~~ﷺ~~  a dit..."
    );
  });
  it("wraps Prophète", () => {
    expect(wrapProphetNames("Le Prophète a dit...")).toBe(
      "Le ~~Prophète~~ a dit..."
    );
  });
  it("wraps Prophète ﷺ", () => {
    expect(wrapProphetNames("Le Prophète ﷺ a dit...")).toBe(
      "Le ~~Prophète~~ ~~ﷺ~~ a dit..."
    );
  });
  it("wraps Muhammad", () => {
    expect(wrapProphetNames("Muhammad a dit...")).toBe("~~Muhammad~~ a dit...");
  });
  it("wraps Muhammad ﷺ", () => {
    expect(wrapProphetNames("Muhammad ﷺ a dit...")).toBe(
      "~~Muhammad~~ ~~ﷺ~~ a dit..."
    );
  });
  it("does not wrap if not matching", () => {
    expect(wrapProphetNames("Ali a dit...")).toBe("Ali a dit...");
  });
  it("wraps 'Le Prophète ﷺ' seul en fin de chaîne", () => {
    expect(wrapProphetNames("Le Prophète ﷺ")).toBe("Le ~~Prophète~~ ~~ﷺ~~");
  });
  it("replaces complete phrase (que la prière d'Allah et Son salut soient sur lui) with icon", () => {
    expect(
      wrapProphetNames(
        "Le Prophète (que la prière d'Allah et Son salut soient sur lui) a dit..."
      )
    ).toBe("Le ~~Prophète~~ ~~ﷺ~~ a dit...");
  });
  it("replaces complete phrase (paix et bénédictions sur lui) with icon", () => {
    expect(
      wrapProphetNames("Muhammad (paix et bénédictions sur lui) a dit...")
    ).toBe("~~Muhammad~~ ~~ﷺ~~ a dit...");
  });
});
