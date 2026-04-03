"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { MARKERS, PILLARS } from "@/data/markers";
import type { Pillar } from "@/data/markers";
import { shuffleArray } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

const PILLARS_ORDER: Pillar[] = ["abiding", "making", "enjoying"];

const PILLAR_STYLES: Record<Pillar, { bg: string; border: string; active: string; text: string; label: string }> = {
  abiding: {
    bg: "bg-[#eef6f9]",
    border: "border-[#2e6e84]",
    active: "bg-[#2e6e84]",
    text: "text-[#2e6e84]",
    label: "Abiding in Jesus",
  },
  making: {
    bg: "bg-[#eef7f2]",
    border: "border-[#2e7d5e]",
    active: "bg-[#2e7d5e]",
    text: "text-[#2e7d5e]",
    label: "Making Disciples",
  },
  enjoying: {
    bg: "bg-[#fdf6ed]",
    border: "border-[#b07a2e]",
    active: "bg-[#b07a2e]",
    text: "text-[#b07a2e]",
    label: "Enjoying Life Together",
  },
};

interface SortState {
  abiding: number[];
  making: number[];
  enjoying: number[];
}

export default function PillarsSortPage() {
  const router = useRouter();
  const shuffledMarkers = useMemo(() => shuffleArray([...MARKERS]), []);

  const [sorted, setSorted] = useState<SortState>({ abiding: [], making: [], enjoying: [] });
  const [selected, setSelected] = useState<number | null>(null); // marker id being moved
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  // Markers not yet placed
  const placed = new Set([...sorted.abiding, ...sorted.making, ...sorted.enjoying]);
  const unplaced = shuffledMarkers.filter((m) => !placed.has(m.id));

  const selectMarker = (id: number) => {
    if (checked) return;
    setSelected((prev) => (prev === id ? null : id));
  };

  const placeInPillar = (pillar: Pillar) => {
    if (checked) return;
    if (selected === null) return;
    // remove from all buckets first
    setSorted((prev) => {
      const next = { ...prev };
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
    setSelected(markerId);
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
    // remove wrong ones back to unplaced
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="Sort the Markers" showBack backHref="/learn/pillars" showProfile={false} />

      <div className="px-5 pt-4 pb-2">
        <p className="text-sm text-[#6b6b6b]">
          {!checked
            ? "Tap a marker to select it, then tap a pillar to place it."
            : allCorrect
            ? "🎉 Perfect — all 10 in the right pillar!"
            : `${correctCount}/10 correct. Wrong ones sent back — try again!`}
        </p>
      </div>

      {/* Unplaced word bank */}
      {unplaced.length > 0 && (
        <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-[#e8e2d9]">
          {unplaced.map((m) => (
            <button
              key={m.id}
              onClick={() => selectMarker(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                selected === m.id
                  ? "bg-[#28312f] text-white border-[#28312f]"
                  : "bg-white text-[#28312f] border-[#e8e2d9] hover:border-[#28312f]"
              }`}
            >
              {m.icon} {m.name.replace("A ", "")}
            </button>
          ))}
        </div>
      )}

      {/* Pillar buckets */}
      <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
        {PILLARS_ORDER.map((pillar) => {
          const style = PILLAR_STYLES[pillar];
          const ids = sorted[pillar];
          const isTarget = selected !== null;

          return (
            <div
              key={pillar}
              onClick={() => placeInPillar(pillar)}
              className={`rounded-2xl border-2 min-h-[80px] p-3 cursor-pointer transition-all ${
                isTarget && !checked
                  ? `${style.active} border-transparent`
                  : `${style.bg} ${style.border}`
              }`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                  isTarget && !checked ? "text-white" : style.text
                }`}
              >
                {style.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {ids.map((id) => {
                  const marker = MARKERS.find((m) => m.id === id)!;
                  const isRight = checked ? results[id] : null;
                  return (
                    <button
                      key={id}
                      onClick={(e) => { e.stopPropagation(); removeFromPillar(id, pillar); }}
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
                    </button>
                  );
                })}
                {ids.length === 0 && (
                  <span className={`text-xs italic ${isTarget && !checked ? "text-white text-opacity-70" : "text-[#b0a898]"}`}>
                    Drop markers here
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action button */}
      <div className="px-5 pb-6 pt-2 border-t border-[#e8e2d9]">
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
