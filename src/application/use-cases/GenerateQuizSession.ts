import { IVocabularyRepository } from "../ports/IVocabularyRepository";
import { QuizQuestion, QuizSessionConfig } from "@/core/entities/QuizSession";
import { Word } from "@/core/entities/Word";
import { Sentence } from "@/core/entities/Sentence";

function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export class GenerateQuizSessionUseCase {
  constructor(private readonly vocabularyRepository: IVocabularyRepository) {}

  async execute(config: QuizSessionConfig): Promise<QuizQuestion[]> {
    // 1. Ma'lumotlarni repozitoriydan olish
    let words: Word[] = [];
    let sentences: Sentence[] = [];

    if (config.level === "all") {
      if (config.contentType === "words" || config.contentType === "mixed") {
        words = await this.vocabularyRepository.getAllWords();
      }
      if (config.contentType === "sentences" || config.contentType === "mixed") {
        sentences = await this.vocabularyRepository.getAllSentences();
      }
    } else {
      if (config.contentType === "words" || config.contentType === "mixed") {
        words = await this.vocabularyRepository.getWordsByLevel(config.level);
      }
      if (config.contentType === "sentences" || config.contentType === "mixed") {
        sentences = await this.vocabularyRepository.getSentencesByLevel(config.level);
      }
    }

    // 2. Elementlarni yagona savol formatiga keltirish
    interface RawCandidate {
      id: string;
      prompt: string;
      targetAnswer: string;
      level: Word["level"];
      type: "word" | "sentence";
      hint?: string;
      examples?: Word["examples"];
      synonyms?: string[];
    }

    const candidates: RawCandidate[] = [];

    // So'zlarni qo'shish
    for (const w of words) {
      const isUzToEn = config.direction === "uz_to_en";
      candidates.push({
        id: w.id,
        prompt: isUzToEn ? w.uz : w.en,
        targetAnswer: isUzToEn ? w.en : w.uz,
        level: w.level,
        type: "word",
        hint: w.hint,
        examples: w.examples,
        synonyms: w.synonyms,
      });
    }

    // Gaplarni qo'shish
    for (const s of sentences) {
      const isUzToEn = config.direction === "uz_to_en";
      candidates.push({
        id: s.id,
        prompt: isUzToEn ? s.uz : s.en,
        targetAnswer: isUzToEn ? s.en : s.uz,
        level: s.level,
        type: "sentence",
        hint: s.focusWord ? `Asosiy so'z: ${s.focusWord}` : undefined,
      });
    }

    if (candidates.length === 0) {
      // Zaxira: agar tanlangan filtrda so'z bo'lmasa, barcha so'zlardan olinadi
      const allWords = await this.vocabularyRepository.getAllWords();
      for (const w of allWords) {
        const isUzToEn = config.direction === "uz_to_en";
        candidates.push({
          id: w.id,
          prompt: isUzToEn ? w.uz : w.en,
          targetAnswer: isUzToEn ? w.en : w.uz,
          level: w.level,
          type: "word",
          hint: w.hint,
          examples: w.examples,
          synonyms: w.synonyms,
        });
      }
    }

    // 3. Tasodifiy 20 ta so'zni tanlab olish
    const shuffledCandidates = shuffleArray(candidates);
    const selected = shuffledCandidates.slice(0, config.questionCount || 20);

    // Barcha javoblar zaxirasi (chalg'ituvchi variantlar tanlash uchun)
    const allAnswersPool = Array.from(new Set(candidates.map((c) => c.targetAnswer)));

    // 4. Test rejimida 4 ta variantni generatsiya qilish
    return selected.map((item, index) => {
      // Chalg'ituvchilarni tanlash (o'zidan boshqa)
      const otherAnswers = allAnswersPool.filter((a) => a !== item.targetAnswer);
      const shuffledDistractors = shuffleArray(otherAnswers).slice(0, 3);

      const options = shuffleArray([item.targetAnswer, ...shuffledDistractors]);

      return {
        id: `q-${index + 1}-${item.id}`,
        originalId: item.id,
        prompt: item.prompt,
        targetAnswer: item.targetAnswer,
        options,
        level: item.level,
        type: item.type,
        hint: item.hint,
        examples: item.examples,
        synonyms: item.synonyms,
      };
    });
  }
}
