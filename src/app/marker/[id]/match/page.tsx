"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMarkerById, getMarkersByPillar } from "@/data/markers";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import StageProgressBar from "@/components/layout/StageProgressBar";
import XpPopup from "@/components/celebration/XpPopup";
import Button from "@/components/ui/Button";
import { shuffleArray } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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

interface MatchItem {
  id: number;
  name: string;
  definition: string;
}

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const markerId = Number(params.id);
  const marker = getMarkerById(markerId);
  const { progress, completeStage } = useUser();
  const p = progress.find((pr) => pr.markerId === markerId);

  // Build pool using ONLY same-pillar markers — never cross-pillar markers
  // the user hasn't been introduced to yet.
  // Pillar sizes: Abiding = 4, Making = 3, Together = 3
  // If pillar has < 4 markers we show all of them (3-way match is fine).
  const [matchItems] = useState<MatchItem[]>(() => {
    const pillarMarkers = getMarkersByPillar(marker?.pillar ?? "abiding");
    // Include all same-pillar markers (current + siblings) — max 4
    const pool = shuffleArray(pillarMarkers).slice(0, 4);
    // Ensure the current marker is always in the pool
    const hasCurrentMarker = pool.some((m) => m.id === markerId);
    if (!hasCurrentMarker && marker) {
      pool[0] = marker; // replace first slot with current marker
    }
    return shuffleArray(pool).map((m) => ({
      id: m.id,
      name: m.name,
      definition: m.definition.slice(0, 120) + (m.definition.length > 120 ? "…" : ""),
    }));
  });

  const [names] = useState(() => shuffleArray(matchItems.map((m) => ({ id: m.id, text: m.name }))));
  const [defs] = useState(() => shuffleArray(matchItems.map((m) => ({ id: m.id, text: m.definition }))));

  const [selectedName, setSelectedName] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);
  const [done, setDone] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [errors, setErrors] = useState(0);

  if (!marker) return <div className="p-8 text-center">Marker not found.</div>;

  const stagesCompleted = getStagesCompleted(p);

  const handleSelectDef = useCallback(
    async (defId: number) => {
      if (selectedName === null) return;
      if (matched.includes(selectedName)) return;

      if (selectedName === defId) {
        const newMatched = [...matched, defId];
        setMatched(newMatched);
        setSelectedName(null);
        if (newMatched.length === matchItems.length) {
          setTimeout(async () => {
            const result = await completeStage(markerId, "match");
            if (result.xpGain > 0) {
              setXpAmount(result.xpGain);
              setShowXp(true);
            }
            setDone(true);
          }, 600);
        }
      } else {
        setErrors((e) => e + 1);
        setWrongPair([selectedName, defId]);
        setTimeout(() => {
          setWrongPair(null);
          setSelectedName(null);
        }, 900);
      }
    },
    [selectedName, matched, matchItems.length, completeStage, markerId]
  );

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
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-[#1a2744] mb-2">All Matched!</h2>
            <p className="text-[#6b6b6b] text-sm mb-2">
              {errors === 0
                ? "Perfect — no mistakes! 🌟"
                : `${errors} mistake${errors === 1 ? "" : "s"} — keep practicing!`}
            </p>
            <p className="text-[#6b6b6b] text-sm mb-8">
              Now let&apos;s fill in some blanks.
            </p>
            <Button variant="primary" size="lg" onClick={() => router.push(`/marker/${markerId}/fillblank`)}>
              Continue →
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showBack backHref={`/marker/${markerId}/repeat`} title={marker.name} showProfile={false} />
      <StageProgressBar
        currentStage="match"
        completedStages={stagesCompleted}
        className="py-3 border-b border-[#e8e2d9]"
      />
      <XpPopup xp={xpAmount} show={showXp} />

      <div className="px-4 py-3">
        <p className="text-sm text-[#6b6b6b]">
          Tap a name, then tap its matching definition.
        </p>
      </div>

      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        <div className="flex gap-3">
          {/* Names column */}
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] text-center mb-1">
              Markers
            </p>
            {names.map((item) => {
              const isMatched = matched.includes(item.id);
              const isSelected = selectedName === item.id;
              const isWrong = wrongPair?.[0] === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => !isMatched && setSelectedName(item.id)}
                  className={`rounded-xl px-3 py-3 text-xs font-semibold text-center transition-all ${
                    isMatched
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : isSelected
                      ? "bg-[#1a2744] text-white border-2 border-[#1a2744]"
                      : isWrong
                      ? "bg-red-100 text-red-600 border-2 border-red-300 animate-shake"
                      : "bg-[#f8f5f0] text-[#1a2744] border-2 border-[#e8e2d9] hover:border-[#1a2744]"
                  }`}
                  disabled={isMatched}
                >
                  {item.text}
                </button>
              );
            })}
          </div>

          {/* Definitions column */}
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6b6b6b] text-center mb-1">
              Definitions
            </p>
            {defs.map((item) => {
              const isMatched = matched.includes(item.id);
              const isWrong = wrongPair?.[1] === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectDef(item.id)}
                  className={`rounded-xl px-3 py-3 text-[10px] text-left transition-all leading-snug ${
                    isMatched
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : isWrong
                      ? "bg-red-100 text-red-600 border-2 border-red-300 animate-shake"
                      : selectedName !== null
                      ? "bg-white text-[#1a2744] border-2 border-[#c8973a] cursor-pointer hover:bg-amber-50"
                      : "bg-[#f8f5f0] text-[#1a2744] border-2 border-[#e8e2d9]"
                  }`}
                  disabled={isMatched}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
