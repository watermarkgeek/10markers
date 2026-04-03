"use client";

import { useParams, useRouter } from "next/navigation";
import { getMarkerById } from "@/data/markers";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import StageProgressBar from "@/components/layout/StageProgressBar";
import PillarBadge from "@/components/ui/PillarBadge";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { BookOpen, Quote } from "lucide-react";
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

export default function MarkerIntroPage() {
  const params = useParams();
  const router = useRouter();
  const markerId = Number(params.id);
  const marker = getMarkerById(markerId);
  const { progress, completeStage } = useUser();

  if (!marker) {
    return <div className="p-8 text-center text-[#6b6b6b]">Marker not found.</div>;
  }

  const p = progress.find((pr) => pr.markerId === markerId);
  const stagesCompleted = getStagesCompleted(p);

  const handleNext = async () => {
    if (!p?.introCompleted) {
      await completeStage(markerId, "intro");
    }
    router.push(`/marker/${markerId}/repeat`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header
        showBack
        backHref={`/pillar/${marker.pillar}`}
        title={marker.name}
        showProfile={false}
      />
      <StageProgressBar
        currentStage="intro"
        completedStages={stagesCompleted}
        className="py-3 border-b border-[#e8e2d9]"
      />

      <div className="flex-1 px-5 py-6 pb-28 overflow-y-auto">
        {/* Icon + name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-3">{marker.icon}</div>
          <PillarBadge pillar={marker.pillar} className="mb-3" />
          <h2 className="text-2xl font-bold text-[#28312f]">{marker.name}</h2>
        </motion.div>

        {/* Definition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-[#c8973a]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
              What it means
            </h3>
          </div>
          <p className="text-[#28312f] leading-relaxed text-sm">
            {marker.definition}
          </p>
        </motion.div>

        {/* Scripture */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#f8f5f0] rounded-2xl px-5 py-5 mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Quote size={16} className="text-[#c8973a]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b]">
              Key Scripture (ESV)
            </h3>
          </div>
          <p className="text-[#28312f] leading-relaxed text-sm italic mb-3">
            &ldquo;{marker.scripture.text}&rdquo;
          </p>
          <p className="text-[#c8973a] font-semibold text-sm">
            — {marker.scripture.reference}
          </p>
        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div className="px-5 pb-8 pt-3 border-t border-[#e8e2d9] bg-white">
        <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
          Start Learning →
        </Button>
      </div>
    </div>
  );
}
