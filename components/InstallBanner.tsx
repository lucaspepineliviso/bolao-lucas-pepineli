"use client";

import { useState, useEffect } from "react";

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("install-banner-dismissed");
    if (dismissed) return;

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isMobile = isIOS || isAndroid;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    if (isMobile && !isStandalone) {
      setPlatform(isIOS ? "ios" : "android");
      setShow(true);
    }
  }, []);

  if (!show || !platform) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-surface border-t border-primary/20 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <img src="/icon-lucas.png" alt="Bolão LP" className="w-10 h-10 rounded-xl" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">Instalar Bolão LP</p>
          <p className="text-xs text-text-muted">
            {platform === "ios"
              ? 'Toque em "Compartilhar" e depois "Adicionar à Tela de Início"'
              : 'Toque nos 3 pontinhos → "Instalar app"'}
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem("install-banner-dismissed", "true");
            setShow(false);
          }}
          className="text-text-muted hover:text-text text-lg px-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
