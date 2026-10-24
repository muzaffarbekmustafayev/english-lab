import { IVocabularyRepository } from "@/application/ports/IVocabularyRepository";
import { Word, CEFRLevel } from "@/core/entities/Word";
import { Sentence } from "@/core/entities/Sentence";
import localDatabase from "../../../data/words.json";

interface RawLevelGroup {
  level: CEFRLevel;
  title: string;
  description?: string;
  words?: Array<{
    id: string;
    en: string;
    uz: string;
    type?: Word["type"];
    synonyms?: string[];
    examples?: Array<{ en: string; uz: string }>;
    hint?: string;
  }>;
  sentences?: Array<{
    id: string;
    en: string;
    uz: string;
    focusWord?: string;
    tokens?: string[];
  }>;
}

interface RawDatabase {
  levels: RawLevelGroup[];
}

export class GitHubVocabularyRepository implements IVocabularyRepository {
  private cachedData: RawDatabase | null = null;
  private readonly rawGithubUrl =
    process.env.GITHUB_WORDS_URL ||
    "https://raw.githubusercontent.com/muzaffarbekmustafayev/english-lab/main/data/words.json";

  private async fetchRawDatabase(): Promise<RawDatabase> {
    if (this.cachedData) {
      return this.cachedData;
    }

    try {
      // Vercel / Production muhitida GitHub'dan jonli tekshirish (fallback bilan)
      if (process.env.NODE_ENV === "production") {
        const response = await fetch(this.rawGithubUrl, {
          next: { revalidate: 60 },
          headers: {
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const remoteJson = await response.json();
          if (remoteJson && Array.isArray(remoteJson.levels)) {
            this.cachedData = remoteJson;
            return this.cachedData!;
          }
        }
      }
    } catch {
      // Tarmoqda xatolik bo'lsa, lokal bazaga o'tish
    }

    // Har qanday holatda ishonchli lokal fayldan o'qish
    this.cachedData = localDatabase as unknown as RawDatabase;
    return this.cachedData;
  }

  async getAllWords(): Promise<Word[]> {
    const db = await this.fetchRawDatabase();
    const result: Word[] = [];

    for (const group of db.levels) {
      if (Array.isArray(group.words)) {
        for (const w of group.words) {
          result.push({
            ...w,
            level: group.level,
          });
        }
      }
    }

    return result;
  }

  async getWordsByLevel(level: CEFRLevel): Promise<Word[]> {
    const all = await this.getAllWords();
    return all.filter((w) => w.level === level);
  }

  async getAllSentences(): Promise<Sentence[]> {
    const db = await this.fetchRawDatabase();
    const result: Sentence[] = [];

    for (const group of db.levels) {
      if (Array.isArray(group.sentences)) {
        for (const s of group.sentences) {
          result.push({
            ...s,
            level: group.level,
          });
        }
      }
    }

    return result;
  }

  async getSentencesByLevel(level: CEFRLevel): Promise<Sentence[]> {
    const all = await this.getAllSentences();
    return all.filter((s) => s.level === level);
  }
}
