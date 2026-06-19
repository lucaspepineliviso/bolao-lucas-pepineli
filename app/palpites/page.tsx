"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isBetOpen, timeUntilKickoff } from "@/lib/bet-utils";

interface Bet {
  id: number;
  homeScore: number;
  awayScore: number;
  points: number | null;
  match: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    matchDate: string;
    stage: string;
    groupName: string | null;
    homeScore: number | null;
    awayScore: number | null;
    isFinished: boolean;
  };
}

interface User {
  id: number;
  name: string;
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

export default function PalpitesPage() {
  const router = useRouter();
  const [bets, setBets] = useState<Bet[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/bets").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()).catch(() => null),
    ])
      .then(([userBets, userData]) => {
        if (!userData || userData.error) { router.push("/login"); return; }
        setBets(userBets);
        setUser(userData);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const totalPoints = bets.reduce((sum, b) => sum + (b.points ?? 0), 0);
  const finishedBets = bets.filter((b) => b.match.isFinished);
  const correctBets = finishedBets.filter((b) => b.points && b.points > 0).length;

  const openBets = bets.filter((b) => isBetOpen(b.match.matchDate) && !b.match.isFinished);

  const grouped = STAGE_ORDER.reduce(
    (acc, stage) => {
      const stageBets = bets.filter((b) => b.match.stage === stage);
      if (stageBets.length > 0) acc[stage] = stageBets;
      return acc;
    },
    {} as Record<string, Bet[]>
  );

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

  if (bets.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-black mb-4">📋 Meus Palpites</h1>
        <div className="bg-surface rounded-2xl p-6 border border-primary/20">
          <p className="text-5xl mb-4">🎯</p>
          <p className="font-bold text-lg mb-2">Nenhum palpite ainda</p>
          <p className="text-text-muted text-sm mb-4">Preencha seus palpites para a Copa.</p>
          <button onClick={() => router.push("/palpites/novo")} className="bg-primary hover:bg-primary-dark px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
            Fazer Palpites
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black mb-2">📋 Meus Palpites</h1>
        <p className="text-text-muted text-sm">Relatório completo dos seus palpites</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-surface rounded-xl p-4 text-center border border-primary/10">
          <p className="text-2xl font-black text-primary">{bets.length}</p>
          <p className="text-xs text-text-muted">Palpites</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-primary/10">
          <p className="text-2xl font-black text-success">{correctBets}</p>
          <p className="text-xs text-text-muted">Acertou</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-primary/10">
          <p className="text-2xl font-black text-accent">{totalPoints}</p>
          <p className="text-xs text-text-muted">Pontos</p>
        </div>
      </div>

      {user && (
        <div className="mb-6 bg-surface rounded-2xl p-4 border border-primary/20">
          <p className="text-sm font-bold mb-2">🔗 Convide seus amigos!</p>
          <p className="text-xs text-text-muted mb-3">Compartilhe seu link e ganhe amigos no bolão</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/cadastro?ref=${user.id}`}
              className="flex-1 px-3 py-2 bg-surface-light border border-primary/20 rounded-lg text-xs text-text-muted truncate"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/cadastro?ref=${user.id}`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-xs font-bold text-white transition-colors shrink-0"
            >
              {copied ? "✅ Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      {openBets.length > 0 && (
        <div className="mb-6">
          <Link
            href="/palpites/novo"
            className="block bg-primary/10 border border-primary/30 rounded-2xl p-4 text-center hover:bg-primary/20 transition-colors"
          >
            <p className="text-sm font-bold text-primary">✏️ Editar palpites abertos</p>
            <p className="text-xs text-text-muted mt-1">
              {openBets.length} jogo{openBets.length > 1 ? "s" : ""} ainda editável{openBets.length > 1 ? "s" : ""}
            </p>
          </Link>
        </div>
      )}

      {Object.entries(grouped).map(([stage, stageBets]) => (
        <div key={stage} className="mb-6">
          <h2 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />
            {STAGE_LABELS[stage] || stage}
          </h2>
          <div className="space-y-2">
            {stageBets.map((bet) => {
              const open = isBetOpen(bet.match.matchDate);
              const countdown = timeUntilKickoff(bet.match.matchDate);

              return (
                <div
                  key={bet.id}
                  className={`bg-surface rounded-xl p-3 border transition-all ${
                    bet.match.isFinished
                      ? bet.points && bet.points > 0
                        ? "border-success/30"
                        : "border-danger/20"
                      : open
                      ? "border-primary/20"
                      : "border-text-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <span className="text-[11px] font-medium bg-surface-light px-2 py-0.5 rounded-full text-text-muted">
                      {new Date(bet.match.matchDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Sao_Paulo" })}
                    </span>
                    <div className="flex items-center gap-2">
                      {bet.match.isFinished && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          bet.points && bet.points > 0
                            ? "bg-success/20 text-success"
                            : "bg-danger/20 text-danger"
                        }`}>
                          {bet.points ?? 0} pts
                        </span>
                      )}
                      {!bet.match.isFinished && open && (
                        <span className="text-[11px] font-medium text-primary">{countdown}</span>
                      )}
                      {!bet.match.isFinished && !open && (
                        <span className="text-[11px] font-medium text-text-muted">🔒 Travado</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-right">
                      <p className="font-bold text-sm truncate">{bet.match.homeTeam}</p>
                    </div>
                    <div className="flex items-center gap-2 mx-3">
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-bold">
                        {bet.homeScore} × {bet.awayScore}
                      </span>
                      {bet.match.isFinished && (
                        <>
                          <span className="text-text-muted text-xs">→</span>
                          <span className="bg-surface-light px-3 py-1 rounded-lg text-sm font-bold">
                            {bet.match.homeScore} × {bet.match.awayScore}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm truncate">{bet.match.awayTeam}</p>
                    </div>
                  </div>
                  {!bet.match.isFinished && open && (
                    <div className="mt-2 text-center">
                      <Link
                        href="/palpites/novo"
                        className="text-[11px] font-medium text-primary hover:underline"
                      >
                        Editar →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
