"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao processar solicitação");

      setMessage(data.message || "E-mail de recuperação enviado com sucesso.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao processar solicitação");
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
          <h1 className="text-2xl font-bold">Recuperar Senha</h1>
          <p className="text-text-muted text-sm mt-1">
            Insira seu e-mail para receber as instruções de recuperação
          </p>
        </div>

        {message ? (
          <div className="bg-success/10 border border-success/20 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center text-xl mx-auto mb-3">
              ✓
            </div>
            <p className="text-sm font-medium text-text">{message}</p>
            <Link
              href="/login"
              className="mt-6 inline-block w-full py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary-dark text-white transition-colors"
            >
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-muted mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl focus:outline-none focus:border-primary transition-colors text-text"
                placeholder="seu-email@exemplo.com"
                required
              />
            </div>

            {error && <p className="text-danger text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50 text-white cursor-pointer"
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>

            <p className="text-center text-sm text-text-muted mt-6">
              <Link href="/login" className="text-primary hover:underline">
                Voltar para o Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
