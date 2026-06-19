"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { calculateKnockoutTeams } from "@/lib/groupCalculator";
import { isBetOpen } from "@/lib/bet-utils";
import MatchBetCard from "@/components/MatchBetCard";

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

interface Bet {
  id: number;
  homeScore: number;
  awayScore: number;
  points: number | null;
  matchId: number;
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
  "OITAVAS": "Oitavas", "OITAVAS FINAL": "Oitavas Final",
  "QUARTAS": "Quartas", "SEMIFINAL": "Semifinal",
  "3º LUGAR": "3º Lugar", "FINAL": "Final",
};

const FILTER_OPTIONS = [
  { key: "all", label: "Todos" },
  { key: "open", label: "Abertos" },
  { key: "GRUPO", label: "Grupo" },
  { key: "OITAVAS", label: "Oitavas" },
  { key: "QUARTAS", label: "Quartas" },
  { key: "SEMIFINAL", label: "Semifinal" },
  { key: "FINAL", label: "Final" },
];

export default function NovoPalpitePage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/bets").then((r) => r.json()),
      fetch("/api/matches").then((r) => r.json()),
    ])
      .then(([user, userBets, allMatches]) => {
        if (!user || user.error) { router.push("/login"); return; }
        setBets(userBets);
        setMatches(allMatches);
        setAuthorized(true);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const betMap = useMemo(() => {
    const map = new Map<number, Bet>();
    for (const b of bets) map.set(b.matchId, b);
    return map;
  }, [bets]);

  const resolvedKnockoutTeams = useMemo(() => {
    if (matches.length === 0) return {};
    const tempScores: Record<number, { home: string; away: string }> = {};
    for (const b of bets) {
      tempScores[b.matchId] = { home: b.homeScore.toString(), away: b.awayScore.toString() };
    }
    return calculateKnockoutTeams(tempScores, matches);
  }, [matches, bets]);

  const filteredMatches = useMemo(() => {
    let list = matches;

    if (filter === "open") {
      list = list.filter((m) => isBetOpen(m.matchDate) && !m.isFinished);
    } else if (filter === "GRUPO") {
      list = list.filter((m) => m.stage.startsWith("GRUPO"));
    } else if (filter !== "all") {
      list = list.filter((m) => m.stage === filter);
    }

    if (openOnly) {
      list = list.filter((m) => isBetOpen(m.matchDate) && !m.isFinished);
    }

    return list;
  }, [matches, filter, openOnly]);

  const grouped = useMemo(() => {
    return STAGE_ORDER.reduce(
      (acc, stage) => {
        const stageMatches = filteredMatches.filter((m) => m.stage === stage);
        if (stageMatches.length > 0) acc[stage] = stageMatches;
        return acc;
      },
      {} as Record<string, Match[]>
    );
  }, [filteredMatches]);

  const totalBets = bets.length;
  const openMatches = matches.filter((m) => isBetOpen(m.matchDate) && !m.isFinished);
  const openWithoutBet = openMatches.filter((m) => !betMap.has(m.id));

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

  if (!authorized) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black mb-2">🎯 Palpites</h1>
        <p className="text-text-muted text-sm">Preencha quando quiser — cada jogo trava no apito</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface rounded-xl p-4 text-center border border-primary/10">
          <p className="text-2xl font-black text-primary">{totalBets}</p>
          <p className="text-xs text-text-muted">Feitos</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-primary/10">
          <p className="text-2xl font-black text-success">{openMatches.length}</p>
          <p className="text-xs text-text-muted">Abertos</p>
        </div>
        <div className="bg-surface rounded-xl p-4 text-center border border-primary/10">
          <p className="text-2xl font-black text-accent">{openWithoutBet.length}</p>
          <p className="text-xs text-text-muted">Sem palpite</p>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === opt.key
                  ? "bg-primary text-white"
                  : "bg-surface-light text-text-muted hover:bg-primary/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
            className="rounded border-primary/30 text-primary focus:ring-primary/30"
          />
          Mostrar só jogos abertos
        </label>
      </div>

      {Object.entries(grouped).map(([stage, stageMatches]) => {
        const isKnockout = !stage.startsWith("GRUPO");
        const stageOpenCount = stageMatches.filter((m) => isBetOpen(m.matchDate) && !m.isFinished).length;

        return (
          <div key={stage} className="mb-6">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              {STAGE_LABELS[stage] || stage}
              {stageOpenCount > 0 && (
                <span className="text-xs font-normal text-primary ml-1">({stageOpenCount} aberto{stageOpenCount > 1 ? "s" : ""})</span>
              )}
            </h2>
            <div className="space-y-2">
              {stageMatches.map((match) => {
                const resolved = isKnockout ? resolvedKnockoutTeams[match.id] : null;
                const displayMatch = resolved
                  ? { ...match, homeTeam: resolved.homeTeam, awayTeam: resolved.awayTeam }
                  : match;

                return (
                  <MatchBetCard
                    key={match.id}
                    match={displayMatch}
                    initialBet={betMap.get(match.id) ?? null}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p className="text-5xl mb-4">🎯</p>
          <p>Nenhum jogo encontrado para este filtro</p>
        </div>
      )}
    </div>
  );
}
