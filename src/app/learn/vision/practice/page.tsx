"use client";

import { useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { VISION_STATEMENT } from "@/data/markers";
import { shuffleArray } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import { hapticSuccess, hapticError } from "@/lib/haptics";

// ── Fill-in-blank questions ────────────────────────────────────────────────
interface FillQuestion {
  prompt: string; // sentence with ___ for the blank
  answer: string;
  options: string[];
}

const FILL_QUESTIONS_RAW: Omit<FillQuestion, "options">[] = [
  { prompt: "___ in Jesus, we are making disciples together.", answer: "Abiding" },
  { prompt: "Abiding in Jesus, we are ___ disciples together.", answer: "making" },
  { prompt: "Abiding in Jesus, we are making disciples ___.", answer: "together" },
];

const FILL_OPTIONS: string[][] = [
  ["Abiding", "Trusting", "Resting", "Walking"],
  ["making", "teaching", "training", "growing"],
  ["together", "always", "boldly", "daily"],
];

// ── Word scramble helpers ──────────────────────────────────────────────────
const STATEMENT_WORDS = VISION_STATEMENT.replace(".", "").split(" ");

function buildScramble(): string[] {
  return shuffleArray([...STATEMENT_WORDS]);
}

type GamePhase = "fill" | "scramble" | "done";

export default function VisionPracticePage() {
  const router = useRouter();
  const mounted = useMounted();
  const [gamePhase, setGamePhase] = useState<GamePhase>("fill");

  // ── Fill-in-blank state ────────────────────────────────────────────────
  const [fillIndex, setFillIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [fillCorrect, setFillCorrect] = useState(0);

  const [questions] = useState<FillQuestion[]>(() =>
    FILL_QUESTIONS_RAW.map((q, i) => ({
      ...q,
      options: shuffleArray(FILL_OPTIONS[i]),
    }))
  );
  const q = questions[fillIndex];

  const handleFillSelect = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === q.answer) {
      setFillCorrect((c) => c + 1);
      hapticSuccess();
    } else {
      hapticError();
    }
  };

  const handleFillNext = () => {
    if (fillIndex + 1 < questions.length) {
      setFillIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setGamePhase("scramble");
    }
  };

  // ── Scramble state ────────────────────────────────────────────────────
  const [bank, setBank] = useState<string[]>(() => buildScramble());
  const [built, setBuilt] = useState<string[]>([]);
  const [scrambleChecked, setScrambleChecked] = useState(false);
  const [scrambleCorrect, setScrambleCorrect] = useState(false);

  const addWord = (word: string, index: number) => {
    if (scrambleChecked) return;
    setBuilt((b) => [...b, word]);
    setBank((bk) => bk.filter((_, i) => i !== index));
  };

  const removeWord = (word: string, index: number) => {
    if (scrambleChecked) return;
    setBank((bk) => [...bk, word]);
    setBuilt((b) => b.filter((_, i) => i !== index));
  };

  const checkScramble = () => {
    const correct = built.join(" ") === STATEMENT_WORDS.join(" ");
    setScrambleCorrect(correct);
    setScrambleChecked(true);
  };

  const retryScramble = () => {
    setBank(buildScramble());
    setBuilt([]);
    setScrambleChecked(false);
    setScrambleCorrect(false);
  };

  const handleScrambleDone = () => {
    router.push("/learn/vision/complete");
  };

  const progressPct =
    gamePhase === "fill"
      ? Math.round((fillIndex / (questions.length + 1)) * 100)
      : gamePhase === "scramble"
      ? Math.round((questions.length / (questions.length + 1)) * 100)
      : 100;

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Header title="Vision Practice" showBack backHref="/learn/vision" showProfile={false} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <Header title="Vision Practice" showBack backHref="/learn/vision" showProfile={false} />

      {/* Progress */}
      <div className="px-5 pt-3 pb-2">
        <ProgressBar value={progressPct} color="navy" height="sm" />
      </div>

      <div className="flex-1 min-h-0 px-5 pt-3 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ── Fill-in-blank ─────────────────────────────────────────────── */}
          {gamePhase === "fill" && (
            <motion.div
              key={`fill-${fillIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs uppercase tracking-widest text-[#ee7625] font-bold mb-3">
                Fill in the blank — {fillIndex + 1} of {questions.length}
              </p>

              {/* Prompt */}
              <div className="bg-[#f8f5f0] rounded-2xl px-6 py-5 mb-5">
                <p
                  className="text-2xl font-bold text-[#28312f] leading-relaxed text-center"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {q.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {q.options.map((opt) => {
                  const isCorrect = opt === q.answer;
                  const isSelected = selected === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleFillSelect(opt)}
                      disabled={revealed}
                      className={`rounded-xl px-5 py-3 text-base font-medium text-left transition-all border-2 ${
                        !revealed
                          ? "bg-white border-[#e8e2d9] text-[#28312f] hover:border-[#28312f]"
                          : isCorrect
                          ? "bg-green-100 border-green-400 text-green-700"
                          : isSelected
                          ? "bg-red-100 border-red-400 text-red-700"
                          : "bg-white border-[#e8e2d9] text-[#b0a898]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {revealed && isCorrect && <CheckCircle2 size={18} className="shrink-0" />}
                        {revealed && isSelected && !isCorrect && <XCircle size={18} className="shrink-0" />}
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Word Scramble ─────────────────────────────────────────────── */}
          {gamePhase === "scramble" && (
            <motion.div
              key="scramble"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs uppercase tracking-widest text-[#ee7625] font-bold mb-2">
                Word Scramble
              </p>
              <p className="text-sm text-[#6b6b6b] mb-3">
                Tap the words in order to build the vision statement.
              </p>

              {/* Built sentence */}
              <div
                className={`min-h-[72px] rounded-2xl border-2 p-4 mb-3 flex flex-wrap gap-2.5 items-start content-start transition-colors ${
                  scrambleChecked
                    ? scrambleCorrect
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                    : "border-[#e8e2d9] bg-[#f8f5f0]"
                }`}
              >
                {built.length === 0 && (
                  <span className="text-base text-[#b0a898] italic">Tap words below…</span>
                )}
                {built.map((word, i) => (
                  <button
                    key={`built-${i}`}
                    onClick={() => removeWord(word, i)}
                    disabled={scrambleChecked}
                    className="px-4 py-2 bg-[#28312f] text-white text-base font-medium rounded-lg"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Result message */}
              {scrambleChecked && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                    scrambleCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {scrambleCorrect ? (
                    <><CheckCircle2 size={16} /> Perfect! That&apos;s exactly right.</>
                  ) : (
                    <><XCircle size={16} /> Not quite — try again!</>
                  )}
                </motion.div>
              )}

              {/* Word bank */}
              <div className="flex flex-wrap gap-2.5 mb-4">
                {bank.map((word, i) => (
                  <button
                    key={`bank-${i}`}
                    onClick={() => addWord(word, i)}
                    disabled={scrambleChecked}
                    className="px-4 py-2 bg-white border-2 border-[#e8e2d9] text-[#28312f] text-base font-medium rounded-lg hover:border-[#28312f] transition-colors disabled:opacity-50"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Bottom pinned button ──────────────────────────────────────────── */}
      {gamePhase === "fill" && (
        <div className={`px-5 pb-4 pt-2 transition-opacity duration-200 ${revealed ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <Button variant="primary" size="lg" fullWidth onClick={handleFillNext}>
            {fillIndex + 1 < questions.length ? "Next →" : "Word Scramble →"}
          </Button>
        </div>
      )}
      {gamePhase === "scramble" && (
        <div className="px-5 pb-4 pt-2">
          {!scrambleChecked ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={checkScramble}
              disabled={built.length !== STATEMENT_WORDS.length}
            >
              Check →
            </Button>
          ) : scrambleCorrect ? (
            <Button variant="primary" size="lg" fullWidth onClick={handleScrambleDone}>
              Complete! →
            </Button>
          ) : (
            <Button variant="secondary" size="lg" fullWidth onClick={retryScramble}>
              Try again
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
