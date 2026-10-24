"use client";

import React, { useState } from "react";
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
  initialQuestions: QuizQuestion[];
  config: QuizSessionConfig;
  onSessionComplete: (results: {
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    accuracyPercentage: number;
    mistakes: UserAnswerRecord[];
  }) => void;
  onExit: () => void;
}

export function ActiveSession({
  initialQuestions,
  config,
  onSessionComplete,
  onExit,
}: ActiveSessionProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userRecords, setUserRecords] = useState<UserAnswerRecord[]>([]);
  const [correctStreak, setCorrectStreak] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleFinishPractice = () => {
    if (userRecords.length === 0) {
      onExit();
      return;
    }

    const correctCount = userRecords.filter((r) => r.isCorrect).length;
    const incorrectCount = userRecords.length - correctCount;
    const accuracyPercentage = Math.round((correctCount / userRecords.length) * 100);
    const mistakes = userRecords.filter((r) => !r.isCorrect);

    onSessionComplete({
      totalQuestions: userRecords.length,
      correctCount,
      incorrectCount,
      accuracyPercentage,
      mistakes,
    });
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    if (!currentQuestion) return;

    const record: UserAnswerRecord = {
      questionId: currentQuestion.id,
      prompt: currentQuestion.prompt,
      userAnswer: answer,
      correctAnswer: currentQuestion.targetAnswer,
      isCorrect,
      timeSpentSeconds: 0,
    };

    const nextRecords = [...userRecords, record];
    setUserRecords(nextRecords);

    if (isCorrect) {
      setCorrectStreak((prev) => prev + 1);
    } else {
      setCorrectStreak(0);
    }

    // Cheksiz rejim (Endless loop):
    // Agar savollar oxiriga yaqinlashsa, zaxiradagi savollarni qayta aralashtirib oxiriga qo'shish
    if (currentIndex + 3 >= questions.length) {
      const reshuffled = [...initialQuestions];
      for (let i = reshuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [reshuffled[i], reshuffled[j]] = [reshuffled[j], reshuffled[i]];
      }
      setQuestions((prev) => [...prev, ...reshuffled]);
    }

    setCurrentIndex((prev) => prev + 1);
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col gap-5 sm:gap-6">
      {/* 1. Yuqori Bar (Cheksiz oqim, vaqtsiz) */}
      <ProgressBar
        currentIndex={currentIndex}
        correctStreak={correctStreak}
        totalAnswered={userRecords.length}
        onFinish={handleFinishPractice}
      />

      {/* 2. Asosiy Split Layout (Chapda Savol, O'ngda Interaktiv Xira Harf Taxtasi) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* Chap ustun: Savol Kartasi */}
        <div className="h-full">
          <QuestionCard
            question={currentQuestion}
            direction={config.direction}
          />
        </div>

        {/* O'ng ustun: Mashq Taxtasi */}
        <div className="glass-card rounded-3xl p-5 sm:p-8 flex flex-col justify-between h-full min-h-[320px] sm:min-h-[400px] border border-slate-800/80 shadow-2xl relative">
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
