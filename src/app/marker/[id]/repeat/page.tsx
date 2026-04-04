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

interface CardDef {
  id: number;
  frontLabel: string;
  frontText: string;
  backLabel: string;
  backText: string;
  isScripture?: boolean;
}

function getStagesCompleted(p: MarkerProgress | undefined): Stage[] {
  if (!p) return [];
  const done: Stage[] = [];
  if (p.introCompleted)   done.push("intro");
  if (p.repeatCompleted)  done.push("repeat");
  if (p.matchCompleted)   done.push("match");
  if (p.fillblankCompleted) done.push("fillblank");
  if (p.quizCompleted)    done.push("quiz");
  return done;
}

export default function RepeatPage() {
  const params  = useParams();
  const router  = useRouter();
  const markerId = Number(params.id);
  const marker   = getMarkerById(markerId);
  const { progress, completeStage } = useUser();
  const p = progress.find((pr) => pr.markerId === markerId);

  // ── Three cards: definition, scripture reference, scripture text ──────────
  // Card 1: name → definition        (teaches what the marker means)
  // Card 2: name → scripture ref     (teaches WHICH verse is linked — supports Quiz Q3)
  // Card 3: scripture ref → full text (teaches what the verse says — supports Quiz Q4)
  const cards: CardDef[] = marker
    ? [
        {
          id: 0,
          frontLabel: "Marker Name",
          frontText: marker.name,
          backLabel: "Definition",
          backText: marker.definition,
        },
        {
          id: 1,
          frontLabel: "Marker Name",
          frontText: marker.name,
          backLabel: "Scripture Reference",
          backText: marker.scripture.reference,
        },
        {
          id: 2,
          frontLabel: "Scripture Reference",
          frontText: marker.scripture.reference,
          backLabel: "Full Verse (ESV)",
          backText: marker.scripture.text,
          isScripture: true,
        },
      ]
    : [];

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState<Record<number, CardRating | null>>({ 0: null, 1: null, 2: null });
  const [attempts, setAttempts] = useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [done, setDone] = useState(false);

  if (!marker) return <div className="p-8 text-center">Marker not found.</div>;

  const stagesCompleted = getStagesCompleted(p);
  const currentCard     = cards[cardIndex];
  const totalCards      = cards.length;

  const handleFlip = () => setFlipped((f) => !f);

  const handleRate = useCallback(
    async (rating: CardRating) => {
      const newAttempts = { ...attempts, [cardIndex]: attempts[cardIndex] + 1 };
      const newRatings  = { ...ratings,  [cardIndex]: rating };
      setAttempts(newAttempts);
      setRatings(newRatings);
      setFlipped(false);

      setTimeout(async () => {
        const nextIndex = cardIndex + 1;
        if (nextIndex < totalCards) {
          setCardIndex(nextIndex);
        } else {
          // Check if any cards need a second pass
          const needsReview = Object.entries(newRatings).some(
            ([k, r]) => r === "not_yet" && newAttempts[Number(k)] < 2
          );
          if (needsReview) {
            // Reset "not yet" cards and loop
            const resetRatings = { ...newRatings };
            Object.keys(resetRatings).forEach((k) => {
              if (resetRatings[Number(k)] === "not_yet") resetRatings[Number(k)] = null;
            });
            setRatings(resetRatings);
            setCardIndex(0);
          } else {
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
    [cardIndex, ratings, attempts, totalCards, completeStage, markerId]
  );

  const handleContinue = () => router.push(`/marker/${markerId}/match`);

  if (done) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Header showBack title={marker.name} showProfile={false} />
        <XpPopup xp={xpAmount} show={showXp} />
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
          >
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-2xl font-bold text-[#28312f] mb-2">Cards Complete!</h2>
            <p className="text-[#6b6b6b] text-sm mb-8">
              Great work reviewing{" "}
              <span className="font-semibold text-[#28312f]">{marker.name}</span>.{" "}
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
    <div className="flex flex-col h-full bg-white">
      <Header showBack backHref={`/marker/${markerId}/intro`} title={marker.name} showProfile={false} />
      <StageProgressBar
        currentStage="repeat"
        completedStages={stagesCompleted}
        className="py-3 border-b border-[#e8e2d9]"
      />
      <XpPopup xp={xpAmount} show={showXp} />

      {/* Card counter */}
      <div className="px-5 py-3 flex items-center justify-between">
        <p className="text-sm text-[#6b6b6b]">Card {cardIndex + 1} of {totalCards}</p>
        <p className="text-xs text-[#b0a898]">Tap card to flip</p>
      </div>

      {/* Flashcard */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-5 pb-4">
        <div
          className="card-flip w-full max-w-sm cursor-pointer"
          onClick={handleFlip}
          style={{ height: currentCard.isScripture ? 300 : 260 }}
        >
          <div className={`card-flip-inner w-full h-full relative ${flipped ? "flipped" : ""}`}>
            {/* Front */}
            <div className="card-front absolute inset-0 bg-[#28312f] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300 mb-4">
                {currentCard.frontLabel}
              </p>
              <p className="text-white text-2xl font-bold leading-snug">{currentCard.frontText}</p>
              <div className="mt-4 flex items-center gap-1.5">
                <RotateCcw size={14} className="text-blue-300" />
                <span className="text-[10px] text-blue-300">tap to reveal</span>
              </div>
            </div>

            {/* Back */}
            <div className="card-back absolute inset-0 bg-[#f8f5f0] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl border-2 border-[#e8e2d9]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ee7625] mb-4">
                {currentCard.backLabel}
              </p>
              <p
                className={`text-[#28312f] leading-relaxed ${currentCard.isScripture ? "text-sm italic" : "text-sm"}`}
              >
                {currentCard.isScripture ? `"${currentCard.backText}"` : currentCard.backText}
              </p>
            </div>
          </div>
        </div>

        {/* Rating buttons — shown only when flipped */}
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
