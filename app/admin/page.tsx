"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Payment {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
}

interface PremiumStats {
  totalPremium: number;
  totalPending: number;
  grossTotal: number;
  fee: number;
  prize: number;
  potentialWinner: { name: string; points: number } | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"jogos" | "financeiro">("jogos");
  const [matches, setMatches] = useState<any[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [premiumStats, setPremiumStats] = useState<PremiumStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ homeTeam: "", awayTeam: "", matchDate: "", stage: "", groupName: "", homeScore: "", awayScore: "" });
  const [admin, setAdmin] = useState(false);

  const [form, setForm] = useState({
    homeTeam: "", awayTeam: "", matchDate: "", stage: "GRUPO", groupName: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => { if (!res.ok) throw new Error(""); return res.json(); })
      .then((data) => {
        if (data.role !== "ADMIN") { router.push("/"); return; }
        setAdmin(true);
      })
      .catch(() => router.push("/login"));
    loadMatches();
    loadPayments();
    loadPremiumStats();
  }, [router]);

  async function loadMatches() {
    try {
      const res = await fetch("/api/admin/matches");
      if (res.ok) setMatches(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function loadPayments() {
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) setPayments(await res.json());
    } catch {}
  }

  async function loadPremiumStats() {
    try {
      const res = await fetch("/api/admin/premium-stats");
      if (res.ok) setPremiumStats(await res.json());
    } catch {}
  }

  async function handleCreateMatch(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/matches", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowAddForm(false);
      setForm({ homeTeam: "", awayTeam: "", matchDate: "", stage: "GRUPO", groupName: "" });
      loadMatches();
    }
  }

  async function handleSetResult(matchId: number) {
    const home = parseInt((document.getElementById(`home-${matchId}`) as HTMLInputElement).value);
    const away = parseInt((document.getElementById(`away-${matchId}`) as HTMLInputElement).value);
    if (isNaN(home) || isNaN(away)) return;
    const res = await fetch("/api/admin/matches", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, homeScore: home, awayScore: away }),
    });
    if (res.ok) loadMatches();
  }

  function openEdit(match: any) {
    setEditingId(match.id);
    setEditForm({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      matchDate: new Date(match.matchDate).toISOString().slice(0, 16),
      stage: match.stage,
      groupName: match.groupName || "",
      homeScore: match.homeScore?.toString() ?? "",
      awayScore: match.awayScore?.toString() ?? "",
    });
  }

  async function handleUpdate(matchId: number) {
    if (editForm.homeScore !== "" && editForm.awayScore !== "") {
      const res = await fetch("/api/admin/matches", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          homeScore: parseInt(editForm.homeScore),
          awayScore: parseInt(editForm.awayScore),
        }),
      });
      if (res.ok) {
        await fetch("/api/admin/matches", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId, homeTeam: editForm.homeTeam, awayTeam: editForm.awayTeam, matchDate: editForm.matchDate, stage: editForm.stage, groupName: editForm.groupName }),
        });
        setEditingId(null);
        loadMatches();
      }
    } else {
      const res = await fetch("/api/admin/matches", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, ...editForm, homeScore: undefined, awayScore: undefined }),
      });
      if (res.ok) { setEditingId(null); loadMatches(); }
    }
  }

  async function handleConfirmPayment(paymentId: number) {
    const res = await fetch("/api/admin/payments", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
    });
    if (res.ok) { loadPayments(); loadPremiumStats(); }
  }

  if (loading || !admin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="bg-surface rounded-2xl p-6"><div className="h-5 bg-surface-light rounded w-1/3" /></div>)}
        </div>
      </div>
    );
  }

  const pendingPix = payments.filter((p) => p.status === "pending");
  const paidPix = payments.filter((p) => p.status === "paid");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">⚙️ Painel Admin</h1>
          <p className="text-text-muted text-sm">Gerencie jogos, resultados e pagamentos</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: "jogos", label: "Jogos" },
          { key: "financeiro", label: "Financeiro" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              tab === t.key ? "bg-primary text-white" : "bg-surface-light text-text-muted hover:bg-primary/20"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "jogos" && (
        <>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="mb-6 bg-primary hover:bg-primary-dark transition-colors px-4 py-2 rounded-xl text-sm font-medium"
          >
            {showAddForm ? "Cancelar" : "+ Novo Jogo"}
          </button>

          {showAddForm && (
            <div className="bg-surface rounded-2xl p-6 mb-6 border border-primary/20">
              <h2 className="font-bold mb-4">Novo Jogo</h2>
              <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Time da Casa" value={form.homeTeam} onChange={(e) => setForm({ ...form, homeTeam: e.target.value })} className="px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl" required />
                <input placeholder="Time Visitante" value={form.awayTeam} onChange={(e) => setForm({ ...form, awayTeam: e.target.value })} className="px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl" required />
                <input type="datetime-local" value={form.matchDate} onChange={(e) => setForm({ ...form, matchDate: e.target.value })} className="px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl" required />
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl">
                  <option value="GRUPO">Fase de Grupos</option>
                  <option value="OITAVAS">Oitavas</option>
                  <option value="OITAVAS FINAL">Oitavas Final</option>
                  <option value="QUARTAS">Quartas</option>
                  <option value="SEMIFINAL">Semifinal</option>
                  <option value="3º LUGAR">3º Lugar</option>
                  <option value="FINAL">Final</option>
                </select>
                <input placeholder="Grupo (ex: A)" value={form.groupName} onChange={(e) => setForm({ ...form, groupName: e.target.value })} className="px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl" />
                <button type="submit" className="md:col-span-2 bg-success hover:bg-success/80 transition-colors py-2.5 rounded-xl font-medium">Criar Jogo</button>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {matches.map((match) => (
          <div key={match.id} className={`bg-surface rounded-2xl p-4 border ${match.isFinished ? "border-success/20" : "border-primary/10"}`}>
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <span className="text-xs font-medium bg-surface-light px-2.5 py-1 rounded-full text-text-muted truncate max-w-[60%]">{match.stage}{match.groupName ? " - " + match.groupName : ""}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-text-muted">{new Date(match.matchDate).toLocaleDateString("pt-BR")}</span>
                    <button onClick={() => openEdit(match)} className="text-xs text-accent hover:text-accent/80 transition-colors">
                      Editar
                    </button>
                  </div>
                </div>

                {editingId === match.id ? (
                  <div className="space-y-2 mb-3">
                    <input value={editForm.homeTeam} onChange={(e) => setEditForm({ ...editForm, homeTeam: e.target.value })} className="w-full px-3 py-1.5 text-sm bg-surface-light border border-primary/20 rounded-lg" />
                    <input value={editForm.awayTeam} onChange={(e) => setEditForm({ ...editForm, awayTeam: e.target.value })} className="w-full px-3 py-1.5 text-sm bg-surface-light border border-primary/20 rounded-lg" />
                    <input type="datetime-local" value={editForm.matchDate} onChange={(e) => setEditForm({ ...editForm, matchDate: e.target.value })} className="w-full px-3 py-1.5 text-sm bg-surface-light border border-primary/20 rounded-lg" />
                    <select value={editForm.stage} onChange={(e) => setEditForm({ ...editForm, stage: e.target.value })} className="w-full px-3 py-1.5 text-sm bg-surface-light border border-primary/20 rounded-lg">
                      <option value="GRUPO A">GRUPO A</option>
                      <option value="GRUPO B">GRUPO B</option>
                      <option value="GRUPO C">GRUPO C</option>
                      <option value="GRUPO D">GRUPO D</option>
                      <option value="GRUPO E">GRUPO E</option>
                      <option value="GRUPO F">GRUPO F</option>
                      <option value="GRUPO G">GRUPO G</option>
                      <option value="GRUPO H">GRUPO H</option>
                      <option value="GRUPO I">GRUPO I</option>
                      <option value="GRUPO J">GRUPO J</option>
                      <option value="GRUPO K">GRUPO K</option>
                      <option value="GRUPO L">GRUPO L</option>
                      <option value="OITAVAS">OITAVAS</option>
                      <option value="OITAVAS FINAL">OITAVAS FINAL</option>
                      <option value="QUARTAS">QUARTAS</option>
                      <option value="SEMIFINAL">SEMIFINAL</option>
                      <option value="3º LUGAR">3º LUGAR</option>
                      <option value="FINAL">FINAL</option>
                    </select>
                    <input value={editForm.groupName} onChange={(e) => setEditForm({ ...editForm, groupName: e.target.value })} placeholder="Grupo (ex: Grupo A)" className="w-full px-3 py-1.5 text-sm bg-surface-light border border-primary/20 rounded-lg" />
                    {match.isFinished && (
                      <div className="flex gap-2">
                        <input type="number" min="0" value={editForm.homeScore} onChange={(e) => setEditForm({ ...editForm, homeScore: e.target.value })} placeholder="Placar Casa" className="flex-1 px-3 py-1.5 text-sm bg-surface-light border border-primary/20 rounded-lg text-center font-bold" />
                        <span className="text-text-muted self-center">×</span>
                        <input type="number" min="0" value={editForm.awayScore} onChange={(e) => setEditForm({ ...editForm, awayScore: e.target.value })} placeholder="Placar Visitante" className="flex-1 px-3 py-1.5 text-sm bg-surface-light border border-primary/20 rounded-lg text-center font-bold" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(match.id)} className="flex-1 bg-success hover:bg-success/80 py-1.5 rounded-lg text-sm font-medium transition-colors">Salvar</button>
                      <button onClick={() => setEditingId(null)} className="flex-1 bg-surface-light hover:bg-surface-light/80 py-1.5 rounded-lg text-sm transition-colors">Cancelar</button>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                  <div className="flex-1 text-right font-bold text-sm sm:text-base truncate max-w-[30%]">{match.homeTeam}</div>
                  {match.isFinished ? (
                    <div className="flex items-center gap-2 bg-surface-light rounded-xl px-4 py-2 shrink-0">
                      <span className="text-2xl font-black text-success">{match.homeScore}</span>
                      <span className="text-text-muted">×</span>
                      <span className="text-2xl font-black text-success">{match.awayScore}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      <input type="number" className="w-12 sm:w-14 h-12 sm:h-14 text-center text-lg sm:text-xl font-black bg-surface-light border border-primary/20 rounded-xl" id={`home-${match.id}`} defaultValue={match.homeScore ?? ""} min="0" />
                      <span className="text-text-muted">×</span>
                      <input type="number" className="w-12 sm:w-14 h-12 sm:h-14 text-center text-lg sm:text-xl font-black bg-surface-light border border-primary/20 rounded-xl" id={`away-${match.id}`} defaultValue={match.awayScore ?? ""} min="0" />
                    </div>
                  )}
                  <div className="flex-1 font-bold text-sm sm:text-base truncate max-w-[30%]">{match.awayTeam}</div>
                </div>
                {!match.isFinished && (
                  <button onClick={() => handleSetResult(match.id)} className="mt-3 w-full py-2 rounded-xl text-sm font-medium bg-success hover:bg-success/80 transition-colors">
                    Encerrar e Calcular Pontos
                  </button>
                )}
                {match.isFinished && match.bets?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-primary/10">
                    <p className="text-xs text-text-muted mb-2">{match.bets.length} palpite{match.bets.length !== 1 ? "s" : ""}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-xs">
                      {match.bets.slice(0, 8).map((bet: any) => (
                        <div key={bet.id} className={`px-2 py-1 rounded ${bet.points && bet.points > 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                          {bet.user.name.split(" ")[0]}: {bet.homeScore}×{bet.awayScore} ({bet.points ?? 0})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {matches.length === 0 && (
              <div className="text-center py-12 text-text-muted">
                <p className="text-5xl mb-4">📅</p>
                <p>Nenhum jogo cadastrado</p>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "financeiro" && (
        <div className="space-y-6">
          {premiumStats && (
            <div className="bg-surface rounded-2xl p-6 border border-primary/20">
              <h2 className="font-bold mb-4">💰 Resumo Financeiro</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-surface-light rounded-xl p-4 text-center">
                  <p className="text-xs text-text-muted">Premium</p>
                  <p className="text-2xl font-black text-primary">{premiumStats.totalPremium}</p>
                </div>
                <div className="bg-surface-light rounded-xl p-4 text-center">
                  <p className="text-xs text-text-muted">Pendentes</p>
                  <p className="text-2xl font-black text-accent">{premiumStats.totalPending}</p>
                </div>
                <div className="bg-surface-light rounded-xl p-4 text-center">
                  <p className="text-xs text-text-muted">Total Bruto</p>
                  <p className="text-2xl font-black">R$ {premiumStats.grossTotal}</p>
                </div>
                <div className="bg-surface-light rounded-xl p-4 text-center">
                  <p className="text-xs text-text-muted">Prêmio (80%)</p>
                  <p className="text-2xl font-black text-success">R$ {premiumStats.prize}</p>
                </div>
              </div>
              <div className="text-sm text-text-muted">
                <p>Taxa de administração (20%): <strong>R$ {premiumStats.fee}</strong></p>
                {premiumStats.potentialWinner && (
                  <p className="mt-2">
                    🏆 Líder atual: <strong className="text-white">{premiumStats.potentialWinner.name}</strong> ({premiumStats.potentialWinner.points} pts)
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-surface rounded-2xl p-6 border border-primary/20">
            <h2 className="font-bold mb-4">⏳ Pagamentos Pendentes</h2>
            {pendingPix.length === 0 ? (
              <p className="text-text-muted text-sm">Nenhum pagamento pendente</p>
            ) : (
              <div className="space-y-2">
                {pendingPix.map((p) => (
                  <div key={p.id} className="bg-surface-light rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.user.name}</p>
                      <p className="text-xs text-text-muted truncate">{p.user.email}</p>
                      <p className="text-xs text-text-muted">Solicitado em {new Date(p.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold">R$ {p.amount}</span>
                      <button
                        onClick={() => handleConfirmPayment(p.id)}
                        className="bg-success hover:bg-success/80 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                      >
                        Confirmar Pagamento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-primary/20">
            <h2 className="font-bold mb-4">✅ Premiums Confirmados</h2>
            {paidPix.length === 0 ? (
              <p className="text-text-muted text-sm">Nenhum premium ainda</p>
            ) : (
              <div className="space-y-1">
                {paidPix.map((p) => (
                  <div key={p.id} className="bg-surface-light rounded-xl px-4 py-2 flex items-center justify-between text-sm">
                    <span>{p.user.name}</span>
                    <span className="text-success">R$ {p.amount} pago</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
