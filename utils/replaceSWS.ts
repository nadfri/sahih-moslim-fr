export function replaceSWS(text: string): string {
  return text
    .replace(/\bsws\b/g, "ﷺ")
    .replace(/\(que la prière d['']Allah et Son salut soient sur lui\)/g, "ﷺ");
}
