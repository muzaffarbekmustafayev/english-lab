"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Layers,
  ArrowRightLeft,
  GraduationCap,
  Play,
  FileEdit,
  Check,
  Type,
  ListTodo,
} from "lucide-react";
import {
  QuizDirection,
  GameMode,
  ContentType,
  QuizSessionConfig,
} from "@/core/entities/QuizSession";
import { CEFRLevel } from "@/core/entities/Word";

interface DashboardProps {
  onStartSession: (config: QuizSessionConfig) => void;
  isLoading: boolean;
}

export function Dashboard({ onStartSession, isLoading }: DashboardProps) {
  const [direction, setDirection] = useState<QuizDirection>("uz_to_en");
  const [mode, setMode] = useState<GameMode>("letters"); // Default to interactive letter typing as requested!
  const [level, setLevel] = useState<CEFRLevel | "all">("all");
  const [contentType, setContentType] = useState<ContentType>("words");

  const [stats, setStats] = useState<{
    totalWords: number;
    totalSentences: number;
  }>({ totalWords: 0, totalSentences: 0 });

  useEffect(() => {
    fetch("/api/words")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.stats) {
          setStats({
            totalWords: data.stats.totalWords || 0,
            totalSentences: data.stats.totalSentences || 0,
          });
        }
      })
      .catch((err) => {
        console.warn("Could not load stats:", err);
      });
  }, []);

  const handleStart = () => {
    onStartSession({
      direction,
      mode,
      level,
      contentType,
      questionCount: 50, // Plenty of items for continuous endless practice
    });
  };

  const levelsList: Array<{ id: CEFRLevel | "all"; label: string }> = [
    { id: "all", label: "All Levels" },
    { id: "a1", label: "A1 (Beginner)" },
    { id: "a2", label: "A2 (Elementary)" },
    { id: "b1", label: "B1 (Intermediate)" },
    { id: "b2", label: "B2 (Upper-Int)" },
    { id: "c1", label: "C1 (Advanced)" },
    { id: "c2", label: "C2 (Proficient)" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
      {/* 1. Hero Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Personal Vocabulary Lab</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Master English Vocabulary{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Without Limits
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
          Continuous, endless practice generated directly from your GitHub repository database.
          Type over ghost translation watermarks to build muscular memory.
        </p>

        {/* Database Stats */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mt-6 pt-5 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
              Single Words
            </span>
            <span className="text-xl sm:text-2xl font-black text-cyan-300">
              {stats.totalWords || 29}+
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
              Sentences
            </span>
            <span className="text-xl sm:text-2xl font-black text-indigo-300">
              {stats.totalSentences || 11}+
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
              Mode
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300">
              Endless
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Practice Mode */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Exercise Mode:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("letters")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === "letters"
                    ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/15"
                    : "bg-navy-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm sm:text-base">
                    Type Over Ghost
                  </span>
                  {mode === "letters" && (
                    <Check className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Uzbek prompt on the left, type English letters directly over faint watermark letters.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("quiz")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === "quiz"
                    ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/15"
                    : "bg-navy-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm sm:text-base">
                    Multiple Choice
                  </span>
                  {mode === "quiz" && (
                    <Check className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose from 4 options. Fast keyboard shortcuts: [1], [2], [3], [4].
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Translation Direction */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
              <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
              <span>Translation Direction:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDirection("uz_to_en")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  direction === "uz_to_en"
                    ? "bg-indigo-500/15 border-indigo-400 text-white shadow-lg shadow-indigo-500/15"
                    : "bg-navy-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm sm:text-base">
                    Uzbek ➡️ English
                  </span>
                  {direction === "uz_to_en" && (
                    <Check className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  See Uzbek translation, type or select English word.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDirection("en_to_uz")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  direction === "en_to_uz"
                    ? "bg-indigo-500/15 border-indigo-400 text-white shadow-lg shadow-indigo-500/15"
                    : "bg-navy-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-sm sm:text-base">
                    English ➡️ Uzbek
                  </span>
                  {direction === "en_to_uz" && (
                    <Check className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  See English term, type or select Uzbek translation.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Level & Content Filter */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-slate-800/80 flex flex-col gap-5">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Proficiency Level (CEFR):</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {levelsList.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setLevel(lvl.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  level === lvl.id
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-102"
                    : "bg-navy-900/70 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
            <Type className="w-4 h-4 text-indigo-400" />
            <span>Content Type:</span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { id: "words", label: "Single Words", icon: Type },
              { id: "sentences", label: "Sentences & Phrases", icon: ListTodo },
              { id: "mixed", label: "Mixed (All)", icon: Layers },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setContentType(item.id as ContentType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    contentType === item.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-navy-900/70 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Start CTA and GitHub Link */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <a
          href="https://github.com/muzaffarbekmustafayev/english-lab/blob/main/data/words.json"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <FileEdit className="w-4 h-4" />
          <span>Edit words in GitHub (data/words.json)</span>
        </a>

        <button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 text-white font-black text-base sm:text-lg shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/35 flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>
            {isLoading ? "Preparing Practice..." : "Start Endless Practice"}
          </span>
        </button>
      </div>
    </div>
  );
}
