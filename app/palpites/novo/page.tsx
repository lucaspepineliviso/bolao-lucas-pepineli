"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Celebration from "@/components/Celebration";
import FailureAnimation from "@/components/FailureAnimation";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  stage: string;
  groupName: string | null;
  homeScore: number | null;
  awayScore: number | null;
  isFinished: boolean;
}

const STAGE_ORDER = [
  "GRUPO A", "GRUPO B", "GRUPO C", "GRUPO D", "GRUPO E", "GRUPO F",
  "GRUPO G", "GRUPO H", "GRUPO I", "GRUPO J", "GRUPO K", "GRUPO L",
  "OITAVAS", "OITAVAS FINAL", "QUARTAS", "SEMIFINAL", "3º LUGAR", "FINAL",
];

const STAGE_LABELS: Record<string, string> = {
  "GRUPO A": "Grupo A", "GRUPO B": "Grupo B", "GRUPO C": "Grupo C",
  "GRUPO D": "Grupo D", "GRUPO E": "Grupo E", "GRUPO F": "Grupo F",
  "GRUPO G": "Grupo G", "GRUPO H": "Grupo H", "GRUPO I": "Grupo I",
  "GRUPO J": "Grupo J", "GRUPO K": "Grupo K", "GRUPO L": "Grupo L",
  "OITAVAS": "Oitavas de Final", "OITAVAS FINAL": "Oitavas Final",
  "QUARTAS": "Quartas de Final", "SEMIFINAL": "Semifinal",
  "3º LUGAR": "3º Lugar", "FINAL": "Final",
};

export default function NovoPalpitePage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [scores, setScores] = useState<Record<number, { home: string; away: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasBets, setHasBets] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/bets").then((r) => r.json()),
      fetch("/api/matches").then((r) => r.json()),
    ])
      .then(([user, bets, allMatches]) => {
        if (!user || user.error) { router.push("/login"); return; }
        if (bets.length > 0) { setHasBets(true); setLoading(false); return; }
        setMatches(allMatches);
        setAuthorized(true);
        const initial: Record<number, { home: string; away: string }> = {};
        for (const m of allMatches) {
          initial[m.id] = { home: "", away: "" };
        }
        setScores(initial);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  function updateScore(matchId: number, side: "home" | "away", value: string) {
    setScores((prev) => ({ ...prev, [matchId]: { ...prev[matchId], [side]: value } }));
  }

  const filledCount = Object.entries(scores).filter(
    ([, s]) => s.home !== "" && s.away !== ""
  ).length;

  const totalMatches = matches.length;

  async function handleSave() {
    setErrorMsg("");
    const bets = matches
      .filter((m) => !m.isFinished && new Date(m.matchDate) > new Date())
      .filter((m) => scores[m.id]?.home !== "" && scores[m.id]?.away !== "")
      .map((m) => ({
        matchId: m.id,
        homeScore: parseInt(scores[m.id].home) || 0,
        awayScore: parseInt(scores[m.id].away) || 0,
      }));

    if (bets.length === 0) {
      setErrorMsg("Preencha pelo menos um palpite");
      setShowFailure(true);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/bets/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bets }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar");
      setShowCelebration(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao salvar");
      setShowFailure(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-2xl p-4 animate-pulse">
              <div className="h-5 bg-surface-light rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hasBets) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-black mb-4">📋 Seus Palpites</h1>
        <div className="bg-surface rounded-2xl p-6 border border-primary/20">
          <p className="text-5xl mb-4">✅</p>
          <p className="font-bold text-lg mb-2">Palpites já salvos!</p>
          <p className="text-text-muted text-sm mb-4">Seus palpites foram registrados e não podem mais ser alterados.</p>
          <button onClick={() => router.push("/palpites")} className="bg-primary hover:bg-primary-dark px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
            Ver Meus Palpites
          </button>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  const grouped = STAGE_ORDER.reduce(
    (acc, stage) => {
      const stageMatches = matches.filter((m) => m.stage === stage);
      if (stageMatches.length > 0) acc[stage] = stageMatches;
      return acc;
    },
    {} as Record<string, Match[]>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black mb-2">🎯 Fazer Palpites</h1>
        <p className="text-text-muted text-sm">Preencha todos os jogos e salve de uma vez</p>
      </div>

      <div className="sticky top-16 z-40 backdrop-blur-md bg-background/90 border-b border-primary/10 py-3 mb-6 -mx-4 px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-text-muted">{filledCount}/{totalMatches} preenchidos</span>
            {filledCount === totalMatches && <span className="ml-2 text-success">✅ Todos!</span>}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || filledCount === 0}
            className="bg-primary hover:bg-primary-dark transition-colors px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar Todos os Palpites"}
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([stage, stageMatches]) => (
        <div key={stage} className="mb-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />
            {STAGE_LABELS[stage] || stage}
          </h2>
          <div className="space-y-2">
            {stageMatches.map((match) => {
              const isPast = new Date(match.matchDate) < new Date();
              return (
                <div
                  key={match.id}
                  className={`bg-surface rounded-xl p-3 border transition-all ${
                    match.isFinished ? "border-success/20" : "border-primary/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-medium bg-surface-light px-2 py-0.5 rounded-full text-text-muted">
                      {new Date(match.matchDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}{" "}
                      {new Date(match.matchDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex-1 text-right">
                      <p className="font-bold text-sm truncate max-w-[120px] sm:max-w-none ml-auto">{match.homeTeam}</p>
                    </div>
                    {match.isFinished ? (
                      <div className="flex items-center gap-2 bg-surface-light rounded-xl px-4 py-2 shrink-0">
                        <span className="text-2xl font-black text-success">{match.homeScore}</span>
                        <span className="text-text-muted">×</span>
                        <span className="text-2xl font-black text-success">{match.awayScore}</span>
                      </div>
                    ) : isPast ? (
                      <div className="flex items-center gap-2 bg-surface-light rounded-xl px-4 py-2 shrink-0">
                        <span className="text-lg font-bold">?</span>
                        <span className="text-text-muted">×</span>
                        <span className="text-lg font-bold">?</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={scores[match.id]?.home ?? ""}
                          onChange={(e) => updateScore(match.id, "home", e.target.value)}
                          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-black bg-surface-light border border-primary/20 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                          placeholder="0"
                        />
                        <span className="text-text-muted font-bold">×</span>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={scores[match.id]?.away ?? ""}
                          onChange={(e) => updateScore(match.id, "away", e.target.value)}
                          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-black bg-surface-light border border-primary/20 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                          placeholder="0"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-sm truncate max-w-[120px] sm:max-w-none">{match.awayTeam}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="sticky bottom-4 z-40 mt-6">
        <button
          onClick={handleSave}
          disabled={saving || filledCount === 0}
          className="w-full bg-primary hover:bg-primary-dark transition-colors py-3 rounded-2xl text-base font-bold shadow-lg shadow-primary/30 disabled:opacity-50"
        >
          {saving ? "Salvando..." : `Salvar Todos os Palpites (${filledCount}/${totalMatches})`}
        </button>
      </div>

      {showCelebration && (
        <Celebration
          message="Palpites salvos com sucesso!"
          onFinish={() => { setShowCelebration(false); router.push("/palpites"); }}
        />
      )}
      {showFailure && (
        <FailureAnimation message={errorMsg || "Erro ao salvar"} onFinish={() => setShowFailure(false)} />
      )}
    </div>
  );
}
