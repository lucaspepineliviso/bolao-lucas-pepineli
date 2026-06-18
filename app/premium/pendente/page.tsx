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

  const phone = "5511970733359";
  const message = encodeURIComponent(
    `Olá! Enviei o comprovante do pagamento Premium do Bolão Lucas Pepineli. Valor: R$ ${payment?.amount ?? 10},00`
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold mb-2">Pagamento Pendente</h1>
        <p className="text-text-muted mb-6">
          Você escolheu o plano Premium. Envie o valor via Pix e envie o comprovante pelo WhatsApp.
        </p>

        <div className="bg-surface rounded-2xl p-6 border border-primary/20 mb-6">
          <p className="text-sm text-text-muted mb-2">Valor:</p>
          <p className="text-3xl font-black text-primary">R$ {payment?.amount ?? 10},00</p>
          <div className="mt-4 bg-surface-light rounded-xl p-4 text-left text-sm space-y-2">
            <p className="font-medium">📱 Dados para pagamento Pix:</p>
            <div>
              <p className="text-text-muted">Chave Pix (CPF):</p>
              <p className="font-bold text-base">520.089.338-06</p>
            </div>
            <div>
              <p className="text-text-muted">Nome:</p>
              <p className="font-bold">Lucas Pepineli do Viso</p>
            </div>
          </div>
        </div>

        <a
          href={`https://wa.me/${phone}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors mb-4"
        >
          📲 Enviar Comprovante pelo WhatsApp
        </a>

        <p className="text-xs text-text-muted mb-6">
          Após enviar o comprovante, aguarde a confirmação do organizador.
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
