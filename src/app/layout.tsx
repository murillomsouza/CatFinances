import type { Metadata, Viewport } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";
import BarraInferior from "@/components/BarraInferior";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: "CatFinances",
  description: "Finanças do casal, com muito miau",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // usa a tela toda, respeitando o entalhe do celular
  themeColor: "#ffc8db",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${fredoka.variable}`}>
      <body className="min-h-dvh bg-cream font-sans text-ink antialiased">
        <div className="mx-auto w-full max-w-md px-4 pb-32 pt-[max(1rem,env(safe-area-inset-top))]">
          {children}
        </div>
        <BarraInferior />
      </body>
    </html>
  );
}
