"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    homeScore: number | null;
    awayScore: number | null;
    isFinished: boolean;
  };
}

export default function PalpitesPage() {
  const router = useRouter();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bets")
      .then((res) => {
        if (!res.ok) throw new Error("Não autorizado");
        return res.json();
      })
      .then(setBets)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const pending = bets.filter((b) => !b.match.isFinished);
  const finished = bets.filter((b) => b.match.isFinished);

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black mb-2">📋 Meus Palpites</h1>
        <p className="text-text-muted">Todos os seus palpites no bolão</p>
      </div>

      {bets.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p className="text-5xl mb-4">🎯</p>
          <p>Você ainda não fez nenhum palpite</p>
          <p className="text-sm mt-2">Vá para a página inicial e comece a palpitar!</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                Pendentes ({pending.length})
              </h2>
              <div className="space-y-2">
                {pending.map((bet) => (
                  <div key={bet.id} className="bg-surface rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {bet.match.homeTeam} vs {bet.match.awayTeam}
                      </p>
                      <p className="text-xs text-text-muted">{bet.match.stage}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-bold">
                        {bet.homeScore} × {bet.awayScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {finished.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-success rounded-full" />
                Encerrados ({finished.length})
              </h2>
              <div className="space-y-2">
                {finished.map((bet) => (
                  <div key={bet.id} className="bg-surface rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {bet.match.homeTeam} vs {bet.match.awayTeam}
                      </p>
                      <p className="text-xs text-text-muted">
                        {bet.match.homeScore} × {bet.match.awayScore}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-surface-light px-3 py-1 rounded-lg text-sm">
                        {bet.homeScore} × {bet.awayScore}
                      </span>
                      <span
                        className={`font-bold text-sm ${
                          bet.points && bet.points > 0 ? "text-success" : "text-danger"
                        }`}
                      >
                        {bet.points ?? 0} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
