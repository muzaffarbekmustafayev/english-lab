"use client";

import React from "react";
import { X, Clock } from "lucide-react";

interface ProgressBarProps {
  currentIndex: number;
  total: number;
  secondsElapsed: number;
  onExit: () => void;
}

export function ProgressBar({
  currentIndex,
  total,
  secondsElapsed,
  onExit,
}: ProgressBarProps) {
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / total) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-navy-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3 sm:p-4 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        {/* Exit Button */}
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="hidden xs:inline">Exit</span>
        </button>

        {/* Question Counter */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Question
          </span>{" "}
          <span className="text-sm sm:text-base font-extrabold text-white">
            {currentIndex + 1}
          </span>
          <span className="text-slate-500 font-medium text-xs sm:text-sm">
            {" "}of {total}
          </span>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 bg-navy-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{formatTime(secondsElapsed)}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-navy-950/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300 ease-out shadow-sm shadow-cyan-500/50"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
