"use client";

import React, { useState, useEffect } from "react";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { MultipleChoiceBoard } from "./MultipleChoiceBoard";
import { LetterBoxBoard } from "./LetterBoxBoard";
import {
  QuizQuestion,
  QuizSessionConfig,
  UserAnswerRecord,
} from "@/core/entities/QuizSession";

interface ActiveSessionProps {
  questions: QuizQuestion[];
  config: QuizSessionConfig;
  onSessionComplete: (results: {
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    accuracyPercentage: number;
    timeElapsedSeconds: number;
    mistakes: UserAnswerRecord[];
  }) => void;
  onExit: () => void;
}

export function ActiveSession({
  questions,
  config,
  onSessionComplete,
  onExit,
}: ActiveSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userRecords, setUserRecords] = useState<UserAnswerRecord[]>([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Taymer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    const record: UserAnswerRecord = {
      questionId: currentQuestion.id,
      prompt: currentQuestion.prompt,
      userAnswer: answer,
      correctAnswer: currentQuestion.targetAnswer,
      isCorrect,
      timeSpentSeconds: secondsElapsed,
    };

    const nextRecords = [...userRecords, record];
    setUserRecords(nextRecords);

    // Agar savollar tugagan bo'lsa
    if (currentIndex + 1 >= questions.length) {
      const correctCount = nextRecords.filter((r) => r.isCorrect).length;
      const incorrectCount = nextRecords.length - correctCount;
      const accuracyPercentage = Math.round((correctCount / nextRecords.length) * 100);
      const mistakes = nextRecords.filter((r) => !r.isCorrect);

      onSessionComplete({
        totalQuestions: nextRecords.length,
        correctCount,
        incorrectCount,
        accuracyPercentage,
        timeElapsedSeconds: secondsElapsed,
        mistakes,
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col gap-5 sm:gap-6">
      {/* 1. Yuqori Progress Bar va Taymer */}
      <ProgressBar
        currentIndex={currentIndex}
        total={questions.length}
        secondsElapsed={secondsElapsed}
        onExit={onExit}
      />

      {/* 2. Asosiy Split Layout (Chapda Savol, O'ngda Interaktiv Javob) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* Chap ustun: Savol Kartasi */}
        <div className="h-full">
          <QuestionCard
            question={currentQuestion}
            direction={config.direction}
          />
        </div>

        {/* O'ng ustun: Mashq Taxtasi (Test yoki Harf To'ldirish) */}
        <div className="glass-card rounded-3xl p-5 sm:p-8 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[380px] border border-slate-800/80 shadow-2xl relative">
          {config.mode === "quiz" ? (
            <MultipleChoiceBoard
              question={currentQuestion}
              onAnswerSelected={handleAnswer}
            />
          ) : (
            <LetterBoxBoard
              question={currentQuestion}
              onAnswerSubmitted={handleAnswer}
            />
          )}
        </div>
      </div>
    </div>
  );
}
