"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMarkerById } from "@/data/markers";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import StageProgressBar from "@/components/layout/StageProgressBar";
import Button from "@/components/ui/Button";
import XpPopup from "@/components/celebration/XpPopup";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { MarkerProgress } from "@/lib/db/schema";
import type { Stage } from "@/types";

type CardRating = "got_it" | "almost" | "not_yet";

interface CardState {
  side: "definition" | "scripture";
  rating: CardRating | null;
  attempts: number;
}

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

export default function RepeatPage() {
  const params = useParams();
  const router = useRouter();
  const markerId = Number(params.id);
  const marker = getMarkerById(markerId);
  const { progress, completeStage } = useUser();
  const p = progress.find((pr) => pr.markerId === markerId);

  // Two cards: definition card + scripture card
  const cards = ["definition", "scripture"] as const;
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardStates, setCardStates] = useState<Record<number, CardState>>({
    0: { side: "definition", rating: null, attempts: 0 },
    1: { side: "scripture", rating: null, attempts: 0 },
  });
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [done, setDone] = useState(false);

  if (!marker) return <div className="p-8 text-center">Marker not found.</div>;

  const stagesCompleted = getStagesCompleted(p);
  const currentCard = cards[cardIndex];
  const totalCards = cards.length;

  const handleFlip = () => setFlipped((f) => !f);

  const handleRate = useCallback(
    async (rating: CardRating) => {
      const updated = {
        ...cardStates,
        [cardIndex]: {
          ...cardStates[cardIndex],
          rating,
          attempts: cardStates[cardIndex].attempts + 1,
        },
      };
      setCardStates(updated);
      setFlipped(false);

      // Move to next card after a brief pause
      setTimeout(async () => {
        const nextIndex = cardIndex + 1;
        if (nextIndex < totalCards) {
          setCardIndex(nextIndex);
        } else {
          // All cards rated — check if any need review
          const needsReview = Object.values(updated).some(
            (s) => s.rating === "not_yet" && s.attempts < 2
          );
          if (needsReview) {
            // Reset not_yet cards
            const reset = { ...updated };
            Object.keys(reset).forEach((k) => {
              if (reset[Number(k)].rating === "not_yet") {
                reset[Number(k)] = { ...reset[Number(k)], rating: null };
              }
            });
            setCardStates(reset);
            setCardIndex(0);
          } else {
            // Complete the stage
            const result = await completeStage(markerId, "repeat");
            if (result.xpGain > 0) {
              setXpAmount(result.xpGain);
              setShowXp(true);
            }
            setDone(true);
          }
        }
      }, 300);
    },
    [cardIndex, cardStates, totalCards, completeStage, markerId]
  );

  const handleContinue = () => {
    router.push(`/marker/${markerId}/match`);
  };

  const frontText =
    currentCard === "definition"
      ? marker.name
      : marker.scripture.reference;

  const backText =
    currentCard === "definition"
      ? marker.definition
      : marker.scripture.text;

  const frontLabel =
    currentCard === "definition" ? "Marker Name" : "Scripture Reference";
  const backLabel =
    currentCard === "definition" ? "Definition" : "Full Verse (ESV)";

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
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-2xl font-bold text-[#1a2744] mb-2">
              Cards Complete!
            </h2>
            <p className="text-[#6b6b6b] text-sm mb-8">
              Great work reviewing{" "}
              <span className="font-semibold text-[#1a2744]">{marker.name}</span>.
              Ready to play the match game?
            </p>
            <Button variant="primary" size="lg" onClick={handleContinue}>
              Continue to Match →
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showBack backHref={`/marker/${markerId}/intro`} title={marker.name} showProfile={false} />
      <StageProgressBar
        currentStage="repeat"
        completedStages={stagesCompleted}
        className="py-3 border-b border-[#e8e2d9]"
      />
      <XpPopup xp={xpAmount} show={showXp} />

      {/* Card counter */}
      <div className="px-5 py-3 flex items-center justify-between">
        <p className="text-sm text-[#6b6b6b]">
          Card {cardIndex + 1} of {totalCards}
        </p>
        <p className="text-xs text-[#b0a898]">Tap card to flip</p>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4">
        <div
          className="card-flip w-full max-w-sm cursor-pointer"
          onClick={handleFlip}
          style={{ height: 260 }}
        >
          <div className={`card-flip-inner w-full h-full relative ${flipped ? "flipped" : ""}`}>
            {/* Front */}
            <div className="card-front absolute inset-0 bg-[#1a2744] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300 mb-4">
                {frontLabel}
              </p>
              <p className="text-white text-2xl font-bold leading-snug">{frontText}</p>
              <div className="mt-4 flex items-center gap-1.5">
                <RotateCcw size={14} className="text-blue-300" />
                <span className="text-[10px] text-blue-300">tap to reveal</span>
              </div>
            </div>

            {/* Back */}
            <div className="card-back absolute inset-0 bg-[#f8f5f0] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl border-2 border-[#e8e2d9]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c8973a] mb-4">
                {backLabel}
              </p>
              <p className="text-[#1a2744] text-sm leading-relaxed">
                {currentCard === "scripture" ? `"${backText}"` : backText}
              </p>
            </div>
          </div>
        </div>

        {/* Rating buttons — only shown when flipped */}
        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25 }}
              className="flex gap-3 mt-6 w-full max-w-sm"
            >
              <button
                onClick={() => handleRate("not_yet")}
                className="flex-1 py-3 rounded-xl border-2 border-red-200 text-red-500 text-sm font-semibold bg-red-50 hover:bg-red-100 transition-colors"
              >
                ❌ Not yet
              </button>
              <button
                onClick={() => handleRate("almost")}
                className="flex-1 py-3 rounded-xl border-2 border-yellow-200 text-yellow-600 text-sm font-semibold bg-yellow-50 hover:bg-yellow-100 transition-colors"
              >
                🤔 Almost
              </button>
              <button
                onClick={() => handleRate("got_it")}
                className="flex-1 py-3 rounded-xl border-2 border-green-200 text-green-600 text-sm font-semibold bg-green-50 hover:bg-green-100 transition-colors"
              >
                ✅ Got it
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
