import { CEFRLevel, ExampleSentence } from "./Word";

export type QuizDirection = "uz_to_en" | "en_to_uz";
export type GameMode = "quiz" | "letters";
export type ContentType = "words" | "sentences" | "mixed";

export interface QuizQuestion {
  id: string;
  originalId: string;
  prompt: string;               // Savol matni (masalan: O'zbekcha "jasur" yoki Inglizcha "brave")
  targetAnswer: string;         // To'g'ri javob (masalan: "brave")
  options: string[];            // Test rejimida 4 ta variant (1 to'g'ri, 3 chalg'ituvchi)
  level: CEFRLevel;
  type: "word" | "sentence";
  hint?: string;
  examples?: ExampleSentence[];
  synonyms?: string[];
}

export interface QuizSessionConfig {
  direction: QuizDirection;
  mode: GameMode;
  level: CEFRLevel | "all";
  contentType: ContentType;
  questionCount: number;        // Standart: 20 ta
}

export interface UserAnswerRecord {
  questionId: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizSessionResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  timeElapsedSeconds: number;
  mistakes: UserAnswerRecord[];
}
