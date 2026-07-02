"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetarSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token de recuperação ausente.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao redefinir a senha");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao redefinir a senha");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-danger/20 text-danger rounded-full flex items-center justify-center text-xl mx-auto mb-3">
          ⚠
        </div>
        <p className="text-sm font-medium text-text mb-4">Link de recuperação inválido ou incompleto.</p>
        <Link
          href="/login"
          className="inline-block w-full py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary-dark text-white transition-colors"
        >
          Voltar para o Login
        </Link>
      </div>
    );
  }

  return (
    <>
      {success ? (
        <div className="bg-success/10 border border-success/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center text-xl mx-auto mb-3">
            ✓
          </div>
          <h2 className="text-lg font-bold text-success mb-2">Senha alterada com sucesso!</h2>
          <p className="text-sm font-medium text-text-muted">Você será redirecionado para a tela de login em instantes...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-muted mb-1 block">Nova Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl focus:outline-none focus:border-primary transition-colors text-text"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-muted mb-1 block">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-light border border-primary/20 rounded-xl focus:outline-none focus:border-primary transition-colors text-text"
              placeholder="Digite novamente"
              required
            />
          </div>

          {error && <p className="text-danger text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary-dark text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Processando..." : "Redefinir Senha"}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetarSenhaPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
            LP
          </div>
          <h1 className="text-2xl font-bold">Redefinir Senha</h1>
          <p className="text-text-muted text-sm mt-1">
            Escolha uma nova senha para a sua conta
          </p>
        </div>

        <Suspense fallback={<p className="text-center text-sm text-text-muted">Carregando...</p>}>
          <ResetarSenhaForm />
        </Suspense>
      </div>
    </div>
  );
}
