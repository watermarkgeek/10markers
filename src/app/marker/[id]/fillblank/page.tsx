"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMarkerById } from "@/data/markers";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import StageProgressBar from "@/components/layout/StageProgressBar";
import ProgressBar from "@/components/ui/ProgressBar";
import XpPopup from "@/components/celebration/XpPopup";
import Button from "@/components/ui/Button";
import { shuffleArray } from "@/lib/utils";
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

interface Question {
  sentence: string; // with ___ as blank
  answer: string;
  options: string[];
}

function buildQuestions(marker: NonNullable<ReturnType<typeof getMarkerById>>): Question[] {
  const questions: Question[] = [];

  // Q1: Blank from definition — remove the last 2–3 key words
  const defWords = marker.definition.split(" ");
  const keyWordIndex = Math.floor(defWords.length * 0.55);
  const blank1 = defWords.slice(keyWordIndex, keyWordIndex + 3).join(" ");
  const sentence1 =
    defWords.slice(0, keyWordIndex).join(" ") +
    " ___" +
    (defWords.slice(keyWordIndex + 3).length > 0
      ? " " + defWords.slice(keyWordIndex + 3).join(" ")
      : "");

  // Q2: Blank the marker name from a cloze
  const sentence2 = `The marker called "___ " is part of the ${marker.pillar === "abiding" ? "Abiding in Jesus" : marker.pillar === "making" ? "Making Disciples" : "Together"} pillar.`;

  // Q3: Scripture reference blank
  const [book, ...rest] = marker.scripture.reference.split(" ");
  const sentence3 = `The key scripture for ${marker.name} is found in ${book} ___.`;

  questions.push(
    {
      sentence: sentence1,
      answer: blank1,
      options: shuffleArray([blank1, "eternal life with God", "love and service", "the Holy Spirit's power"]).slice(0, 4),
    },
    {
      sentence: sentence2,
      answer: marker.name,
      options: shuffleArray([marker.name, "Gospel Saturated", "Prayerful", "Missional"]).filter(
        (v, i, a) => a.indexOf(v) === i
      ).slice(0, 4),
    },
    {
      sentence: sentence3,
      answer: rest.join(" "),
      options: shuffleArray([rest.join(" "), "3:16", "12:1–2", "1:1"]).filter(
        (v, i, a) => a.indexOf(v) === i
      ).slice(0, 4),
    }
  );

  return questions;
}

export default function FillBlankPage() {
  const params = useParams();
  const router = useRouter();
  const markerId = Number(params.id);
  const marker = getMarkerById(markerId);
  const { progress, completeStage } = useUser();
  const p = progress.find((pr) => pr.markerId === markerId);

  const questions = useMemo(
    () => (marker ? buildQuestions(marker) : []),
    [marker]
  );

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

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
      const result = await completeStage(markerId, "fillblank");
      if (result.xpGain > 0) {
        setXpAmount(result.xpGain);
        setShowXp(true);
      }
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header showBack title={marker.name} showProfile={false} />
        <XpPopup xp={xpAmount} show={showXp} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
          >
            <div className="text-6xl mb-4">✏️</div>
            <h2 className="text-2xl font-bold text-[#1a2744] mb-2">
              Fill-in Complete!
            </h2>
            <p className="text-[#6b6b6b] text-sm mb-2">
              You got {correct} of {questions.length} correct.
            </p>
            <p className="text-[#6b6b6b] text-sm mb-8">
              One final step — let&apos;s prove it!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push(`/marker/${markerId}/quiz`)}
            >
              Start Prove It →
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Parse sentence for rendering the blank nicely
  const parts = q.sentence.split("___");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header
        showBack
        backHref={`/marker/${markerId}/match`}
        title={marker.name}
        showProfile={false}
      />
      <StageProgressBar
        currentStage="fillblank"
        completedStages={stagesCompleted}
        className="py-3 border-b border-[#e8e2d9]"
      />
      <XpPopup xp={xpAmount} show={showXp} />

      {/* Progress */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex justify-between text-xs text-[#6b6b6b] mb-1">
          <span>Question {qIndex + 1} of {questions.length}</span>
        </div>
        <ProgressBar value={progressPct} color="navy" height="sm" />
      </div>

      <div className="flex-1 px-5 pt-6 pb-4 flex flex-col">
        {/* Sentence with blank */}
        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-[#f8f5f0] rounded-2xl px-5 py-5 mb-6 text-sm leading-relaxed text-[#1a2744]">
              {parts[0]}
              <span
                className={`inline-block mx-1 px-3 py-0.5 rounded-lg font-semibold border-2 min-w-[80px] text-center ${
                  revealed
                    ? selected === q.answer
                      ? "bg-green-100 border-green-400 text-green-700"
                      : "bg-red-100 border-red-400 text-red-700 line-through"
                    : "bg-white border-[#c8973a] text-[#c8973a]"
                }`}
              >
                {revealed ? (selected ?? "___") : "___"}
              </span>
              {parts[1]}
            </div>

            {/* Correct answer reveal */}
            {revealed && selected !== q.answer && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-4 px-1"
              >
                <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                <p className="text-sm text-green-700">
                  Correct answer:{" "}
                  <span className="font-semibold">{q.answer}</span>
                </p>
              </motion.div>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const isCorrect = opt === q.answer;
                const isSelected = selected === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={revealed}
                    className={`rounded-xl px-3 py-3 text-sm font-medium text-left transition-all border-2 ${
                      !revealed
                        ? "bg-white border-[#e8e2d9] text-[#1a2744] hover:border-[#1a2744]"
                        : isCorrect
                        ? "bg-green-100 border-green-400 text-green-700"
                        : isSelected
                        ? "bg-red-100 border-red-400 text-red-700"
                        : "bg-white border-[#e8e2d9] text-[#b0a898]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {revealed && isCorrect && <CheckCircle2 size={14} />}
                      {revealed && isSelected && !isCorrect && <XCircle size={14} />}
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-auto pt-6"
          >
            <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
              {qIndex + 1 < questions.length ? "Next →" : "Finish →"}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
