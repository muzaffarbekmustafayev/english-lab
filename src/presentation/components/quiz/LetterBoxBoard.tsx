"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Delete, Lightbulb, CheckCircle2, RotateCcw } from "lucide-react";
import { QuizQuestion } from "@/core/entities/QuizSession";
import { soundService } from "@/infrastructure/sound/WebAudioSoundService";
import { normalizeText } from "@/core/entities/Word";

interface LetterBoxBoardProps {
  question: QuizQuestion;
  onAnswerSubmitted: (answer: string, isCorrect: boolean) => void;
}

export function LetterBoxBoard({
  question,
  onAnswerSubmitted,
}: LetterBoxBoardProps) {
  const targetWord = useMemo(() => {
    const raw = question.targetAnswer.trim();
    const primary = raw.includes(",") ? raw.split(",")[0].trim() : raw;
    return primary;
  }, [question.targetAnswer]);

  const targetChars = useMemo(() => {
    return targetWord.split("");
  }, [targetWord]);

  const [enteredLetters, setEnteredLetters] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setEnteredLetters([]);
    setIsEvaluating(false);
    setIsError(false);
    setIsSuccess(false);
  }, [question.id]);

  const letterPalette = useMemo(() => {
    const cleanLetters = targetChars
      .map((c) => c.toUpperCase())
      .filter((c) => /[A-Z0-9'O'G']/i.test(c));

    const extraPool = ["A", "E", "I", "O", "R", "S", "T", "L", "N", "D"];
    const randomExtras = extraPool
      .filter((l) => !cleanLetters.includes(l))
      .slice(0, 3);

    const all = [...cleanLetters, ...randomExtras];

    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    return all;
  }, [targetChars]);

  const handleAddLetter = useCallback((char: string) => {
    if (isEvaluating || isSuccess) return;
    if (enteredLetters.length >= targetChars.length) return;

    soundService.playKeyClick();
    const next = [...enteredLetters, char];
    setEnteredLetters(next);
    setIsError(false);
  }, [enteredLetters, isEvaluating, isSuccess, targetChars.length]);

  const handleDeleteLetter = useCallback(() => {
    if (isEvaluating || isSuccess) return;
    if (enteredLetters.length === 0) return;

    soundService.playKeyClick();
    setEnteredLetters((prev) => prev.slice(0, -1));
    setIsError(false);
  }, [isEvaluating, isSuccess, enteredLetters.length]);

  const handleReset = useCallback(() => {
    if (isEvaluating || isSuccess) return;
    setEnteredLetters([]);
    setIsError(false);
  }, [isEvaluating, isSuccess]);

  const handleHintLetter = useCallback(() => {
    if (isEvaluating || isSuccess) return;
    const currentIndex = enteredLetters.length;
    if (currentIndex < targetChars.length) {
      const correctChar = targetChars[currentIndex].toUpperCase();
      handleAddLetter(correctChar);
    }
  }, [enteredLetters.length, targetChars, handleAddLetter, isEvaluating, isSuccess]);

  useEffect(() => {
    if (enteredLetters.length === targetChars.length && targetChars.length > 0) {
      setIsEvaluating(true);
      const userWord = enteredLetters.join("");
      const isCorrect =
        normalizeText(userWord) === normalizeText(targetWord);

      if (isCorrect) {
        setIsSuccess(true);
        soundService.playCorrect();
        setTimeout(() => {
          onAnswerSubmitted(userWord, true);
        }, 900);
      } else {
        setIsError(true);
        soundService.playIncorrect();
        setTimeout(() => {
          setIsEvaluating(false);
        }, 600);
      }
    }
  }, [enteredLetters, targetChars.length, targetWord, onAnswerSubmitted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEvaluating || isSuccess) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        handleDeleteLetter();
      } else if (e.key === "Escape") {
        handleReset();
      } else if (e.key.length === 1 && /[a-zA-Z0-9' ]/.test(e.key)) {
        e.preventDefault();
        handleAddLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAddLetter, handleDeleteLetter, handleReset, isEvaluating, isSuccess]);

  return (
    <div className="flex flex-col justify-between h-full gap-5">
      {/* 1. Letter Slots */}
      <div className="flex flex-col items-center justify-center py-4 sm:py-6">
        <div className="text-xs sm:text-sm font-semibold text-cyan-300/80 mb-4 flex items-center justify-between w-full">
          <span>Fill in the letters:</span>
          <span className="text-[11px] text-slate-400">
            {enteredLetters.length} of {targetChars.length} letters
          </span>
        </div>

        {/* Letter Boxes */}
        <div
          className={`flex flex-wrap gap-1.5 sm:gap-2.5 justify-center max-w-full ${
            isError ? "animate-shake" : ""
          }`}
        >
          {targetChars.map((targetChar, index) => {
            const letter = enteredLetters[index] || "";
            const isCurrent = index === enteredLetters.length && !isEvaluating;
            const isFilled = index < enteredLetters.length;

            let slotStyle = "glass-slot text-slate-300";

            if (isSuccess) {
              slotStyle =
                "bg-emerald-500/25 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/30 animate-pop";
            } else if (isError) {
              slotStyle =
                "bg-rose-500/25 border-rose-400 text-rose-100 shadow-lg shadow-rose-500/30";
            } else if (isCurrent) {
              slotStyle =
                "border-cyan-400 bg-cyan-500/15 text-cyan-100 shadow-lg shadow-cyan-500/20";
            } else if (isFilled) {
              slotStyle =
                "bg-navy-800/90 border-cyan-500/30 text-white shadow-sm";
            }

            if (targetChar === " ") {
              return (
                <div
                  key={`slot-space-${index}`}
                  className="w-4 sm:w-6 h-10 sm:h-14 flex items-center justify-center text-slate-600 font-bold"
                >
                  •
                </div>
              );
            }

            return (
              <div
                key={`slot-${index}`}
                className={`w-9 h-11 xs:w-10 xs:h-12 sm:w-12 sm:h-16 rounded-xl flex items-center justify-center font-extrabold text-lg sm:text-2xl transition-all duration-200 uppercase select-none ${slotStyle}`}
              >
                {letter}
              </div>
            );
          })}
        </div>

        {/* Status Line */}
        <div className="h-6 mt-3 text-center">
          {isError && (
            <span className="text-xs sm:text-sm font-semibold text-rose-400 flex items-center justify-center gap-1.5 animate-pop">
              Incorrect letter! Backspace to try again.
            </span>
          )}
          {isSuccess && (
            <span className="text-xs sm:text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1.5 animate-pop">
              <CheckCircle2 className="w-4 h-4" /> Correctly solved!
            </span>
          )}
          {!isError && !isSuccess && (
            <span className="text-[11px] text-slate-400 hidden sm:inline-block">
              Type on your keyboard or tap the letters below
            </span>
          )}
        </div>
      </div>

      {/* 2. On-Screen Letter Keypad */}
      <div className="p-3 sm:p-4 rounded-2xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-md">
        {/* Actions bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            onClick={handleReset}
            disabled={enteredLetters.length === 0 || isEvaluating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-navy-800/60 hover:bg-navy-700 disabled:opacity-40 transition-colors border border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Clear</span>
          </button>

          <button
            onClick={handleHintLetter}
            disabled={enteredLetters.length >= targetChars.length || isEvaluating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 disabled:opacity-40 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Reveal Letter</span>
          </button>

          <button
            onClick={handleDeleteLetter}
            disabled={enteredLetters.length === 0 || isEvaluating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-40 transition-colors"
          >
            <Delete className="w-4 h-4 text-rose-400" />
            <span className="hidden xs:inline">Backspace</span>
          </button>
        </div>

        {/* Scrambled keypad buttons */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
          {letterPalette.map((char, idx) => (
            <button
              key={`key-${idx}-${char}`}
              onClick={() => handleAddLetter(char)}
              disabled={isEvaluating || isSuccess}
              className="w-8 h-9 xs:w-9 xs:h-10 sm:w-11 sm:h-12 rounded-xl glass-btn text-white font-bold text-sm sm:text-base flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 select-none shadow-sm"
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
