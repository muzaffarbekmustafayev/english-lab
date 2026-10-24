"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Delete, RotateCcw, CheckCircle2, Keyboard } from "lucide-react";
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
  // Asl to'g'ri so'z (masalan: "resilient" yoki "brave")
  const targetWord = useMemo(() => {
    const raw = question.targetAnswer.trim();
    return raw.includes(",") ? raw.split(",")[0].trim() : raw;
  }, [question.targetAnswer]);

  const targetChars = useMemo(() => {
    return targetWord.split("");
  }, [targetWord]);

  const [enteredLetters, setEnteredLetters] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // Yangi savol kelganda holatni tiklash
  useEffect(() => {
    setEnteredLetters([]);
    setIsEvaluating(false);
    setIsError(false);
    setIsSuccess(false);

    // Avtomatik fokus qilish
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [question.id]);

  // Harf qo'shish
  const handleAddLetter = useCallback((char: string) => {
    if (isEvaluating || isSuccess) return;
    if (enteredLetters.length >= targetChars.length) return;

    soundService.playKeyClick();
    const next = [...enteredLetters, char];
    setEnteredLetters(next);
    setIsError(false);
  }, [enteredLetters, isEvaluating, isSuccess, targetChars.length]);

  // Harf o'chirish
  const handleDeleteLetter = useCallback(() => {
    if (isEvaluating || isSuccess) return;
    if (enteredLetters.length === 0) return;

    soundService.playKeyClick();
    setEnteredLetters((prev) => prev.slice(0, -1));
    setIsError(false);
  }, [isEvaluating, isSuccess, enteredLetters.length]);

  // Barchasini tozalash
  const handleReset = useCallback(() => {
    if (isEvaluating || isSuccess) return;
    setEnteredLetters([]);
    setIsError(false);
  }, [isEvaluating, isSuccess]);

  // So'z to'liq terilganda tekshirish
  useEffect(() => {
    if (enteredLetters.length === targetChars.length && targetChars.length > 0) {
      setIsEvaluating(true);
      const userWord = enteredLetters.join("");
      const isCorrect = normalizeText(userWord) === normalizeText(targetWord);

      if (isCorrect) {
        setIsSuccess(true);
        soundService.playCorrect();
        setTimeout(() => {
          onAnswerSubmitted(userWord, true);
        }, 750);
      } else {
        setIsError(true);
        soundService.playIncorrect();
        setTimeout(() => {
          setIsEvaluating(false);
        }, 500);
      }
    }
  }, [enteredLetters, targetChars.length, targetWord, onAnswerSubmitted]);

  // Klaviaturani tinglash
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

  // Klaviaturadagi harflar palitrasi (foydalanuvchi barmoq bilan bosishi uchun)
  const letterPalette = useMemo(() => {
    const letters = targetChars
      .map((c) => c.toUpperCase())
      .filter((c) => /[A-Z0-9'O'G']/i.test(c));

    const extraPool = ["A", "E", "I", "O", "R", "S", "T", "L", "N", "D"];
    const randomExtras = extraPool
      .filter((l) => !letters.includes(l))
      .slice(0, 3);

    const all = [...letters, ...randomExtras];

    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    return all;
  }, [targetChars]);

  return (
    <div
      onClick={() => hiddenInputRef.current?.focus()}
      className="flex flex-col justify-between h-full gap-5 cursor-text"
    >
      {/* Yashirin input (mobil telefonlar virtual klaviaturasi uchun) */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -top-10 -left-10 w-1 h-1 pointer-events-none"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* 1. Asosiy Harf Katakchalari (XIRA ASL SO'Z USTIDAN YOZISH) */}
      <div className="flex flex-col items-center justify-center py-4 sm:py-6">
        <div className="text-xs sm:text-sm font-semibold text-cyan-300/90 mb-2 flex items-center justify-between w-full">
          <span>Type English translation:</span>
          <span className="text-[11px] text-slate-400">
            {enteredLetters.length} of {targetChars.length} letters
          </span>
        </div>

        <div className="text-[11px] text-slate-400 mb-5 flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
          <span>Faint ghost letters guide your typing. Press keys to type over them:</span>
        </div>

        {/* Katakchalar qatori */}
        <div
          className={`flex flex-wrap gap-1.5 sm:gap-2.5 justify-center max-w-full ${
            isError ? "animate-shake" : ""
          }`}
        >
          {targetChars.map((targetChar, index) => {
            const enteredLetter = enteredLetters[index] || "";
            const isFilled = index < enteredLetters.length;
            const isCurrent = index === enteredLetters.length && !isEvaluating;

            const isCorrectChar =
              isFilled &&
              normalizeText(enteredLetter) === normalizeText(targetChar);

            let slotBorder = "border-slate-700/70 bg-navy-900/80";

            if (isSuccess) {
              slotBorder =
                "bg-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-500/30";
            } else if (isError && isFilled && !isCorrectChar) {
              slotBorder =
                "bg-rose-500/25 border-rose-400 shadow-lg shadow-rose-500/30";
            } else if (isCurrent) {
              slotBorder =
                "border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/20";
            } else if (isFilled) {
              slotBorder = "border-cyan-500/40 bg-navy-800/90";
            }

            // Probel belgisi
            if (targetChar === " ") {
              return (
                <div
                  key={`slot-space-${index}`}
                  className="w-4 sm:w-6 h-11 sm:h-16 flex items-center justify-center text-slate-600 font-bold"
                >
                  •
                </div>
              );
            }

            return (
              <div
                key={`slot-${index}`}
                className={`w-9 h-12 xs:w-11 xs:h-14 sm:w-13 sm:h-16 rounded-xl relative flex items-center justify-center font-extrabold text-xl sm:text-2xl transition-all duration-150 uppercase select-none border ${slotBorder}`}
              >
                {/* 1. Xira fon harfi (Asl to'g'ri tarjima suv belgisi) */}
                <span className="absolute inset-0 flex items-center justify-center text-slate-500/30 font-black text-xl sm:text-2xl pointer-events-none select-none">
                  {targetChar.toUpperCase()}
                </span>

                {/* 2. Foydalanuvchi yozgan harf (xira harf ustidan yorqin ko'rinadi) */}
                {isFilled && (
                  <span
                    className={`relative z-10 font-black animate-pop ${
                      isCorrectChar ? "text-cyan-200" : "text-rose-300"
                    }`}
                  >
                    {enteredLetter.toUpperCase()}
                  </span>
                )}

                {/* 3. Kursor indikatori */}
                {isCurrent && (
                  <div className="absolute bottom-1.5 w-4 h-0.5 bg-cyan-400 rounded-full animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Status Line */}
        <div className="h-6 mt-3 text-center">
          {isError && (
            <span className="text-xs sm:text-sm font-semibold text-rose-400 flex items-center justify-center gap-1.5 animate-pop">
              Wrong letter! Press Backspace to correct.
            </span>
          )}
          {isSuccess && (
            <span className="text-xs sm:text-sm font-semibold text-emerald-300 flex items-center justify-center gap-1.5 animate-pop">
              <CheckCircle2 className="w-4 h-4" /> Correctly spelled!
            </span>
          )}
          {!isError && !isSuccess && (
            <span className="text-[11px] text-slate-400">
              Type directly on your keyboard or tap the letters below
            </span>
          )}
        </div>
      </div>

      {/* 2. Boshqaruv tugmalari va Ekrandagi Harflar Palitrasi */}
      <div className="p-3 sm:p-4 rounded-2xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={enteredLetters.length === 0 || isEvaluating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-navy-800/60 hover:bg-navy-700 disabled:opacity-40 transition-colors border border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteLetter}
            disabled={enteredLetters.length === 0 || isEvaluating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-40 transition-colors"
          >
            <Delete className="w-4 h-4 text-rose-400" />
            <span>Backspace</span>
          </button>
        </div>

        {/* Harflar palitrasi */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
          {letterPalette.map((char, idx) => (
            <button
              key={`key-${idx}-${char}`}
              type="button"
              onClick={() => handleAddLetter(char)}
              disabled={isEvaluating || isSuccess}
              className="w-9 h-10 xs:w-10 xs:h-11 sm:w-11 sm:h-12 rounded-xl glass-btn text-white font-bold text-sm sm:text-base flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 select-none shadow-sm"
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
