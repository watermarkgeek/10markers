"use client";

import { useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import StarRating from "@/components/ui/StarRating";
import { MARKERS, PILLARS } from "@/data/markers";
import { shuffleArray, starsFromScore } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Pillar } from "@/data/markers";

interface QuizQuestion {
  markerId: number;
  markerName: string;
  markerIcon: string;
  answer: string;  // pillar label
  answerKey: Pillar;
  options: string[];
}

const PILLAR_LABELS: Record<Pillar, string> = {
  abiding: "Abiding in Jesus",
  making: "Making Disciples",
  enjoying: "Enjoying Life Together",
};

export default function PillarsQuizPage() {
  const router = useRouter();

  const mounted = useMounted();

  const [questions] = useState<QuizQuestion[]>(() =>
    shuffleArray(MARKERS.map((marker) => ({
      markerId: marker.id,
      markerName: marker.name,
      markerIcon: marker.icon,
      answer: PILLAR_LABELS[marker.pillar],
      answerKey: marker.pillar,
      options: shuffleArray(Object.values(PILLAR_LABELS)),
    })))
  );

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(0);

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
      const finalCorrect = correct + (selected === q.answer ? 0 : 0);
      const earnedStars = starsFromScore(correct, questions.length);
      setStars(earnedStars);
      setDone(true);
    }
  };

  if (done) {
    const isPerfect = correct === questions.length;
    return (
      <div className="flex flex-col h-full bg-white">
        <Header title="Pillar Quiz" showBack showProfile={false} />
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center gap-5">
          <div className="text-7xl">{isPerfect ? "🏆" : "💪"}</div>
          <h2
            className="text-2xl font-bold text-[#28312f]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isPerfect ? "Perfect Score!" : "Quiz Complete!"}
          </h2>
          <p className="text-[#6b6b6b] text-sm">
            {correct} of {questions.length} correct
          </p>
          <StarRating stars={stars} size="lg" animated className="mb-2" />
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push("/learn/pillars/complete")}
            >
              Complete Phase 3 →
            </Button>
            {stars < 3 && (
              <Button variant="ghost" size="md" fullWidth onClick={() => {
                setQIndex(0); setSelected(null); setRevealed(false); setCorrect(0); setDone(false);
              }}>
                Retake
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Header title="Pillar Quiz" showBack backHref="/learn/pillars/sort" showProfile={false} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <Header title="Pillar Quiz" showBack backHref="/learn/pillars/sort" showProfile={false} />

      <div className="px-5 pt-3 pb-2">
        <div className="flex justify-between text-xs text-[#6b6b6b] mb-1">
          <span>Question {qIndex + 1} of {questions.length}</span>
          <span>{correct} correct</span>
        </div>
        <ProgressBar value={progressPct} color="navy" height="sm" />
      </div>

      <div className="flex-1 min-h-0 px-5 pt-3 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs uppercase tracking-widest text-[#ee7625] font-bold mb-3">
              Which pillar?
            </p>

            {/* Marker card */}
            <div className="bg-[#f8f5f0] rounded-2xl px-6 py-6 mb-6 text-center">
              <div className="text-5xl mb-3">{q.markerIcon}</div>
              <p
                className="text-2xl font-bold text-[#28312f]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {q.markerName}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt) => {
                const isCorrect = opt === q.answer;
                const isSelected = selected === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={revealed}
                    className={`rounded-xl px-5 py-3.5 text-base font-medium text-left transition-all border-2 ${
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
        </AnimatePresence>
      </div>

      {/* Bottom pinned button */}
      <div className={`px-5 pb-4 pt-2 transition-opacity duration-200 ${revealed ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
          {qIndex + 1 < questions.length ? "Next →" : "See Results →"}
        </Button>
      </div>
    </div>
  );
}
