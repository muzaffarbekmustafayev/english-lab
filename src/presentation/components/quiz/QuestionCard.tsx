"use client";

import React, { useState } from "react";
import { Lightbulb, Volume2, Bookmark } from "lucide-react";
import { QuizQuestion, QuizDirection } from "@/core/entities/QuizSession";

interface QuestionCardProps {
  question: QuizQuestion;
  direction: QuizDirection;
}

export function QuestionCard({ question, direction }: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);

  // Text-to-Speech
  const speakWord = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const textToSpeak = direction === "en_to_uz" ? question.prompt : question.targetAnswer;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const levelColorMap: Record<string, string> = {
    a1: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    a2: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    b1: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    b2: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    c1: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    c2: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  const levelBadgeClass =
    levelColorMap[question.level.toLowerCase()] ||
    "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-8 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[380px] relative overflow-hidden border border-slate-800/80 shadow-2xl">
      {/* Background glow orb */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top meta row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${levelBadgeClass}`}
            >
              Level: {question.level.toUpperCase()}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 bg-navy-800/70 px-2.5 py-1 rounded-lg border border-slate-700/50">
              {question.type === "word" ? "Single Word" : "Sentence"}
            </span>
          </div>

          {/* Pronounce button */}
          <button
            onClick={speakWord}
            title="Listen pronunciation"
            className="p-2 rounded-xl bg-navy-800/80 hover:bg-navy-700 text-cyan-400 hover:text-cyan-300 transition-colors border border-slate-700/60 shadow-sm"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Direction prompt label */}
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
          {direction === "uz_to_en" ? "Uzbek Meaning:" : "English Word:"}
        </div>

        {/* Prompt Word / Sentence */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
          {question.prompt}
        </h2>
      </div>

      {/* Bottom Hint & Examples drawer */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col gap-3">
        {/* Hint */}
        {question.hint && (
          <div>
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300/90 hover:text-amber-200 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Show Clue / Hint</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs sm:text-sm text-amber-300 flex items-start gap-2 animate-pop">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{question.hint}</span>
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        {question.examples && question.examples.length > 0 && (
          <div className="p-3 sm:p-3.5 rounded-xl bg-navy-900/60 border border-slate-800/70 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>Example Usage:</span>
            </div>
            <p className="text-slate-200 font-medium italic">
              &quot;{question.examples[0].en}&quot;
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              &quot;{question.examples[0].uz}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
