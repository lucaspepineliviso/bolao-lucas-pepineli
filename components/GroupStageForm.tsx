"use client";

import { useState } from "react";
import Celebration from "./Celebration";
import FailureAnimation from "./FailureAnimation";

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
  userBet?: { homeScore: number; awayScore: number; points: number | null } | null;
}

export default function GroupStageForm({ matches, onSaved }: { matches: Match[]; onSaved: () => void }) {
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>(() => {
    const initial: Record<string, { home: string; away: string }> = {};
    for (const m of matches) {
      initial[m.id] = {
        home: m.userBet?.homeScore?.toString() ?? "",
        away: m.userBet?.awayScore?.toString() ?? "",
      };
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const hasExistingBets = matches.some((m) => m.userBet);

  function updateScore(matchId: number, side: "home" | "away", value: string) {
    setScores((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: value },
    }));
  }

  async function handleSave() {
    setErrorMsg("");

    const bets = matches
      .filter((m) => !m.isFinished && new Date(m.matchDate) > new Date())
      .map((m) => ({
        matchId: m.id,
        homeScore: parseInt(scores[m.id]?.home) || 0,
        awayScore: parseInt(scores[m.id]?.away) || 0,
      }));

    if (bets.length === 0) {
      setErrorMsg("Nenhum palpite disponível para salvar");
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
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar");
      }

      if (data.errors > 0) {
        setErrorMsg(`${data.saved} salvos, ${data.errors} com erro`);
      }
      setShowCelebration(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao salvar");
      setShowFailure(true);
    } finally {
      setSaving(false);
    }
  }

  const emptyCount = Object.values(scores).filter((s) => !s.home && !s.away).length;

  const groups = matches.reduce(
    (acc, m) => {
      const g = m.groupName || m.stage;
      if (!acc[g]) acc[g] = [];
      acc[g].push(m);
      return acc;
    },
    {} as Record<string, Match[]>
  );

  return (
    <>
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between bg-surface rounded-2xl p-4 border border-primary/10 sticky top-16 z-40 backdrop-blur-md bg-surface/90">
          <div className="text-sm">
            <span className="text-text-muted">{matches.length} jogos • </span>
            {emptyCount > 0 && <span className="text-accent">{emptyCount} sem palpite</span>}
            {emptyCount === 0 && <span className="text-success">✅ Todos preenchidos</span>}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-dark transition-colors px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
          >
            {saving ? "Salvando..." : hasExistingBets ? "Atualizar Todos" : "Salvar Todos"}
          </button>
        </div>

        {Object.entries(groups).map(([group, groupMatches]) => (
          <div key={group}>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              {group}
            </h2>
            <div className="space-y-2">
              {groupMatches.map((match) => {
                const isPast = new Date(match.matchDate) < new Date();
                return (
                  <div
                    key={match.id}
                    className={`bg-surface rounded-xl p-3 border transition-all ${
                      match.isFinished ? "border-success/20" : "border-primary/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-medium bg-surface-light px-2 py-0.5 rounded-full text-text-muted">
                        {new Date(match.matchDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Sao_Paulo" })}{" "}
                        {new Date(match.matchDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex-1 text-right">
                        <p className="font-bold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none ml-auto">
                          {match.homeTeam}
                        </p>
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
                        <p className="font-bold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                          {match.awayTeam}
                        </p>
                      </div>
                    </div>
                    {match.userBet && match.isFinished && (
                      <div className="mt-2 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            match.userBet.points && match.userBet.points > 0
                              ? "bg-success/20 text-success"
                              : "bg-danger/20 text-danger"
                          }`}
                        >
                          Seu palpite: {match.userBet.homeScore}×{match.userBet.awayScore} ({match.userBet.points ?? 0} pts)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showCelebration && (
        <Celebration message={`Palpites salvos com sucesso!`} onFinish={() => { setShowCelebration(false); onSaved(); }} />
      )}
      {showFailure && (
        <FailureAnimation message={errorMsg || "Erro ao salvar"} onFinish={() => setShowFailure(false)} />
      )}
    </>
  );
}
