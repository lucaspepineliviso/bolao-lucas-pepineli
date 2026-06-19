import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import InstallBanner from "@/components/InstallBanner";

export const metadata: Metadata = {
  title: "Bolão Lucas Pepineli - Copa 2026",
  description: "Faça seus palpites para a Copa do Mundo 2026!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bolão LP",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icon-lucas.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bolão LP" />
      </head>
      <body className="antialiased">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <WhatsAppButton />
        <InstallBanner />
      </body>
    </html>
  );
}
