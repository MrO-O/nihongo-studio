import type { JapaneseTextSegment } from "../types";

export const jp = (...segments: JapaneseTextSegment[]): JapaneseTextSegment[] => segments;

export const p = (text: string): JapaneseTextSegment => ({ text });

export const r = (
  text: string,
  reading: string,
  meaning?: string,
): JapaneseTextSegment => ({ text, reading, meaning });
