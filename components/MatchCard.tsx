"use client";

import { useState } from "react";
import BetModal from "./BetModal";

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

export default function MatchCard({ match, onBetPlaced }: { match: Match; onBetPlaced?: () => void }) {
  const [showModal, setShowModal] = useState(false);

  const matchDate = new Date(match.matchDate);
  const now = new Date();
  const isPast = matchDate < now;

  return (
    <>
      <div
        className={`bg-surface rounded-2xl p-4 border transition-all duration-300 hover:border-primary/40 ${
          match.isFinished ? "border-success/30" : "border-primary/10"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium bg-surface-light px-2.5 py-1 rounded-full text-text-muted">
            {match.stage} {match.groupName && `- ${match.groupName}`}
          </span>
          <span className="text-xs text-text-muted">
            {matchDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}{" "}
            {matchDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-right">
            <p className="font-bold text-lg">{match.homeTeam}</p>
          </div>

          <div className="flex items-center gap-3">
            {match.isFinished ? (
              <div className="flex items-center gap-2 bg-surface-light rounded-xl px-4 py-2">
                <span className="text-2xl font-black text-success">{match.homeScore}</span>
                <span className="text-text-muted text-sm">×</span>
                <span className="text-2xl font-black text-success">{match.awayScore}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-surface-light rounded-xl px-4 py-2">
                <span className="text-lg font-bold">?</span>
                <span className="text-text-muted text-sm">×</span>
                <span className="text-lg font-bold">?</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="font-bold text-lg">{match.awayTeam}</p>
          </div>
        </div>

        {match.userBet && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <div
              className={`text-xs px-3 py-1 rounded-full ${
                match.isFinished
                  ? match.userBet.points && match.userBet.points > 0
                    ? "bg-success/20 text-success"
                    : "bg-danger/20 text-danger"
                  : "bg-primary/20 text-primary"
              }`}
            >
              Seu palpite: {match.userBet.homeScore} × {match.userBet.awayScore}
              {match.isFinished && match.userBet.points !== null && ` (${match.userBet.points} pts)`}
            </div>
          </div>
        )}

        {!match.isFinished && !isPast && (
          <button
            onClick={() => setShowModal(true)}
            className={`mt-3 w-full py-2 rounded-xl text-sm font-medium transition-all ${
              match.userBet
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {match.userBet ? "Editar Palpite" : "Dar Palpite"}
          </button>
        )}

        {isPast && !match.isFinished && (
          <div className="mt-3 text-center text-xs text-text-muted">Aguardando resultado</div>
        )}
      </div>

      {showModal && (
        <BetModal
          match={match}
          existingBet={match.userBet ?? null}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onBetPlaced?.();
          }}
        />
      )}
    </>
  );
}
