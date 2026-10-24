"use client";

import React from "react";
import { Flag, Sparkles } from "lucide-react";

interface ProgressBarProps {
  currentIndex: number;
  correctStreak: number;
  totalAnswered: number;
  onFinish: () => void;
}

export function ProgressBar({
  currentIndex,
  correctStreak,
  totalAnswered,
  onFinish,
}: ProgressBarProps) {
  return (
    <div className="w-full bg-navy-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-2.5 sm:p-4 shadow-xl">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Question counter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
            #{currentIndex + 1}
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Endless Practice
            </div>
            <div className="text-xs sm:text-sm font-bold text-white leading-tight">
              Question {currentIndex + 1}
            </div>
          </div>
        </div>

        {/* Center: Correct Streak badge */}
        <div className="hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{correctStreak} in a row</span>
        </div>

        {/* Right: Finish Practice Button */}
        <button
          onClick={onFinish}
          className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-slate-300 hover:text-white px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-navy-800/80 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 border border-slate-700/60 transition-all shrink-0 active:scale-95"
        >
          <Flag className="w-3.5 h-3.5 text-cyan-400" />
          <span>Finish ({totalAnswered})</span>
        </button>
      </div>
    </div>
  );
}
