"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  trigger?: boolean;
  intensity?: "light" | "medium" | "full";
}

export default function Confetti({
  trigger = true,
  intensity = "medium",
}: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const configs = {
      light: [
        {
          particleCount: 40,
          spread: 55,
          origin: { y: 0.7 },
          colors: ["#1a2744", "#c8973a", "#3b6fa0"],
        },
      ],
      medium: [
        {
          particleCount: 60,
          spread: 70,
          origin: { x: 0.3, y: 0.6 },
          colors: ["#1a2744", "#c8973a", "#2e7d5e", "#3b6fa0"],
        },
        {
          particleCount: 60,
          spread: 70,
          origin: { x: 0.7, y: 0.6 },
          colors: ["#1a2744", "#c8973a", "#2e7d5e", "#3b6fa0"],
        },
      ],
      full: [
        {
          particleCount: 80,
          spread: 100,
          origin: { x: 0.2, y: 0.5 },
          colors: ["#1a2744", "#c8973a", "#2e7d5e", "#3b6fa0", "#b07a2e"],
        },
        {
          particleCount: 80,
          spread: 100,
          origin: { x: 0.8, y: 0.5 },
          colors: ["#1a2744", "#c8973a", "#2e7d5e", "#3b6fa0", "#b07a2e"],
        },
        {
          particleCount: 40,
          spread: 60,
          origin: { x: 0.5, y: 0.3 },
          colors: ["#1a2744", "#c8973a"],
        },
      ],
    };

    const blasts = configs[intensity];
    blasts.forEach((cfg, i) => {
      setTimeout(() => confetti(cfg), i * 180);
    });
  }, [trigger, intensity]);

  return null;
}
