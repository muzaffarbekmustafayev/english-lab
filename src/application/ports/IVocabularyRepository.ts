import { Word, CEFRLevel } from "@/core/entities/Word";
import { Sentence } from "@/core/entities/Sentence";

export interface IVocabularyRepository {
  getAllWords(): Promise<Word[]>;
  getWordsByLevel(level: CEFRLevel): Promise<Word[]>;
  getAllSentences(): Promise<Sentence[]>;
  getSentencesByLevel(level: CEFRLevel): Promise<Sentence[]>;
}
