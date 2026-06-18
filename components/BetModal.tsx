"use client";

import { useState } from "react";
import Celebration from "./Celebration";
import FailureAnimation from "./FailureAnimation";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  userBet?: { homeScore: number; awayScore: number; points: number | null } | null;
}

export default function BetModal({
  match,
  existingBet,
  onClose,
  onSuccess,
}: {
  match: Match;
  existingBet: { homeScore: number; awayScore: number; points: number | null } | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [homeScore, setHomeScore] = useState(existingBet?.homeScore?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(existingBet?.awayScore?.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const h = parseInt(homeScore);
    const a = parseInt(awayScore);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) {
      setError("Digite placares válidos");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id, homeScore: h, awayScore: a }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar palpite");
      }

      if (existingBet) {
        setShowCelebration(true);
      } else {
        setShowCelebration(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar palpite");
      setShowFailure(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-surface rounded-3xl p-6 w-full max-w-sm border border-primary/20 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold mb-1">Seu Palpite</h3>
            <p className="text-text-muted text-sm">
              {match.homeTeam} vs {match.awayTeam}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 text-center">
                <p className="text-sm font-medium mb-2 text-text-muted">{match.homeTeam}</p>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="w-20 h-20 text-center text-3xl font-black bg-surface-light border border-primary/20 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
              <span className="text-2xl text-text-muted font-bold mt-8">×</span>
              <div className="flex-1 text-center">
                <p className="text-sm font-medium mb-2 text-text-muted">{match.awayTeam}</p>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="w-20 h-20 text-center text-3xl font-black bg-surface-light border border-primary/20 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-danger text-sm text-center animate-shake">{error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-surface-light hover:bg-surface-light/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Salvando..." : existingBet ? "Atualizar" : "Palpitar!"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCelebration && (
        <Celebration
          message="Palpite registrado com sucesso!"
          onFinish={() => {
            setShowCelebration(false);
            onSuccess();
          }}
        />
      )}

      {showFailure && (
        <FailureAnimation
          message={error || "Algo deu errado"}
          onFinish={() => setShowFailure(false)}
        />
      )}
    </>
  );
}
