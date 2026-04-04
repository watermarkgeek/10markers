"use client";

import { useState, useEffect } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { MARKERS, PILLARS } from "@/data/markers";
import type { Pillar } from "@/data/markers";
import { shuffleArray } from "@/lib/utils";
import { CheckCircle2, XCircle, X } from "lucide-react";

const PILLARS_ORDER: Pillar[] = ["abiding", "making", "enjoying"];

const PILLAR_STYLES: Record<Pillar, { bg: string; border: string; active: string; text: string; label: string; glow: string }> = {
  abiding: {
    bg: "bg-[#eef6f9]",
    border: "border-[#2e6e84]",
    active: "bg-[#2e6e84]",
    text: "text-[#2e6e84]",
    label: "Abiding in Jesus",
    glow: "shadow-[0_0_0_3px_rgba(46,110,132,0.3)]",
  },
  making: {
    bg: "bg-[#eef7f2]",
    border: "border-[#2e7d5e]",
    active: "bg-[#2e7d5e]",
    text: "text-[#2e7d5e]",
    label: "Making Disciples",
    glow: "shadow-[0_0_0_3px_rgba(46,125,94,0.3)]",
  },
  enjoying: {
    bg: "bg-[#fdf6ed]",
    border: "border-[#b07a2e]",
    active: "bg-[#b07a2e]",
    text: "text-[#b07a2e]",
    label: "Enjoying Life Together",
    glow: "shadow-[0_0_0_3px_rgba(176,122,46,0.3)]",
  },
};

interface SortState {
  abiding: number[];
  making: number[];
  enjoying: number[];
}

