"use client";

import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { QuizQuestion } from "@/core/entities/QuizSession";
import { soundService } from "@/infrastructure/sound/WebAudioSoundService";

interface MultipleChoiceBoardProps {
  question: QuizQuestion;
  onAnswerSelected: (answer: string, isCorrect: boolean) => void;
}

export function MultipleChoiceBoard({
  question,
  onAnswerSelected,
}: MultipleChoiceBoardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsLocked(false);
  }, [question.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= question.options.length) {
        handleSelect(question.options[num - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [question.options, isLocked]);

  const handleSelect = (option: string) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelectedOption(option);

    const isCorrect = option === question.targetAnswer;

    if (isCorrect) {
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }

    setTimeout(() => {
      onAnswerSelected(option, isCorrect);
    }, 850);
  };

  return (
    <div className="flex flex-col justify-center h-full gap-3 sm:gap-4">
      <div className="text-xs sm:text-sm font-semibold text-cyan-300/80 mb-1 flex items-center justify-between">
        <span>Select the correct answer:</span>
        <span className="hidden sm:inline-block text-[11px] text-slate-400">
          Hotkeys: [1], [2], [3], [4]
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === question.targetAnswer;
          const showCorrectHighlight = isLocked && isCorrect;
          const showWrongHighlight = isLocked && isSelected && !isCorrect;

          let buttonStyle =
            "bg-navy-900/80 border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:bg-navy-850 hover:text-white";

          if (showCorrectHighlight) {
            buttonStyle =
              "bg-emerald-500/20 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/20";
          } else if (showWrongHighlight) {
            buttonStyle =
              "bg-rose-500/20 border-rose-400 text-rose-100 shadow-lg shadow-rose-500/20 animate-shake";
          } else if (isLocked) {
            buttonStyle = "bg-navy-950/60 border-slate-900 text-slate-500 opacity-60";
          }

          return (
            <button
              key={`${question.id}-${option}-${index}`}
              onClick={() => handleSelect(option)}
              disabled={isLocked}
              className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left font-semibold text-sm sm:text-base transition-all duration-200 ${buttonStyle}`}
            >
              <div className="flex items-center gap-3">
                {/* Number Key badge */}
                <span
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-bold border transition-colors ${
                    isSelected
                      ? "border-current bg-white/10"
                      : "bg-navy-800/80 border-slate-700/60 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40"
                  }`}
                >
                  {index + 1}
                </span>

                <span className="leading-snug">{option}</span>
              </div>

              {/* Status icon */}
              {showCorrectHighlight && (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center animate-pop">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
              {showWrongHighlight && (
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pop">
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
