import { NextRequest, NextResponse } from "next/server";
import { GitHubVocabularyRepository } from "@/infrastructure/repositories/GitHubVocabularyRepository";
import { GenerateQuizSessionUseCase } from "@/application/use-cases/GenerateQuizSession";
import { QuizSessionConfig } from "@/core/entities/QuizSession";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const config: QuizSessionConfig = {
      direction: body.direction === "en_to_uz" ? "en_to_uz" : "uz_to_en",
      mode: body.mode === "letters" ? "letters" : "quiz",
      level: body.level || "all",
      contentType: body.contentType || "words",
      questionCount: Number(body.questionCount) || 20,
    };

    const repository = new GitHubVocabularyRepository();
    const useCase = new GenerateQuizSessionUseCase(repository);

    const questions = await useCase.execute(config);

    return NextResponse.json({
      success: true,
      config,
      total: questions.length,
      questions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Sessiya yaratishda xatolik",
      },
      { status: 500 }
    );
  }
}