export default function PillarsSortPage() {
  const router = useRouter();
  const mounted = useMounted();
  const [shuffledMarkers] = useState(() => shuffleArray([...MARKERS]));

  const [sorted, setSorted] = useState<SortState>({ abiding: [], making: [], enjoying: [] });
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState(true);

  // Auto-dismiss the hint after a few seconds or on first interaction
  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => setShowHint(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showHint]);

  // Markers not yet placed
  const placed = new Set([...sorted.abiding, ...sorted.making, ...sorted.enjoying]);
  const unplaced = shuffledMarkers.filter((m) => !placed.has(m.id));

  const selectMarker = (id: number) => {
    if (checked) return;
    setShowHint(false);
    setSelected((prev) => (prev === id ? null : id));
  };

  const placeInPillar = (pillar: Pillar) => {
    if (checked || selected === null) return;
    setSorted((prev) => {
      const next = { ...prev };
      // Remove from any existing bucket first
      PILLARS_ORDER.forEach((p) => {
        next[p] = next[p].filter((id) => id !== selected);
      });
      next[pillar] = [...next[pillar], selected];
      return next;
    });
    setSelected(null);
  };

  const removeFromPillar = (markerId: number, pillar: Pillar) => {
    if (checked) return;
    setSorted((prev) => ({
      ...prev,
      [pillar]: prev[pillar].filter((id) => id !== markerId),
    }));
  };

  const checkAnswers = () => {
    const res: Record<number, boolean> = {};
    MARKERS.forEach((m) => {
      const bucket = PILLARS_ORDER.find((p) => sorted[p].includes(m.id));
      res[m.id] = bucket === m.pillar;
    });
    setResults(res);
    setChecked(true);
  };

  const allCorrect = checked && Object.values(results).every(Boolean);
  const correctCount = checked ? Object.values(results).filter(Boolean).length : 0;

  const retryWrong = () => {
    const wrongIds = MARKERS.filter((m) => !results[m.id]).map((m) => m.id);
    setSorted((prev) => {
      const next = { ...prev };
      PILLARS_ORDER.forEach((p) => {
        next[p] = next[p].filter((id) => !wrongIds.includes(id));
      });
      return next;
    });
    setChecked(false);
    setResults({});
    setSelected(null);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Header title="Sort the Markers" showBack backHref="/learn/pillars" showProfile={false} />
      </div>
    );
  }

  const hasSelection = selected !== null;

  return (
    <div className="flex flex-col h-full bg-white">
      <Header title="Sort the Markers" showBack backHref="/learn/pillars" showProfile={false} />

      {/* Instructions */}
      <div className="px-5 pt-3 pb-2">
        <AnimatePresence mode="wait">
          {checked ? (
            <motion.p
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[#6b6b6b]"
            >
              {allCorrect
                ? "🎉 Perfect — all 10 in the right pillar!"
                : `${correctCount}/10 correct. Wrong ones sent back — try again!`}
            </motion.p>
          ) : showHint ? (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#ee7625] animate-pulse" />
              <p className="text-sm text-[#28312f] font-medium">
                Tap a marker, then tap a pillar to place it
              </p>
            </motion.div>
          ) : hasSelection ? (
            <motion.p
              key="place"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-[#28312f] font-medium"
            >
              Now tap a pillar below to place it ↓
            </motion.p>
          ) : (
            <motion.p
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-[#6b6b6b]"
            >
              {unplaced.length > 0
                ? `${placed.size}/10 placed — tap a marker to continue`
                : "All placed! Check your answers below."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Unplaced word bank */}
      {unplaced.length > 0 && (
        <div className="px-4 py-2.5 flex flex-wrap gap-2 border-b border-[#e8e2d9]">
          {unplaced.map((m) => {
            const isSelected = selected === m.id;
            return (
              <motion.button
                key={m.id}
                onClick={() => selectMarker(m.id)}
                animate={isSelected ? { scale: 1.05, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-colors ${
                  isSelected
                    ? "bg-[#28312f] text-white border-[#28312f] shadow-lg"
                    : "bg-white text-[#28312f] border-[#e8e2d9] hover:border-[#28312f]"
                }`}
              >
                {m.icon} {m.name.replace("A ", "")}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Pillar buckets */}
      <div className="flex-1 min-h-0 px-4 py-3 space-y-2.5 overflow-y-auto">
        {PILLARS_ORDER.map((pillar) => {
          const style = PILLAR_STYLES[pillar];
          const ids = sorted[pillar];

          return (
            <motion.div
              key={pillar}
              onClick={() => placeInPillar(pillar)}
              animate={
                hasSelection && !checked
                  ? { scale: 1.01 }
                  : { scale: 1 }
              }
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`rounded-2xl border-2 min-h-[72px] p-3 transition-all ${
                checked
                  ? `${style.bg} ${style.border}`
                  : hasSelection
                  ? `${style.bg} ${style.border} ${style.glow} cursor-pointer`
                  : `${style.bg} ${style.border}`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
                  {style.label}
                </p>
                {hasSelection && !checked && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-[10px] font-bold uppercase tracking-wider ${style.text} opacity-70`}
                  >
                    Tap to place
                  </motion.span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ids.map((id) => {
                  const marker = MARKERS.find((m) => m.id === id)!;
                  const isRight = checked ? results[id] : null;
                  return (
                    <span
                      key={id}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-all ${
                        checked
                          ? isRight
                            ? "bg-green-100 border-green-400 text-green-700"
                            : "bg-red-100 border-red-400 text-red-700"
                          : "bg-white border-[#e8e2d9] text-[#28312f]"
                      }`}
                    >
                      {checked && (isRight ? <CheckCircle2 size={11} /> : <XCircle size={11} />)}
                      {marker.icon} {marker.name.replace("A ", "")}
                      {!checked && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromPillar(id, pillar); }}
                          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-[#e8e2d9] transition-colors"
                          aria-label={`Remove ${marker.name}`}
                        >
                          <X size={12} className="text-[#b0a898]" />
                        </button>
                      )}
                    </span>
                  );
                })}
                {ids.length === 0 && !hasSelection && (
                  <span className="text-xs italic text-[#b0a898]">
                    No markers yet
                  </span>
                )}
                {ids.length === 0 && hasSelection && !checked && (
                  <span className={`text-xs italic ${style.text} opacity-60`}>
                    Tap to place here
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action button */}
      <div className="shrink-0 px-5 pb-4 pt-2 border-t border-[#e8e2d9]">
        {!checked ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={checkAnswers}
            disabled={placed.size < MARKERS.length}
          >
            Check Answers →
          </Button>
        ) : allCorrect ? (
          <Button variant="primary" size="lg" fullWidth onClick={() => router.push("/learn/pillars/quiz")}>
            Pillar Quiz →
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button variant="secondary" size="lg" fullWidth onClick={retryWrong}>
              Fix wrong ones
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={() => router.push("/learn/pillars/quiz")}>
              Skip to quiz →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
