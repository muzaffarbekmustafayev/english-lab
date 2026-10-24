import { normalizeText } from "@/core/entities/Word";
import { QuizQuestion } from "@/core/entities/QuizSession";

export class ValidateAnswerUseCase {
  execute(question: QuizQuestion, submittedAnswer: string): boolean {
    const userClean = normalizeText(submittedAnswer);
    const targetClean = normalizeText(question.targetAnswer);

    // 1. To'g'ridan-to'g'ri moslik
    if (userClean === targetClean) {
      return true;
    }

    // 2. Agar javob vergul bilan ajratilgan sinonimlar bo'lsa (masalan: "bardoshli, chidamli")
    const parts = targetClean.split(",").map((p) => p.trim());
    if (parts.includes(userClean)) {
      return true;
    }

    // 3. Obyektdagi sinonimlar massividan tekshirish
    if (question.synonyms && question.synonyms.length > 0) {
      const synClean = question.synonyms.map(normalizeText);
      if (synClean.includes(userClean)) {
        return true;
      }
    }

    return false;
  }
}
