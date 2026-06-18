"use client";

import { useEffect, useState } from "react";

export default function FailureAnimation({
  message,
  onFinish,
}: {
  message: string;
  onFinish: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
      <div className="bg-surface/95 rounded-3xl px-8 py-6 border border-danger/30 text-center animate-shake">
        <div className="text-4xl mb-2">😬</div>
        <p className="text-xl font-bold text-danger">Ops!</p>
        <p className="text-sm text-text-muted mt-1">{message}</p>
      </div>
    </div>
  );
}
