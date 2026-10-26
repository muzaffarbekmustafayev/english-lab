import fs from "fs";
import path from "path";
import { IVocabularyRepository } from "@/application/ports/IVocabularyRepository";
import { Word, CEFRLevel } from "@/core/entities/Word";
import { Sentence } from "@/core/entities/Sentence";

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

    // 1. Birinchi navbatda lokal fayldan o'qish (Vercel serverless va lokal muhitda eng tez va barqaror)
    const forceRemote = process.env.FORCE_REMOTE_GITHUB === "true";
    if (!forceRemote) {
      try {
        const filePath = path.join(process.cwd(), "data", "words.json");
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const parsed = JSON.parse(fileContent) as RawDatabase;
          if (parsed && Array.isArray(parsed.levels) && parsed.levels.length > 0) {
            this.cachedData = parsed;
            return this.cachedData;
          }
        }
      } catch (err) {
        console.warn("Failed to read local words.json, attempting remote fallback:", err);
      }
    }

    // 2. Agar lokal fayl topilmasa yoki FORCE_REMOTE_GITHUB yoqilgan bo'lsa, GitHub dan o'qish
    try {
      if (this.rawGithubUrl) {
        const response = await fetch(this.rawGithubUrl, {
          next: { revalidate: 60 },
          headers: {
            Accept: "application/json",
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
    } catch (err) {
      console.error("Failed to fetch remote words database:", err);
    }

    return { levels: [] };
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
