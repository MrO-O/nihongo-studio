import type { JapaneseTextContent } from "../types";

export function isJapaneseTextSegments(
  value: JapaneseTextContent,
): value is Exclude<JapaneseTextContent, string> {
  return typeof value !== "string";
}

export function toPlainText(value: JapaneseTextContent): string {
  return typeof value === "string"
    ? value
    : Array.isArray(value)
      ? value.map((segment) => segment.text).join("")
      : value.text;
}

export function hasReadableSegments(value: JapaneseTextContent): boolean {
  if (typeof value === "string") return false;
  const segments = Array.isArray(value) ? value : [value];
  return segments.some((segment) => segment.reading || segment.meaning);
}
