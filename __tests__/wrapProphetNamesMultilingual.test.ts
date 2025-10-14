import { describe, it, expect } from "vitest";
import {
  wrapEnglishProphetNames,
  wrapArabicProphetNames,
} from "@/src/utils/wrapProphetNamesMultilingual";

describe("wrapProphetNamesMultilingual", () => {
  describe("wrapEnglishProphetNames", () => {
    it("should replace Prophet salutations with styled symbol", () => {
      const text =
        "The Prophet (may peace of Allah be upon him) said something.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("The ~~Prophet~~ ~~ﷺ~~ said something.");
    });

    it("should replace Messenger of Allah with styled symbol", () => {
      const text =
        "The Messenger of Allah (may peace of Allah be upon him) taught us.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("The ~~Messenger of Allah~~ ~~ﷺ~~ taught us.");
    });

    it("should replace Holy Prophet with styled symbol", () => {
      const text =
        "The Holy Prophet (may peace of Allah be upon him) was merciful.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("The ~~Holy Prophet~~ ~~ﷺ~~ was merciful.");
    });

    it("should handle multiple occurrences", () => {
      const text =
        "The Prophet (may peace of Allah be upon him) and the Messenger of Allah (may peace of Allah be upon him) are the same person.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe(
        "The ~~Prophet~~ ~~ﷺ~~ and the ~~Messenger of Allah~~ ~~ﷺ~~ are the same person."
      );
    });

    it("should handle text without Prophet references", () => {
      const text = "This is a regular text without any references.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe(text);
    });

    it("should handle case variations", () => {
      const text =
        "The prophet (may peace of Allah be upon him) and the MESSENGER OF ALLAH (may peace of Allah be upon him).";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe(
        "The ~~prophet~~ ~~ﷺ~~ and the ~~MESSENGER OF ALLAH~~ ~~ﷺ~~."
      );
    });

    it("should remove parentheses around the ﷺ symbol", () => {
      const text = "The Prophet (ﷺ) said something important.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("The ~~Prophet~~ ~~ﷺ~~ said something important.");
    });

    it("should handle Prophet of Allah with salutation", () => {
      const text =
        "The Prophet of Allah (may peace and blessings be upon him) was merciful.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("The ~~Prophet of Allah~~ ~~ﷺ~~ was merciful.");
    });

    it("should handle Apostle with salutation", () => {
      const text =
        "The Apostle (may peace and blessings be upon him) taught us.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("The ~~Apostle~~ ~~ﷺ~~ taught us.");
    });

    it("should handle Messenger of Allah with full salutation", () => {
      const text =
        "The Messenger of Allah (may peace and blessings be upon him) spoke.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("The ~~Messenger of Allah~~ ~~ﷺ~~ spoke.");
    });

    it("should handle standalone Apostle ﷺ", () => {
      const text = "The Apostle ﷺ was sent to mankind.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("The ~~Apostle~~ ~~ﷺ~~ was sent to mankind.");
    });

    it("should replace repetitive 'He (the Holy Prophet)' with styled 'He'", () => {
      const text =
        "He (the Holy Prophet) said something. He (the Holy Prophet) was merciful.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("~~He~~ said something. ~~He~~ was merciful.");
    });

    it("should replace repetitive 'He (the Prophet)' with styled 'He'", () => {
      const text = "He (the Prophet) taught us wisdom.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("~~He~~ taught us wisdom.");
    });

    it("should replace repetitive 'He (the Messenger)' with styled 'He'", () => {
      const text = "He (the Messenger) conveyed the message.";
      const result = wrapEnglishProphetNames(text);
      expect(result).toBe("~~He~~ conveyed the message.");
    });
  });

  describe("wrapArabicProphetNames", () => {
    it("should replace Arabic Prophet references with styled symbol", () => {
      const text = "قال رسول الله صلى الله عليه وسلم شيئا.";
      const result = wrapArabicProphetNames(text);
      expect(result).toBe("قال ~~رسول الله~~ ~~ﷺ~~ شيئا.");
    });

    it("should replace النبي with styled symbol", () => {
      const text = "النبي صلى الله عليه وسلم كان رحيما.";
      const result = wrapArabicProphetNames(text);
      expect(result).toBe("~~النبي~~ ~~ﷺ~~ كان رحيما.");
    });

    it("should handle multiple Arabic Prophet references", () => {
      const text = "النبي صلى الله عليه وسلم ورسول الله صلى الله عليه وسلم.";
      const result = wrapArabicProphetNames(text);
      expect(result).toBe("~~النبي~~ ~~ﷺ~~ و~~رسول الله~~ ~~ﷺ~~.");
    });

    it("should handle text without Arabic Prophet references", () => {
      const text = "هذا نص عادي بدون مراجع للنبي.";
      const result = wrapArabicProphetNames(text);
      expect(result).toBe(text);
    });

    it("should handle mixed salutations", () => {
      const text = "النبي عليه السلام ورسول الله صلى الله عليه وسلم.";
      const result = wrapArabicProphetNames(text);
      expect(result).toBe("~~النبي~~ ~~ﷺ~~ و~~رسول الله~~ ~~ﷺ~~.");
    });

    it("should remove parentheses around the ﷺ symbol", () => {
      const text = "قال النبي (ﷺ) شيئا مهما.";
      const result = wrapArabicProphetNames(text);
      expect(result).toBe("قال ~~النبي~~ ~~ﷺ~~ شيئا مهما.");
    });
  });
});
