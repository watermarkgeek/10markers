"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { VISION_STATEMENT } from "@/data/markers";
import { shuffleArray } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

// ── Fill-in-blank questions ────────────────────────────────────────────────
interface FillQuestion {
  prompt: string; // sentence with ___ for the blank
  answer: string;
  options: string[];
}

const FILL_QUESTIONS: FillQuestion[] = [
  {
    prompt: "___ in Jesus, we are making disciples together.",
    answer: "Abiding",
    options: shuffleArray(["Abiding", "Trusting", "Resting", "Walking"]),
  },
  {
    prompt: "Abiding in Jesus, we are ___ disciples together.",
    answer: "making",
    options: shuffleArray(["making", "teaching", "training", "growing"]),
  },
  {
    prompt: "Abiding in Jesus, we are making disciples ___.",
    answer: "together",
    options: shuffleArray(["together", "always", "boldly", "daily"]),
  },
];

// ── Word scramble helpers ──────────────────────────────────────────────────
const STATEMENT_WORDS = VISION_STATEMENT.replace(".", "").split(" ");

function buildScramble(): string[] {
  return shuffleArray([...STATEMENT_WORDS]);
}

type GamePhase = "fill" | "scramble" | "done";

export default function VisionPracticePage() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<GamePhase>("fill");

  // ── Fill-in-blank state ────────────────────────────────────────────────
  const [fillIndex, setFillIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [fillCorrect, setFillCorrect] = useState(0);

  const questions = useMemo(() => FILL_QUESTIONS, []);
  const q = questions[fillIndex];

  const handleFillSelect = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === q.answer) setFillCorrect((c) => c + 1);
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

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <Header title="Vision Practice" showBack backHref="/learn/vision" showProfile={false} />

      {/* Progress */}
      <div className="px-5 pt-3 pb-2">
        <ProgressBar value={progressPct} color="navy" height="sm" />
      </div>

      <div className="flex-1 min-h-0 px-5 pt-4 pb-6 flex flex-col">
        <AnimatePresence mode="wait">

          {/* ── Fill-in-blank ─────────────────────────────────────────────── */}
          {gamePhase === "fill" && (
            <motion.div
              key={`fill-${fillIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col flex-1 min-h-0"
            >
              <p className="text-xs uppercase tracking-widest text-[#ee7625] font-bold mb-4">
                Fill in the blank — {fillIndex + 1} of {questions.length}
              </p>

              {/* Prompt */}
              <div className="bg-[#f8f5f0] rounded-2xl px-5 py-6 mb-6">
                <p
                  className="text-xl font-bold text-[#28312f] leading-relaxed text-center"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {q.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {q.options.map((opt) => {
                  const isCorrect = opt === q.answer;
                  const isSelected = selected === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleFillSelect(opt)}
                      disabled={revealed}
                      className={`rounded-xl px-4 py-3.5 text-sm font-medium text-left transition-all border-2 ${
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
                        {revealed && isCorrect && <CheckCircle2 size={16} className="shrink-0" />}
                        {revealed && isSelected && !isCorrect && <XCircle size={16} className="shrink-0" />}
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-auto pt-6"
                >
                  <Button variant="primary" size="lg" fullWidth onClick={handleFillNext}>
                    {fillIndex + 1 < questions.length ? "Next →" : "Word Scramble →"}
                  </Button>
                </motion.div>
              )}
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
              className="flex flex-col flex-1 min-h-0"
            >
              <p className="text-xs uppercase tracking-widest text-[#ee7625] font-bold mb-2">
                Word Scramble
              </p>
              <p className="text-sm text-[#6b6b6b] mb-5">
                Tap the words in order to build the vision statement.
              </p>

              {/* Built sentence */}
              <div
                className={`min-h-[80px] rounded-2xl border-2 p-4 mb-4 flex flex-wrap gap-2 items-start content-start transition-colors ${
                  scrambleChecked
                    ? scrambleCorrect
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                    : "border-[#e8e2d9] bg-[#f8f5f0]"
                }`}
              >
                {built.length === 0 && (
                  <span className="text-sm text-[#b0a898] italic">Tap words below…</span>
                )}
                {built.map((word, i) => (
                  <button
                    key={`built-${i}`}
                    onClick={() => removeWord(word, i)}
                    disabled={scrambleChecked}
                    className="px-3 py-1.5 bg-[#28312f] text-white text-sm font-medium rounded-lg"
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
                  className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
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
              <div className="flex flex-wrap gap-2 mb-6">
                {bank.map((word, i) => (
                  <button
                    key={`bank-${i}`}
                    onClick={() => addWord(word, i)}
                    disabled={scrambleChecked}
                    className="px-3 py-1.5 bg-white border-2 border-[#e8e2d9] text-[#28312f] text-sm font-medium rounded-lg hover:border-[#28312f] transition-colors disabled:opacity-50"
                  >
                    {word}
                  </button>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3">
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
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
