"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Celebration from "@/components/Celebration";
import { setToken } from "@/lib/client-auth";

export default function CadastroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body: { name: string; email: string; password: string; referrerId?: string } = {
        name,
        email,
        password,
      };
      if (ref) body.referrerId = ref;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao cadastrar");

      setToken(data.token);
      setShowCelebration(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
            LP
          </div>
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-text-muted text-sm mt-1">Entre no bolão!</p>
          {ref && (
            <p className="text-primary text-xs font-medium mt-2">
              Você foi convidado por um amigo!
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-muted mb-1 block">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-muted mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-muted mb-1 block">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl focus:outline-none focus:border-primary transition-colors"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-danger text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar Conta"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>

      {showCelebration && (
        <Celebration
          message="Conta criada com sucesso!"
          onFinish={() => {
            setShowCelebration(false);
            router.push("/escolher-plano");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
