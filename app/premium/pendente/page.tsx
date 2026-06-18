"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PremiumPendentePage() {
  const router = useRouter();
  const [payment, setPayment] = useState<{ amount: number } | null>(null);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then((data) => {
        const pending = data.payments?.find((p: { status: string }) => p.status === "pending");
        if (pending) setPayment(pending);
        else router.push("/");
      })
      .catch(() => router.push("/"));
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold mb-2">Pagamento Pendente</h1>
        <p className="text-text-muted mb-6">
          Você escolheu o plano Premium. Agora é só enviar o valor para o organizador.
        </p>

        <div className="bg-surface rounded-2xl p-6 border border-primary/20 mb-6">
          <p className="text-sm text-text-muted mb-2">Valor:</p>
          <p className="text-3xl font-black text-primary">R$ {payment?.amount ?? 50},00</p>
          <div className="mt-4 bg-surface-light rounded-xl p-4 text-left text-sm">
            <p className="font-medium mb-2">📱 Dados para pagamento:</p>
            <p className="text-text-muted">Pix: <strong>lucaspepineliviso@gmail.com</strong></p>
            <p className="text-text-muted">Nome: <strong>Lucas Pepineli</strong></p>
          </div>
        </div>

        <p className="text-xs text-text-muted mb-6">
          Após enviar o comprovante, avise o organizador para confirmar seu acesso premium.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full py-2.5 rounded-xl text-sm font-medium bg-surface-light hover:bg-primary/20 transition-colors"
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
}
