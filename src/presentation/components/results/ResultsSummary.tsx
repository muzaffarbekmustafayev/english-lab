"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { UserAnswerRecord } from "@/core/entities/QuizSession";
import { soundService } from "@/infrastructure/sound/WebAudioSoundService";

interface ResultsSummaryProps {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  timeElapsedSeconds: number;
  mistakes: UserAnswerRecord[];
  onRetryMistakes: () => void;
  onNewSession: () => void;
  onGoHome: () => void;
}

export function ResultsSummary({
  totalQuestions,
  correctCount,
  incorrectCount,
  accuracyPercentage,
  timeElapsedSeconds,
  mistakes,
  onRetryMistakes,
  onNewSession,
  onGoHome,
}: ResultsSummaryProps) {
  useEffect(() => {
    soundService.playWin();

    if (accuracyPercentage >= 70) {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#818cf8", "#34d399", "#f43f5e"],
      });
    }

    const lastDate = localStorage.getItem("english_lab_last_date");
    const today = new Date().toISOString().slice(0, 10);

    if (lastDate !== today) {
      const currentStreak = parseInt(
        localStorage.getItem("english_lab_streak") || "0",
        10
      );
      localStorage.setItem("english_lab_streak", (currentStreak + 1).toString());
      localStorage.setItem("english_lab_last_date", today);
    }
  }, [accuracyPercentage]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  let gradeMessage = "Outstanding!";
  let gradeSub = "You demonstrated excellent vocabulary mastery!";
  let gradeColor = "text-emerald-400";

  if (accuracyPercentage < 50) {
    gradeMessage = "Keep Practicing";
    gradeSub = "Review the missed words below and try again to reinforce retention.";
    gradeColor = "text-rose-400";
  } else if (accuracyPercentage < 80) {
    gradeMessage = "Great Job!";
    gradeSub = "Good performance! A little more practice will push you to perfection.";
    gradeColor = "text-sky-400";
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
      {/* 1. Score Trophy Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden border border-slate-800/80 shadow-2xl">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 text-white shadow-xl shadow-cyan-500/25 mb-4 animate-pop">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Session Completed!
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-md mx-auto">
          {gradeSub}
        </p>

        {/* Percentage Score */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            {accuracyPercentage}%
          </div>
          <span className={`text-sm sm:text-base font-bold uppercase tracking-wider ${gradeColor}`}>
            ({gradeMessage})
          </span>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80 max-w-xl mx-auto">
          <div className="p-3 sm:p-4 rounded-2xl bg-navy-900/60 border border-slate-800/70">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs sm:text-sm font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" /> Correct
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-white">
              {correctCount}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-navy-900/60 border border-slate-800/70">
            <div className="flex items-center justify-center gap-1.5 text-rose-400 text-xs sm:text-sm font-semibold mb-1">
              <XCircle className="w-4 h-4" /> Incorrect
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-white">
              {incorrectCount}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-navy-900/60 border border-slate-800/70">
            <div className="flex items-center justify-center gap-1.5 text-sky-400 text-xs sm:text-sm font-semibold mb-1">
              <Clock className="w-4 h-4" /> Time
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-200 mt-1">
              {formatTime(timeElapsedSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mistakes Review (if any) */}
      {mistakes.length > 0 && (
        <div className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Mistakes Review ({mistakes.length})
            </h3>
            <span className="text-xs text-slate-400">
              Practice these items to solidify memory
            </span>
          </div>

          <div className="divide-y divide-slate-800/70">
            {mistakes.map((m, idx) => (
              <div
                key={`mistake-${idx}`}
                className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    {m.prompt}
                  </div>
                  <div className="text-xs text-rose-400/90 mt-0.5">
                    Your answer: &quot;{m.userAnswer || "Blank"}&quot;
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Correct:</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/25">
                    {m.correctAnswer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        {mistakes.length > 0 && (
          <button
            onClick={onRetryMistakes}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all hover:scale-102"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Retry Mistakes</span>
          </button>
        )}

        <button
          onClick={onNewSession}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/35 flex items-center justify-center gap-2 transition-all hover:scale-102"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>New 20-Question Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-btn text-slate-300 hover:text-white font-semibold text-sm sm:text-base transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
