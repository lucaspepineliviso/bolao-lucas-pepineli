"use client";

import { useEffect, useState } from "react";
import PrizeDisplay from "@/components/PrizeDisplay";

interface UserRanking {
  id: number;
  name: string;
  points: number;
  betCount: number;
  exactHits: number;
  isPremium?: boolean;
}

export default function RankingPage() {
  const [users, setUsers] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ isPremium: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setCurrentUser);

    fetch("/api/admin/ranking")
      .then((res) => (res.ok ? res.json() : []))
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayed = premiumOnly ? users.filter((u) => u.isPremium) : users;
  const top3 = displayed.slice(0, 3);
  const rest = displayed.slice(3);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <PrizeDisplay />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black mb-2">🏆 Ranking</h1>
        <p className="text-text-muted">Classificação do bolão</p>

        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPremiumOnly(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              !premiumOnly ? "bg-primary text-white" : "bg-surface-light text-text-muted hover:bg-primary/20"
            }`}
          >
            Geral
          </button>
          <button
            onClick={() => setPremiumOnly(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              premiumOnly ? "bg-primary text-white" : "bg-surface-light text-text-muted hover:bg-primary/20"
            }`}
          >
            👑 Premium
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-surface rounded-2xl p-4 animate-pulse"><div className="h-5 bg-surface-light rounded w-1/2" /></div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p className="text-5xl mb-4">📊</p>
          <p>{premiumOnly ? "Nenhum participante premium ainda" : "Nenhum participante ainda"}</p>
        </div>
      ) : (
        <>
          {top3.length > 0 && (
            <div className="flex items-end justify-center gap-4 mb-8 flex-wrap">
              {top3.length > 1 && (
                <div className="text-center">
                  <div className="text-4xl mb-1">{medals[1]}</div>
                    <div className="bg-surface-light rounded-xl px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-[100px]">
                    <p className="font-bold text-sm truncate max-w-[70px] sm:max-w-none">{top3[1].name.split(" ")[0]}</p>
                    <p className="text-lg font-black text-secondary">{top3[1].points}</p>
                    {top3[1].isPremium && <p className="text-[10px] text-primary">👑 Premium</p>}
                  </div>
                </div>
              )}
              {top3.length > 0 && (
                <div className="text-center">
                  <div className="text-5xl mb-1">{medals[0]}</div>
                  <div className="bg-primary/20 border border-primary/30 rounded-xl px-4 sm:px-5 py-3 min-w-[90px] sm:min-w-[120px]">
                    <p className="font-bold truncate max-w-[80px] sm:max-w-none">{top3[0].name.split(" ")[0]}</p>
                    <p className="text-2xl font-black text-primary">{top3[0].points}</p>
                    {top3[0].isPremium && <p className="text-[10px] text-primary">👑 Premium</p>}
                  </div>
                </div>
              )}
              {top3.length > 2 && (
                <div className="text-center">
                  <div className="text-4xl mb-1">{medals[2]}</div>
                  <div className="bg-surface-light rounded-xl px-3 sm:px-4 py-2 min-w-[80px] sm:min-w-[100px]">
                    <p className="font-bold text-sm truncate">{top3[2].name.split(" ")[0]}</p>
                    <p className="text-lg font-black text-accent">{top3[2].points}</p>
                    {top3[2].isPremium && <p className="text-[10px] text-primary">👑 Premium</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            {rest.map((user, index) => (
              <div key={user.id} className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-sm w-6 text-center">{index + 4}º</span>
                  <div className="w-8 h-8 bg-surface-light rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-sm">{user.name}</span>
                    {user.isPremium && <span className="text-[10px] text-primary ml-1">👑</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{user.betCount} palpites</span>
                  <span className="text-lg font-black text-white">{user.points}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
