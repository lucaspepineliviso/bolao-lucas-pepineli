"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EscolherPlanoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleFree() {
    router.push("/");
    router.refresh();
  }

  async function handlePremium() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erro ao solicitar");
        router.push("/");
        return;
      }
      router.push("/premium/pendente");
    } catch {
      alert("Erro ao processar");
      router.push("/");
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">🏆 Escolha seu Plano</h1>
          <p className="text-text-muted">Bolão Lucas Pepineli - Copa 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleFree}
            className="bg-surface border border-primary/20 rounded-2xl p-6 text-left hover:border-primary/40 transition-all group text-center"
          >
            <div className="text-4xl mb-3">🆓</div>
            <h2 className="text-xl font-bold mb-2">Grátis</h2>
            <p className="text-text-muted text-sm mb-4">Participe sem custos</p>
            <ul className="text-xs text-left space-y-2 mb-6">
              <li className="flex items-center gap-2">✓ Palpites em todos os jogos</li>
              <li className="flex items-center gap-2">✓ Ranking geral</li>
              <li className="flex items-center gap-2 text-danger">✗ Sem direito a prêmio</li>
            </ul>
            <div className="bg-surface-light rounded-xl py-2.5 text-sm font-medium group-hover:bg-primary/20 transition-colors">
              Quero Grátis
            </div>
          </button>

          <button
            onClick={handlePremium}
            disabled={loading}
            className="bg-primary/10 border border-primary/30 rounded-2xl p-6 text-left hover:bg-primary/20 transition-all group text-center"
          >
            <div className="text-4xl mb-3">👑</div>
            <h2 className="text-xl font-bold mb-2">Premium</h2>
            <p className="text-primary font-black text-2xl mb-2">R$ 50</p>
            <p className="text-text-muted text-sm mb-4">Concorra ao prêmio!</p>
            <ul className="text-xs text-left space-y-2 mb-6">
              <li className="flex items-center gap-2">✓ Palpites em todos os jogos</li>
              <li className="flex items-center gap-2">✓ Ranking premium exclusivo</li>
              <li className="flex items-center gap-2">✓ Concorre ao prêmio final</li>
            </ul>
            <div className="bg-primary rounded-xl py-2.5 text-sm font-medium group-hover:bg-primary-dark transition-colors disabled:opacity-50">
              {loading ? "Processando..." : "Quero Premium"}
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          * Prêmio final = 80% do total arrecadado (20% taxa de administração)
        </p>
      </div>
    </div>
  );
}
