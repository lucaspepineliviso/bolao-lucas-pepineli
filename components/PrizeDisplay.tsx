"use client";

import { useEffect, useState } from "react";

export default function PrizeDisplay() {
  const [data, setData] = useState({ totalPremium: 0, prize: 0 });

  useEffect(() => {
    fetch("/api/premium-stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (data.totalPremium === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-2xl p-4 border border-accent/20 text-center animate-pulse-glow">
      <p className="text-xs text-text-muted mb-1">🏆 Prêmio Atual</p>
      <p className="text-3xl font-black text-accent">
        R$ {data.prize.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p className="text-xs text-text-muted mt-1">
        {data.totalPremium} participante{data.totalPremium !== 1 ? "s" : ""} premium
      </p>
    </div>
  );
}
