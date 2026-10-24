import { CEFRLevel } from "./Word";

export interface Sentence {
  id: string;
  en: string;
  uz: string;
  level: CEFRLevel;
  focusWord?: string;
  tokens?: string[];
}
