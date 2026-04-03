"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMarkerById, MARKERS, PILLARS } from "@/data/markers";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import StageProgressBar from "@/components/layout/StageProgressBar";
import ProgressBar from "@/components/ui/ProgressBar";
import XpPopup from "@/components/celebration/XpPopup";
import Confetti from "@/components/celebration/Confetti";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { shuffleArray, starsFromScore } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { MarkerProgress } from "@/lib/db/schema";
import type { Stage } from "@/types";

function getStagesCompleted(p: MarkerProgress | undefined): Stage[] {
  if (!p) return [];
  const done: Stage[] = [];
  if (p.introCompleted) done.push("intro");
  if (p.repeatCompleted) done.push("repeat");
  if (p.matchCompleted) done.push("match");
  if (p.fillblankCompleted) done.push("fillblank");
  if (p.quizCompleted) done.push("quiz");
  return done;
}

interface QuizQuestion {
  question: string;
  answer: string;
  options: string[];
  hint?: string;
}

function buildQuizQuestions(
  marker: NonNullable<ReturnType<typeof getMarkerById>>
): QuizQuestion[] {
  const otherMarkers = shuffleArray(MARKERS.filter((m) => m.id !== marker.id));
  const pillarLabel =
    marker.pillar === "abiding"
      ? "Abiding in Jesus"
      : marker.pillar === "making"
      ? "Making Disciples"
      : "Together";

  const questions: QuizQuestion[] = [
    // Q1 — Which marker matches this definition?
    {
      question: `Which marker is described as: "${marker.definition.slice(0, 100)}…"`,
      answer: marker.name,
      options: shuffleArray([
        marker.name,
        ...otherMarkers.slice(0, 3).map((m) => m.name),
      ]),
    },
    // Q2 — Which pillar?
    {
      question: `The marker "${marker.name}" belongs to which pillar?`,
      answer: pillarLabel,
      options: shuffleArray(
        Object.values(PILLARS).map((p) => p.label)
      ),
    },
    // Q3 — Scripture reference
    {
      question: `What is the key scripture reference for "${marker.name}"?`,
      answer: marker.scripture.reference,
      options: shuffleArray([
        marker.scripture.reference,
        ...otherMarkers.slice(0, 3).map((m) => m.scripture.reference),
      ]),
    },
    // Q4 — Match scripture text to marker
    {
      question: `Which marker goes with this verse?\n\n"${marker.scripture.text.slice(0, 100)}…"`,
      answer: marker.name,
      options: shuffleArray([
        marker.name,
        ...otherMarkers.slice(0, 3).map((m) => m.name),
      ]),
    },
    // Q5 — Match the full verse to the marker (distinct from Q4 which shows a truncated excerpt)
    {
      question: `Which marker is associated with this verse?\n\n"${marker.scripture.text}"`,
      answer: marker.name,
      options: shuffleArray([
        marker.name,
        ...otherMarkers.slice(0, 3).map((m) => m.name),
      ]),
    },
  ];

  return questions;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const markerId = Number(params.id);
  const marker = getMarkerById(markerId);
  const { progress, completeStage } = useUser();
  const p = progress.find((pr) => pr.markerId === markerId);

  const questions = useMemo(
    () => (marker ? buildQuizQuestions(marker) : []),
    [marker]
  );

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!marker) return <div className="p-8 text-center">Marker not found.</div>;

  const stagesCompleted = getStagesCompleted(p);
  const q = questions[qIndex];
  const progressPct = Math.round((qIndex / questions.length) * 100);

  const handleSelect = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    if (option === q.answer) setCorrect((c) => c + 1);
  };

  const handleNext = async () => {
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      const finalCorrect = correct + (selected === q.answer ? 0 : 0); // already counted
      const earnedStars = starsFromScore(correct, questions.length);
      setStars(earnedStars);

      const result = await completeStage(markerId, "quiz", earnedStars);
      if (result.xpGain > 0) {
        setXpAmount(result.xpGain);
        setShowXp(true);
      }
      if (earnedStars >= 2) setShowConfetti(true);
      setDone(true);
    }
  };

  if (done) {
    const isPerfect = correct === questions.length;
    return (
      <div className="flex flex-col h-[100dvh] bg-white">
        <Header showBack title={marker.name} showProfile={false} />
        <XpPopup xp={xpAmount} show={showXp} />
        <Confetti trigger={showConfetti} intensity={isPerfect ? "full" : "medium"} />
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="flex flex-col items-center"
          >
            <div className="text-7xl mb-4">{marker.icon}</div>
            <h2 className="text-2xl font-bold text-[#28312f] mb-2">
              {isPerfect ? "Perfect Score! 🎉" : "Quiz Complete!"}
            </h2>
            <p className="text-[#6b6b6b] text-sm mb-4">
              {correct} of {questions.length} correct
            </p>
            <StarRating stars={stars} size="lg" animated className="mb-6" />

            {stars < 3 && (
              <p className="text-sm text-[#6b6b6b] mb-6">
                Retake to improve your score — you can always do better!
              </p>
            )}

            <div className="flex flex-col gap-3 w-full">
              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={() =>
                  router.push(`/marker/${markerId}/complete`)
                }
              >
                See Results →
              </Button>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => {
                  setQIndex(0);
                  setSelected(null);
                  setRevealed(false);
                  setCorrect(0);
                  setDone(false);
                  setShowConfetti(false);
                }}
              >
                Retake Quiz
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Multi-line question support
  const questionLines = q.question.split("\n\n");

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <Header
        showBack
        backHref={`/marker/${markerId}/fillblank`}
        title={marker.name}
        showProfile={false}
      />
      <StageProgressBar
        currentStage="quiz"
        completedStages={stagesCompleted}
        className="py-3 border-b border-[#e8e2d9]"
      />
      <XpPopup xp={xpAmount} show={showXp} />

      {/* Progress */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex justify-between text-xs text-[#6b6b6b] mb-1">
          <span>Question {qIndex + 1} of {questions.length}</span>
          <span>{correct} correct so far</span>
        </div>
        <ProgressBar value={progressPct} color="navy" height="sm" />
      </div>

      <div className="flex-1 min-h-0 px-5 pt-5 pb-4 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Question */}
            <div className="mb-5">
              {questionLines.map((line, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${
                    i === 0
                      ? "font-semibold text-base text-[#28312f]"
                      : "text-sm italic text-[#6b6b6b] mt-2 bg-[#f8f5f0] rounded-xl px-4 py-3 max-h-28 overflow-y-auto"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {q.options.map((opt) => {
                const isCorrect = opt === q.answer;
                const isSelected = selected === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
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
                      {revealed && isCorrect && (
                        <CheckCircle2 size={16} className="shrink-0" />
                      )}
                      {revealed && isSelected && !isCorrect && (
                        <XCircle size={16} className="shrink-0" />
                      )}
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Next */}
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-auto pt-6"
              >
                <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
                  {qIndex + 1 < questions.length ? "Next →" : "See Results →"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
