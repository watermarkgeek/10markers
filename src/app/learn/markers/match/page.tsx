"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { MARKERS } from "@/data/markers";
import { shuffleArray } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface MatchQuestion {
  marker: typeof MARKERS[0];
  hint: string;
  answer: string; // full marker name
  options: string[];
}

export default function MarkersMatchPage() {
  const router = useRouter();

  const questions: MatchQuestion[] = useMemo(() => {
    const shuffled = shuffleArray([...MARKERS]);
    return shuffled.map((marker) => {
      const others = MARKERS.filter((m) => m.id !== marker.id)
        .map((m) => m.name);
      const distractors = shuffleArray(others).slice(0, 3);
      return {
        marker,
        hint: marker.quizHint,
        answer: marker.name,
        options: shuffleArray([marker.name, ...distractors]),
      };
    });
  }, []);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qIndex];
  const progressPct = Math.round((qIndex / questions.length) * 100);

  const handleSelect = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === q.answer) setCorrect((c) => c + 1);
  };

  const handleNext = () => {
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    const isPerfect = correct === questions.length;
    return (
      <div className="flex flex-col h-[100dvh] bg-white">
        <Header title="Marker Match" showBack backHref="/learn/markers/flashcards" showProfile={false} />
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center gap-5">
          <div className="text-6xl">{isPerfect ? "🏆" : "💪"}</div>
          <h2
            className="text-2xl font-bold text-[#28312f]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isPerfect ? "Perfect!" : "Nice work!"}
          </h2>
          <p className="text-[#6b6b6b] text-sm">
            {correct} of {questions.length} correct
          </p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Button variant="primary" size="lg" fullWidth onClick={() => router.push("/learn/markers/complete")}>
              Complete Phase 2 →
            </Button>
            {!isPerfect && (
              <Button variant="ghost" size="md" fullWidth onClick={() => {
                setQIndex(0); setSelected(null); setRevealed(false); setCorrect(0); setDone(false);
              }}>
                Try again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <Header title="Marker Match" showBack backHref="/learn/markers/flashcards" showProfile={false} />

      <div className="px-5 pt-3 pb-2">
        <div className="flex justify-between text-xs text-[#6b6b6b] mb-1">
          <span>Question {qIndex + 1} of {questions.length}</span>
          <span>{correct} correct</span>
        </div>
        <ProgressBar value={progressPct} color="navy" height="sm" />
      </div>

      <div className="flex-1 min-h-0 px-5 pt-3 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Instruction */}
            <p className="text-xs uppercase tracking-widest text-[#ee7625] font-bold mb-2">
              Which marker does this describe?
            </p>

            {/* Quiz hint */}
            <div className="bg-[#f8f5f0] rounded-2xl px-4 py-3 mb-3">
              <p className="text-sm leading-relaxed text-[#28312f] text-center italic">
                &ldquo;{q.hint}&rdquo;
              </p>
            </div>

            {/* Options — full marker names */}
            <div className="flex flex-col gap-1.5">
              {q.options.map((opt) => {
                const isCorrect = opt === q.answer;
                const isSelected = selected === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={revealed}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium text-left transition-all border-2 ${
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed bottom button */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-4 pt-3"
        >
          <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
            {qIndex + 1 < questions.length ? "Next →" : "See Results →"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
