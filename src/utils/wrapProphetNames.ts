// Replace all patterns to have the form:
// (before)(word)(after)
const patterns = [
  // Without icon
  {
    regex: /(^|[\s\p{P}])(Messager d’Allah)(?=[\s\p{P}]|$)/gu,
    label: "Messager d’Allah",
  },
  {
    regex: /(^|[\s\p{P}])(Messager d'Allah)(?=[\s\p{P}]|$)/gu,
    label: "Messager d'Allah",
  },
  {
    regex: /(^|[\s\p{P}])(Prophète d’Allah)(?=[\s\p{P}]|$)/gu,
    label: "Prophète d’Allah",
  },
  {
    regex: /(^|[\s\p{P}])(Prophète d'Allah)(?=[\s\p{P}]|$)/gu,
    label: "Prophète d'Allah",
  },
  {
    regex: /(^|[\s\p{P}])(Messager)(?=[\s\p{P}]|$)/gu,
    label: "Messager",
  },
  {
    regex: /(^|[\s\p{P}])(Prophète)(?=[\s\p{P}]|$)/gu,
    label: "Prophète",
  },
  {
    regex: /(^|[\s\p{P}])(Muhammad)(?=[\s\p{P}]|$)/gu,
    label: "Muhammad",
  },
  {
    regex: /(^|[\s\p{P}])(Envoyé d’Allah)(?=[\s\p{P}]|$)/gu,
    label: "Envoyé d’Allah",
  },
  {
    regex: /(^|[\s\p{P}])(Envoyé d'Allah)(?=[\s\p{P}]|$)/gu,
    label: "Envoyé d'Allah",
  },
  // Complete phrases
  {
    regex: /(\(que la prière d['’]Allah et Son salut soient sur lui\))/g,
    label: "phrase complète",
  },
];

export function wrapProphetNames(text: string): string {
  // Remove invisible Unicode whitespace characters using character class
  // excluding newline (\n) and carriage return (\r) to preserve line breaks
  let result = text.replace(/[\p{Cc}\u{EFF}]/gu, (char) => {
    return char === "\n" || char === "\r" ? char : "";
  });

  // Direct replacement of complete phrases with wrapped icon
  result = result.replace(
    /\(que la prière d['’]Allah et Son salut soient sur lui\)/g,
    "~~ﷺ~~"
  );
  result = result.replace(/\(paix et bénédictions sur lui\)/g, "~~ﷺ~~");
  result = result.replace(
    /\(paix et bénédictions d['’]Allah sur lui\)/g,
    "~~ﷺ~~"
  );

  // Apply patterns to wrap titles (without icon)
  for (const { regex } of patterns) {
    result = result.replace(regex, (...args) => {
      const [match, before, word] = args;
      if (typeof before === "string" && typeof word === "string") {
        if (/^~~.*~~$/.test(word)) return match;
        return `${before}~~${word}~~`;
      }
      return match;
    });
  }

  // Direct replacement of sws (isolated or surrounded by spaces/punctuation) with icon ﷺ
  result = result.replace(/(?<=^|[\s\p{P}])sws(?=[\s\p{P}]|$)/gu, "ﷺ");

  // Wrap each isolated ﷺ icon with tildes (respecting spaces/punctuations)
  result = result.replace(
    /(?<=^|[\s\p{P}])ﷺ(?=[\s\p{P}]|$)/gu,
    (match) => `~~${match.trim()}~~`
  );

  return result;
}
