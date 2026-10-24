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

  // So'z uzunligiga qarab harf katakchalari o'lchamini dinamik moslash
  const slotSizeConfig = useMemo(() => {
    const len = targetChars.length;
    if (len <= 5) {
      return {
        box: "w-10 h-12 xs:w-12 xs:h-14 sm:w-14 sm:h-16 text-xl sm:text-2xl rounded-xl sm:rounded-2xl",
        gap: "gap-1.5 sm:gap-2.5",
        watermark: "text-xl sm:text-2xl",
        spaceWidth: "w-3 sm:w-4",
      };
    }
    if (len <= 8) {
      return {
        box: "w-8 h-10 xs:w-10 xs:h-12 sm:w-11 sm:h-14 text-base xs:text-lg sm:text-xl rounded-lg sm:rounded-xl",
        gap: "gap-1 sm:gap-2",
        watermark: "text-base xs:text-lg sm:text-xl",
        spaceWidth: "w-2.5 sm:w-3.5",
      };
    }
    if (len <= 12) {
      return {
        box: "w-7 h-9 xs:w-8 xs:h-10 sm:w-9 sm:h-12 text-sm xs:text-base sm:text-lg rounded-md sm:rounded-lg",
        gap: "gap-1 sm:gap-1.5",
        watermark: "text-sm xs:text-base sm:text-lg",
        spaceWidth: "w-2 sm:w-3",
      };
    }
    // 13+ harfli uzun so'z yoki gaplar
    return {
      box: "w-6 h-8 xs:w-7 xs:h-9 sm:w-8 sm:h-10 text-xs xs:text-sm sm:text-base rounded-md",
      gap: "gap-0.5 xs:gap-1 sm:gap-1.5",
      watermark: "text-xs xs:text-sm sm:text-base",
      spaceWidth: "w-1.5 sm:w-2.5",
    };
  }, [targetChars.length]);

  useEffect(() => {
    setEnteredLetters([]);
    setIsEvaluating(false);
    setIsError(false);
    setIsSuccess(false);

    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [question.id]);

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

  // So'z va gaplarni chiroyli guruhlash (harflar so'z ichida bo'linib ketmasligi uchun)
  const wordTokens = useMemo(() => {
    const tokens: Array<{ type: "word" | "space"; startIndex: number; chars: string[] }> = [];
    let currentChars: string[] = [];
    let currentStart = 0;

    targetChars.forEach((char, idx) => {
      if (char === " ") {
        if (currentChars.length > 0) {
          tokens.push({ type: "word", startIndex: currentStart, chars: currentChars });
          currentChars = [];
        }
        tokens.push({ type: "space", startIndex: idx, chars: [" "] });
        currentStart = idx + 1;
      } else {
        if (currentChars.length === 0) {
          currentStart = idx;
        }
        currentChars.push(char);
      }
    });

    if (currentChars.length > 0) {
      tokens.push({ type: "word", startIndex: currentStart, chars: currentChars });
    }

    return tokens;
  }, [targetChars]);

  return (
    <div
      onClick={() => hiddenInputRef.current?.focus()}
      className="relative flex flex-col justify-between h-full gap-3 sm:gap-6 cursor-text"
    >
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer -z-10"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
        aria-hidden="true"
      />

      {/* 1. Asosiy Harf Katakchalari */}
      <div className="flex flex-col items-center justify-center py-1 sm:py-3">
        <div className="text-xs sm:text-sm font-semibold text-cyan-300/90 mb-1.5 flex items-center justify-between w-full">
          <span>Type English translation:</span>
          <span className="text-[11px] text-slate-400">
            {enteredLetters.length} / {targetChars.length} letters
          </span>
        </div>

        <div className="text-[10px] sm:text-xs text-slate-400 mb-2.5 sm:mb-4 flex items-center gap-1.5 text-center">
          <Keyboard className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Faint ghost letters guide your typing. Press keys to type over them:</span>
        </div>

        {/* Dinamik responsive harf qutilari (so'zlar bo'yicha guruhlangan) */}
        <div
          className={`flex flex-wrap items-center justify-center gap-y-2 gap-x-1.5 sm:gap-x-2.5 max-w-full ${
            isError ? "animate-shake" : ""
          }`}
        >
          {wordTokens.map((token, tokenIdx) => {
            if (token.type === "space") {
              return (
                <div
                  key={`space-${token.startIndex}`}
                  className={`${slotSizeConfig.spaceWidth} flex items-center justify-center text-slate-600 font-bold select-none shrink-0`}
                >
                  •
                </div>
              );
            }

            return (
              <div
                key={`word-group-${tokenIdx}`}
                className={`flex items-center ${slotSizeConfig.gap} shrink-0`}
              >
                {token.chars.map((targetChar, charOffset) => {
                  const index = token.startIndex + charOffset;
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

                  return (
                    <div
                      key={`slot-${index}`}
                      className={`${slotSizeConfig.box} relative flex items-center justify-center font-extrabold transition-all duration-150 uppercase select-none border shrink-0 ${slotBorder}`}
                    >
                      {/* Xira suv belgisi harfi */}
                      <span
                        className={`absolute inset-0 flex items-center justify-center text-slate-500/30 font-black ${slotSizeConfig.watermark} pointer-events-none select-none`}
                      >
                        {targetChar.toUpperCase()}
                      </span>

                      {/* Ustidan yozilgan harf */}
                      {isFilled && (
                        <span
                          className={`relative z-10 font-black animate-pop ${
                            isCorrectChar ? "text-cyan-200" : "text-rose-300"
                          }`}
                        >
                          {enteredLetter.toUpperCase()}
                        </span>
                      )}

                      {/* Faol kursor */}
                      {isCurrent && (
                        <div className="absolute bottom-1 w-3 sm:w-4 h-0.5 bg-cyan-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  );
                })}
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
            <span className="text-[11px] text-slate-400 hidden xs:inline-block">
              Type on keyboard or tap buttons below
            </span>
          )}
        </div>
      </div>

      {/* 2. On-Screen Keypad va Amallar */}
      <div className="p-2.5 sm:p-4 rounded-2xl bg-navy-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={enteredLetters.length === 0 || isEvaluating}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-navy-800/60 hover:bg-navy-700 disabled:opacity-40 transition-colors border border-slate-800 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteLetter}
            disabled={enteredLetters.length === 0 || isEvaluating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-40 transition-colors active:scale-95"
          >
            <Delete className="w-4 h-4 text-rose-400" />
            <span>Backspace</span>
          </button>
        </div>

        {/* Harflar palitrasi (Flex-wrap with dynamic buttons) */}
        <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 justify-center">
          {letterPalette.map((char, idx) => (
            <button
              key={`key-${idx}-${char}`}
              type="button"
              onClick={() => handleAddLetter(char)}
              disabled={isEvaluating || isSuccess}
              className="w-8 h-9 xs:w-9 xs:h-10 sm:w-11 sm:h-12 rounded-lg sm:rounded-xl glass-btn text-white font-bold text-sm sm:text-base flex items-center justify-center hover:scale-105 active:scale-90 disabled:opacity-50 select-none shadow-sm"
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
