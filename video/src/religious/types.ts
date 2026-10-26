/** JSON written by religious/tools/build_ayah_data.py (see sample in ./data). Times are VIDEO seconds. */
export type KeyColour = "" | "g" | "c" | "w"; // gold (divine names/hope) | coral (sin) | warm-white glow | plain
export type AyahWord = { t: string; on: number; off: number; k: KeyColour | string };
export type AyahPage = {
  n: number; // ayah number
  first: boolean; // first page of this ayah
  num: boolean; // last page of this ayah -> show the ۝ medallion
  lines: number[]; // cumulative word index where each line ends, e.g. [4, 8]
  start: number;
  end: number;
  words: AyahWord[];
};
export type AyahData = {
  surah: number;
  surahName: string;
  en: string;
  ayat: [number, number] | number[];
  off: number; // voice start (after the logo intro), 1.8-3.0 s in the original reels
  total: number; // video length = last word + ~4.8 s outro hold
  timing?: string;
  pages: AyahPage[];
};
