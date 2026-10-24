export type CEFRLevel = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export type WordType = "noun" | "verb" | "adjective" | "adverb" | "phrase" | "other";

export interface ExampleSentence {
  en: string;
  uz: string;
}

export interface Word {
  id: string;
  en: string;
  uz: string;
  level: CEFRLevel;
  type?: WordType;
  synonyms?: string[];
  examples?: ExampleSentence[];
  hint?: string;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[‘’`]/g, "'") // O'zbekcha tutuq va apostroflarni standartlashtirish
    .replace(/\s+/g, " ");
}
