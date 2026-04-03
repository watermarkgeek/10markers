"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMarkerById, getNextMarker, PILLARS, getMarkersByPillar } from "@/data/markers";
import { useUser } from "@/hooks/useUser";
import Header from "@/components/layout/Header";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import Confetti from "@/components/celebration/Confetti";
import { motion } from "framer-motion";

export default function MarkerCompletePage() {
  const params = useParams();
  const router = useRouter();
  const markerId = Number(params.id);
  const marker = getMarkerById(markerId);
  const nextMarker = getNextMarker(markerId);
  const { progress, badges, loading, refresh } = useUser();

  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    refresh();
    setTimeout(() => setConfettiFired(true), 400);
  }, []);

  if (!marker || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#28312f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const p = progress.find((pr) => pr.markerId === markerId);
  const stars = p?.stars ?? 0;
  const xpEarned = p?.xpEarned ?? 0;

  // Check if this completed a pillar
  const pillarMarkers = getMarkersByPillar(marker.pillar);
  const pillarComplete = pillarMarkers.every(
    (m) => progress.find((pr) => pr.markerId === m.id)?.quizCompleted
  );
  const pillarData = PILLARS[marker.pillar];

  // Check if all complete
  const allComplete = progress.filter((p) => p.quizCompleted).length === 10;

  const isPerfect = stars === 3;
  const intensity = allComplete ? "full" : pillarComplete ? "full" : isPerfect ? "medium" : "light";

  const nextHref = nextMarker
    ? `/marker/${nextMarker.id}/intro`
    : `/pillar/${marker.pillar}`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showBack backHref={`/pillar/${marker.pillar}`} showProfile={false} />
      <Confetti trigger={confettiFired} intensity={intensity} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Pillar complete banner */}
        {pillarComplete && !allComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#28312f] text-white rounded-2xl px-5 py-3 mb-6 w-full"
          >
            <p className="text-sm font-bold">🎉 Pillar Complete!</p>
            <p className="text-blue-200 text-xs mt-0.5">{pillarData.label}</p>
          </motion.div>
        )}

        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#c8973a] text-white rounded-2xl px-5 py-3 mb-6 w-full"
          >
            <p className="text-sm font-bold">🏆 All 10 Markers Complete!</p>
            <p className="text-amber-100 text-xs mt-0.5">
              &ldquo;Abiding in Jesus, we are making disciples together.&rdquo;
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
          className="flex flex-col items-center"
        >
          {/* Badge / icon */}
          <div className="w-28 h-28 rounded-full bg-[#f8f5f0] border-4 border-[#c8973a] flex items-center justify-center text-5xl mb-4 shadow-lg">
            {marker.icon}
          </div>

          <h2 className="text-2xl font-bold text-[#28312f] mb-1">
            {marker.name}
          </h2>
          <p className="text-sm text-[#6b6b6b] mb-4">Marker Complete</p>

          <StarRating stars={stars} size="lg" animated className="mb-5" />

          <div className="flex gap-6 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#c8973a]">{xpEarned}</p>
              <p className="text-xs text-[#6b6b6b] uppercase tracking-wide">XP Earned</p>
            </div>
            <div className="w-px bg-[#e8e2d9]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#28312f]">{stars}/3</p>
              <p className="text-xs text-[#6b6b6b] uppercase tracking-wide">Stars</p>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 w-full"
        >
          {stars < 3 && (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => router.push(`/marker/${markerId}/quiz`)}
            >
              Retake Quiz ↺
            </Button>
          )}

          {nextMarker ? (
            <Button variant="gold" size="lg" fullWidth onClick={() => router.push(nextHref)}>
              Next: {nextMarker.name} →
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          )}

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
