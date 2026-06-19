"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PrizeDisplay from "@/components/PrizeDisplay";

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

export default function Home() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasBets, setHasBets] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/matches").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()).catch(() => null),
      fetch("/api/bets").then((r) => r.json()).catch(() => []),
    ])
      .then(([allMatches, userData, bets]) => {
        setMatches(allMatches);
        setUser(userData);
        setHasBets(bets.length > 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped = STAGE_ORDER.reduce(
    (acc, stage) => {
      const stageMatches = matches.filter((m) => m.stage === stage);
      if (stageMatches.length > 0) acc[stage] = stageMatches;
      return acc;
    },
    {} as Record<string, Match[]>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          Bolão <span className="text-primary">Lucas Pepineli</span>
        </h1>
        <p className="text-text-muted">Copa do Mundo 2026</p>
        <p className="text-xs text-text-muted mt-1">Placares e resultados — aqui você só acompanha</p>
      </div>

      <div className="relative w-full max-w-md mx-auto mb-6 rounded-2xl overflow-hidden border border-primary/20">
        <Image
          src="/Bolao_Lucas_Pepineli.png"
          alt="Bolão Lucas Pepineli"
          width={800}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <div className="mb-6">
        <PrizeDisplay />
      </div>

      {user && !user.error && (
        <div className="mb-6">
          {hasBets ? (
            <Link
              href="/palpites"
              className="block bg-surface border border-primary/20 rounded-2xl p-4 text-center hover:bg-primary/10 transition-colors"
            >
              <p className="text-sm font-bold">📋 Ver Meus Palpites</p>
              <p className="text-xs text-text-muted mt-1">Acompanhe seus palpites e pontos</p>
            </Link>
          ) : (
            <Link
              href="/palpites/novo"
              className="block bg-primary/10 border border-primary/30 rounded-2xl p-4 text-center hover:bg-primary/20 transition-colors"
            >
              <p className="text-2xl mb-1">🎯</p>
              <p className="text-sm font-bold text-primary">Faça seus palpites aqui!</p>
              <p className="text-xs text-text-muted mt-1">Preencha todos os 104 jogos de uma vez</p>
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-surface-light rounded w-1/3 mb-3" />
              <div className="h-8 bg-surface-light rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {Object.entries(grouped).map(([stage, stageMatches]) => (
            <div key={stage} className="mb-8">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                {STAGE_LABELS[stage] || stage}
              </h2>
              <div className="space-y-2">
                {stageMatches.map((match) => (
                  <div
                    key={match.id}
                    className={`bg-surface rounded-xl p-3 border transition-colors ${
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
                      ) : (
                        <div className="flex items-center gap-2 bg-surface-light rounded-xl px-4 py-2 shrink-0">
                          <span className="text-sm font-medium text-text-muted">Aguardando</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-sm truncate max-w-[120px] sm:max-w-none">{match.awayTeam}</p>
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
                ))}
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-5xl mb-4">📋</p>
              <p>Nenhum jogo encontrado</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
