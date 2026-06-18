"use client";

import { useEffect, useState } from "react";

const COLORS = ["#6C5CE7", "#00D2D3", "#FDCB6E", "#00B894", "#E17055", "#FD79A8", "#A29BFE"];

export default function Celebration({
  message,
  onFinish,
}: {
  message: string;
  onFinish: () => void;
}) {
  const [balloons, setBalloons] = useState<{ id: number; color: string; left: number; delay: number }[]>([]);

  useEffect(() => {
    const b = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setBalloons(b);

    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: COLORS,
        });
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{
            left: `${b.left}%`,
            top: "100%",
            backgroundColor: b.color,
            animationDelay: `${b.delay}s`,
            animationDuration: `${2 + Math.random()}s`,
          }}
        />
      ))}
      <div className="bg-surface/90 backdrop-blur-md rounded-3xl px-8 py-6 border border-success/30 text-center animate-pop">
        <div className="text-4xl mb-2">🎉</div>
        <p className="text-xl font-bold text-success">{message}</p>
        <p className="text-sm text-text-muted mt-1">Boa sorte!</p>
      </div>
    </div>
  );
}
