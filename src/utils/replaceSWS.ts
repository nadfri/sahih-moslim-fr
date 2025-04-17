export function replaceSWS(text: string): string {
  return (
    text
      .replace(/\bsws\b/g, "ﷺ")
      // Updated regex to match both ' and ’
      .replace(/\(que la prière d['’]Allah et Son salut soient sur lui\)/g, "ﷺ")
  );
}
