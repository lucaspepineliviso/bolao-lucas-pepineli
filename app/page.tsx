"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MatchCard from "@/components/MatchCard";
import GroupStageForm from "@/components/GroupStageForm";
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

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "finished">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      const res = await fetch("/api/matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error("Erro ao carregar jogos:", err);
    } finally {
      setLoading(false);
    }
  }

  const groupStageEnd = new Date("2026-06-28T00:00:00-03:00");
  const isGroupStage = new Date() < groupStageEnd;

  const groupMatches = matches.filter((m) => m.stage?.startsWith("GRUPO"));
  const knockoutMatches = matches.filter((m) => !m.stage?.startsWith("GRUPO"));

  const now = new Date();
  const filteredKnockout = knockoutMatches.filter((m) => {
    if (filter === "open") return !m.isFinished && new Date(m.matchDate) > now;
    if (filter === "finished") return m.isFinished;
    return true;
  });

  const knockoutStages = Array.from(new Set(filteredKnockout.map((m) => m.stage))).sort();
  const groupedKnockout = knockoutStages.reduce(
    (acc, stage) => {
      const stageMatches = filteredKnockout.filter((m) => m.stage === stage);
      if (stageMatches.length > 0) acc[stage] = stageMatches;
      return acc;
    },
    {} as Record<string, Match[]>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          🇧🇷 Bolão <span className="text-primary">Lucas Pepineli</span>
        </h1>
        <p className="text-text-muted">Copa do Mundo 2026</p>
      </div>

      <div className="relative w-full max-w-md mx-auto mb-6 rounded-2xl overflow-hidden border border-primary/20">
        <Image
          src="/Imagen_Lucas.png"
          alt="Lucas Pepineli"
          width={800}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <div className="mb-6">
        <PrizeDisplay />
      </div>

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
          {isGroupStage && groupMatches.length > 0 ? (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-primary rounded-full" />
                <h2 className="text-lg font-bold">Fase de Grupos</h2>
                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
                  Preencha tudo e salve no final
                </span>
              </div>
              <GroupStageForm matches={groupMatches} onSaved={loadMatches} />
            </div>
          ) : (
            <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 text-center mb-6">
              <p className="text-sm font-medium text-danger">⏰ Fase de grupos encerrada</p>
              <p className="text-xs text-text-muted mt-1">Os palpites da fase de grupos não podem mais ser alterados.</p>
            </div>
          )}

          {Object.keys(groupedKnockout).length > 0 && (
            <>
              <div className="flex justify-center gap-2 mb-6">
                {[
                  { key: "all", label: "Todos" },
                  { key: "open", label: "Abertos" },
                  { key: "finished", label: "Encerrados" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key as typeof filter)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filter === f.key
                        ? "bg-primary text-white"
                        : "bg-surface-light text-text-muted hover:bg-primary/20"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {Object.entries(groupedKnockout).map(([stage, stageMatches]) => (
                <div key={stage} className="mb-8">
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full" />
                    {stage}
                  </h2>
                  <div className="space-y-3">
                    {stageMatches.map((match) => (
                      <MatchCard key={match.id} match={match} onBetPlaced={loadMatches} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

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
