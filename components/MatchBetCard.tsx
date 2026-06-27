"use client";

import { useState, useCallback } from "react";
import { isBetOpen, timeUntilKickoff } from "@/lib/bet-utils";
import { calculatePoints } from "@/lib/utils";

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
  classifiedWinner?: string | null;
}

interface Bet {
  id: number;
  homeScore: number;
  awayScore: number;
  points: number | null;
  classifiedChoice?: string | null;
}

export default function MatchBetCard({
  match,
  initialBet,
  onBetSaved,
}: {
  match: Match;
  initialBet: Bet | null;
  onBetSaved?: () => void;
}) {
  const [homeScore, setHomeScore] = useState(initialBet?.homeScore?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(initialBet?.awayScore?.toString() ?? "");
  const [classifiedChoice, setClassifiedChoice] = useState<string | null>(initialBet?.classifiedChoice ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const open = isBetOpen(match.matchDate);
  const countdown = timeUntilKickoff(match.matchDate);

  const isKnockout = !match.stage.startsWith("GRUPO");
  const isDraw = homeScore !== "" && awayScore !== "" && parseInt(homeScore) === parseInt(awayScore);

  const hasBet =
    homeScore !== "" &&
    awayScore !== "" &&
    (!isKnockout || !isDraw || (classifiedChoice !== null && classifiedChoice !== ""));

  const changed = initialBet
    ? homeScore !== initialBet.homeScore.toString() ||
      awayScore !== initialBet.awayScore.toString() ||
      (isKnockout && isDraw && (classifiedChoice ?? "") !== (initialBet.classifiedChoice ?? ""))
    : hasBet;

  const saveBet = useCallback(async () => {
    if (!hasBet || saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          homeScore: parseInt(homeScore) || 0,
          awayScore: parseInt(awayScore) || 0,
          classifiedChoice: isKnockout && isDraw ? classifiedChoice : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onBetSaved?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
      if (err instanceof Error && err.message.includes("Prazo encerrado")) {
        setError("");
      }
    } finally {
      setSaving(false);
    }
  }, [hasBet, saving, homeScore, awayScore, match.id, isKnockout, isDraw, classifiedChoice, onBetSaved]);

  const chooseClassified = async (choice: "HOME" | "AWAY") => {
    if (!open) return;
    setClassifiedChoice(choice);
    setError("");
    setSaved(false);

    setSaving(true);
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: match.id,
          homeScore: parseInt(homeScore) || 0,
          awayScore: parseInt(awayScore) || 0,
          classifiedChoice: choice,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onBetSaved?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleBlur = () => {
    const canAutoSave = !isKnockout || !isDraw || (classifiedChoice !== null && classifiedChoice !== "");
    if (changed && canAutoSave) saveBet();
  };

  let pointsDisplay = null;
  if (match.isFinished && initialBet && match.homeScore !== null && match.awayScore !== null) {
    const isMatchKnockout = !match.stage.startsWith("GRUPO");
    pointsDisplay = calculatePoints(
      initialBet.homeScore,
      initialBet.awayScore,
      match.homeScore,
      match.awayScore,
      isMatchKnockout,
      initialBet.classifiedChoice,
      match.classifiedWinner
    );
  }

  return (
    <div
      className={`bg-surface rounded-xl p-3 border transition-all ${
        match.isFinished ? "border-success/20" : open ? "border-primary/10" : "border-text-muted/20"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
        <span className="text-[11px] font-medium bg-surface-light px-2 py-0.5 rounded-full text-text-muted">
          {new Date(match.matchDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Sao_Paulo" })}{" "}
          {new Date(match.matchDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}
        </span>
        {open && !match.isFinished && (
          <span className="text-[11px] font-medium text-primary">{countdown}</span>
        )}
        {!open && !match.isFinished && (
          <span className="text-[11px] font-medium text-text-muted">🔒 Encerrado</span>
        )}
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
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="number"
              min="0"
              max="50"
              value={homeScore}
              onChange={(e) => { setHomeScore(e.target.value); setError(""); setSaved(false); }}
              onBlur={handleBlur}
              disabled={!open}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-black bg-surface-light border border-primary/20 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="0"
            />
            <span className="text-text-muted font-bold">×</span>
            <input
              type="number"
              min="0"
              max="50"
              value={awayScore}
              onChange={(e) => { setAwayScore(e.target.value); setError(""); setSaved(false); }}
              onBlur={handleBlur}
              disabled={!open}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-black bg-surface-light border border-primary/20 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        )}

        <div className="flex-1">
          <p className="font-bold text-sm truncate max-w-[120px] sm:max-w-none">{match.awayTeam}</p>
        </div>
      </div>

      {isKnockout && isDraw && !match.isFinished && (
        <div className="mt-3 p-3 bg-surface-light rounded-xl border border-primary/10 text-center">
          <p className="text-[11px] font-bold mb-2 text-text-muted">Quem se classifica nos pênaltis/prorrogação?</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              disabled={!open || saving}
              onClick={() => chooseClassified("HOME")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                classifiedChoice === "HOME"
                  ? "bg-primary text-white scale-105 shadow-md shadow-primary/20"
                  : "bg-surface hover:bg-primary/15 text-text-muted"
              } disabled:opacity-50`}
            >
              👈 {match.homeTeam}
            </button>
            <button
              type="button"
              disabled={!open || saving}
              onClick={() => chooseClassified("AWAY")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                classifiedChoice === "AWAY"
                  ? "bg-primary text-white scale-105 shadow-md shadow-primary/20"
                  : "bg-surface hover:bg-primary/15 text-text-muted"
              } disabled:opacity-50`}
            >
              {match.awayTeam} 👉
            </button>
          </div>
        </div>
      )}

      {match.isFinished && initialBet && match.classifiedWinner && isKnockout && (
        <div className="mt-2 text-center text-[10px] text-text-muted">
          Vencedor oficial: <strong className="text-success">{match.classifiedWinner === "HOME" ? match.homeTeam : match.awayTeam}</strong>
          {" | "}
          Seu classificado: <strong className={initialBet.classifiedChoice === match.classifiedWinner ? "text-success" : "text-danger"}>
            {initialBet.classifiedChoice ? (initialBet.classifiedChoice === "HOME" ? match.homeTeam : match.awayTeam) : "Nenhum (Venda regulamentar)"}
          </strong>
        </div>
      )}

      <div className="mt-2 text-center h-5">
        {saving && <span className="text-[11px] text-text-muted">Salvando...</span>}
        {saved && <span className="text-[11px] text-success font-medium">✅ Salvo</span>}
        {error && <span className="text-[11px] text-danger">{error}</span>}
        {!saving && !saved && !error && match.isFinished && initialBet && (
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              pointsDisplay !== null && pointsDisplay > 0
                ? "bg-success/20 text-success"
                : "bg-danger/20 text-danger"
            }`}
          >
            Seu palpite: {initialBet.homeScore}×{initialBet.awayScore}
            {isKnockout && initialBet.homeScore === initialBet.awayScore && initialBet.classifiedChoice && (
              ` (${initialBet.classifiedChoice === "HOME" ? "passa " + match.homeTeam.slice(0, 3) : "passa " + match.awayTeam.slice(0, 3)})`
            )}
            {` | ${pointsDisplay ?? 0} pts`}
          </span>
        )}
        {!saving && !saved && !error && !match.isFinished && hasBet && open && changed && (
          <button
            onClick={saveBet}
            className="text-[11px] px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-full font-bold transition-colors"
          >
            {initialBet ? "Atualizar" : "Salvar"}
          </button>
        )}
        {!saving && !saved && !error && !match.isFinished && hasBet && open && !changed && initialBet && (
          <span className="text-[11px] text-success font-medium">✅ Salvo</span>
        )}
        {!saving && !saved && !error && !match.isFinished && isDraw && isKnockout && !classifiedChoice && (
          <span className="text-[11px] text-accent font-semibold">Escolha quem se classifica</span>
        )}
      </div>
    </div>
  );
}
