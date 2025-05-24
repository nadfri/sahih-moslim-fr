const patterns = [
  // Avec icône ﷺ (doivent matcher le bloc complet)
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Messager d’Allah ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Messager d’Allah ﷺ",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Messager d'Allah ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Messager d'Allah ﷺ",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Prophète d’Allah ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Prophète d’Allah ﷺ",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Prophète d'Allah ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Prophète d'Allah ﷺ",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Messager ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Messager ﷺ",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Prophète ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Prophète ﷺ",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Muhammad ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Muhammad ﷺ",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Envoyé d’Allah ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Envoyé d’Allah ﷺ",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Envoyé d'Allah ﷺ)(?=[\s\p{P}]|$)(?!~~)/gu,
    label: "Envoyé d'Allah ﷺ",
  },
  // Sans icône (ne doivent pas englober l'icône)
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Messager d’Allah)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Messager d’Allah",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Messager d'Allah)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Messager d'Allah",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Prophète d’Allah)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Prophète d’Allah",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Prophète d'Allah)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Prophète d'Allah",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Messager)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Messager",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Prophète)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Prophète",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Muhammad)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Muhammad",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Envoyé d’Allah)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Envoyé d’Allah",
  },
  {
    regex: /(?<!~~)(?:^|[\s\p{P}])(Envoyé d'Allah)(?=[\s\p{P}]|$)(?![ ﷺ~])/gu,
    label: "Envoyé d'Allah",
  },
  // Phrases
  {
    regex: /\(que la prière d['’]Allah et Son salut soient sur lui\)/g,
    label: "phrase complète",
  },
  // sws isolé (après tout le reste)
  { regex: /(?<=^|[\s\p{P}])sws(?=[\s\p{P}]|$)/gu, label: "sws" },
];

export function wrapProphetNames(text: string): string {
  // Remove invisible Unicode whitespace characters
  let result = text.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");
  for (const { regex } of patterns) {
    result = result.replace(regex, (match, before, word) => {
      // Si la regex a deux groupes de capture (avant, mot)
      if (typeof before === "string" && typeof word === "string") {
        if (/^~~.*~~$/.test(word)) return match;
        return `${before}~~${word}~~`;
      }
      // Sinon, comportement classique
      if (/^~~.*~~$/.test(match)) return match;
      const trimmed = match.trimEnd();
      const trailing = match.slice(trimmed.length);
      return `~~${trimmed}~~${trailing}`;
    });
  }
  return result;
}
