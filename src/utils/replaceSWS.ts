export function replaceSWS(text: string): string {
  // Remove common invisible Unicode whitespace characters (ZWS, ZWNJ, ZWJ, etc.)
  // before performing textual replacements
  return (
    text
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
      .replace(/\bsws\b/g, "ﷺ")
      // Updated regex to match both ' and ’
      .replace(/\(que la prière d['’]Allah et Son salut soient sur lui\)/g, "ﷺ")
  );
}
