"use client";

import React, { useState } from "react";
import { Header } from "@/presentation/components/common/Header";
import { Dashboard } from "@/presentation/components/dashboard/Dashboard";
import { ActiveSession } from "@/presentation/components/quiz/ActiveSession";
import { ResultsSummary } from "@/presentation/components/results/ResultsSummary";
import {
  QuizQuestion,
  QuizSessionConfig,
  UserAnswerRecord,
} from "@/core/entities/QuizSession";

export default function HomePage() {
  const [view, setView] = useState<"dashboard" | "session" | "results">("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<QuizSessionConfig | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const [sessionResults, setSessionResults] = useState<{
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    accuracyPercentage: number;
    timeElapsedSeconds: number;
    mistakes: UserAnswerRecord[];
  } | null>(null);

  const handleStartSession = async (config: QuizSessionConfig) => {
    setIsLoading(true);
    setCurrentConfig(config);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        setView("session");
      } else {
        alert("No questions found in vocabulary database for the selected filters.");
      }
    } catch {
      alert("An error occurred while loading the session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionComplete = (results: {
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    accuracyPercentage: number;
    timeElapsedSeconds: number;
    mistakes: UserAnswerRecord[];
  }) => {
    setSessionResults(results);
    setView("results");
  };

  const handleRetryMistakes = () => {
    if (!sessionResults || sessionResults.mistakes.length === 0) return;

    const retryQuestions: QuizQuestion[] = sessionResults.mistakes.map((m, idx) => ({
      id: `retry-${idx + 1}-${m.questionId}`,
      originalId: m.questionId,
      prompt: m.prompt,
      targetAnswer: m.correctAnswer,
      options: [m.correctAnswer],
      level: "b1",
      type: "word",
    }));

    setQuestions(retryQuestions);
    setView("session");
  };

  const handleNewSession = () => {
    if (currentConfig) {
      handleStartSession(currentConfig);
    } else {
      setView("dashboard");
    }
  };

  const handleGoHome = () => {
    setView("dashboard");
    setQuestions([]);
    setSessionResults(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col justify-center">
        {view === "dashboard" && (
          <Dashboard
            onStartSession={handleStartSession}
            isLoading={isLoading}
          />
        )}

        {view === "session" && currentConfig && questions.length > 0 && (
          <ActiveSession
            questions={questions}
            config={currentConfig}
            onSessionComplete={handleSessionComplete}
            onExit={handleGoHome}
          />
        )}

        {view === "results" && sessionResults && (
          <ResultsSummary
            totalQuestions={sessionResults.totalQuestions}
            correctCount={sessionResults.correctCount}
            incorrectCount={sessionResults.incorrectCount}
            accuracyPercentage={sessionResults.accuracyPercentage}
            timeElapsedSeconds={sessionResults.timeElapsedSeconds}
            mistakes={sessionResults.mistakes}
            onRetryMistakes={handleRetryMistakes}
            onNewSession={handleNewSession}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      <footer className="w-full py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        English Lab &copy; 2026 • Personal Vocabulary Laboratory • Powered by Next.js & Tailwind CDN
      </footer>
    </div>
  );
}
