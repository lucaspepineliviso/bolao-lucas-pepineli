import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Bolão Lucas Pepineli - Copa 2026",
  description: "Faça seus palpites para a Copa do Mundo 2026!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <WhatsAppButton />
      </body>
    </html>
  );
}
