"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authHeaders, removeToken } from "@/lib/client-auth";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isPremium?: boolean;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { headers: authHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    removeToken();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const navLinks = [
    { href: "/", label: "Jogos" },
    { href: "/regras", label: "Regras" },
    { href: "/ranking", label: "Ranking" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-primary/20">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-sm group-hover:animate-pop">
            LP
          </div>
          <span className="font-bold text-lg hidden sm:block">
            Bolão <span className="text-primary">Lucas Pepineli</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/palpites"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/palpites" ? "text-primary" : "text-text-muted"
              }`}
            >
              Meus Palpites
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                pathname.startsWith("/admin") ? "text-accent" : "text-text-muted"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-surface-light hover:bg-primary/20 transition-colors rounded-full px-3 py-1.5 text-sm"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-primary/20 rounded-xl overflow-hidden shadow-xl">
                  <div className="px-4 py-3 border-b border-primary/10">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                    {user.isPremium ? (
                      <p className="text-xs text-primary font-medium mt-1">👑 Premium</p>
                    ) : (
                      <Link href="/escolher-plano" className="text-xs text-accent font-medium mt-1 block hover:underline" onClick={() => setMenuOpen(false)}>
                        🔓 Seja Premium
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-text-muted hover:text-white transition-colors px-3 py-1.5"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="text-sm bg-primary hover:bg-primary-dark transition-colors rounded-full px-4 py-1.5 font-medium"
              >
                Cadastrar
              </Link>
            </div>
          )}

          <button
            className="md:hidden text-text-muted hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-primary/10 bg-surface">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  pathname === link.href ? "bg-primary/20 text-primary" : "text-text-muted hover:bg-surface-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/palpites"
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  pathname === "/palpites" ? "bg-primary/20 text-primary" : "text-text-muted hover:bg-surface-light"
                }`}
              >
                Meus Palpites
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm text-accent hover:bg-accent/10 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
