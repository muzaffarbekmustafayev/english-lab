import { NextResponse } from "next/server";
import { GitHubVocabularyRepository } from "@/infrastructure/repositories/GitHubVocabularyRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const repository = new GitHubVocabularyRepository();
    const words = await repository.getAllWords();
    const sentences = await repository.getAllSentences();

    // Darajalar bo'yicha hisobot
    const levelCounts: Record<string, number> = {
      a1: 0,
      a2: 0,
      b1: 0,
      b2: 0,
      c1: 0,
      c2: 0,
    };

    words.forEach((w) => {
      if (levelCounts[w.level] !== undefined) {
        levelCounts[w.level]++;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalWords: words.length,
        totalSentences: sentences.length,
        levelCounts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "So'zlarni yuklashda xatolik",
      },
      { status: 500 }
    );
  }
}
