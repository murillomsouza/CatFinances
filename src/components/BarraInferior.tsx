"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const esquerda = [
  { href: "/", rotulo: "Início", icone: "🐾" },
  { href: "/cartoes", rotulo: "Cartões", icone: "💳" },
];
const direita = [
  { href: "/graficos", rotulo: "Gráficos", icone: "📊" },
  { href: "/mais", rotulo: "Mais", icone: "🎀" },
];

export default function BarraInferior() {
  const caminho = usePathname();

  const Item = ({ href, rotulo, icone }: { href: string; rotulo: string; icone: string }) => {
    const ativo = caminho === href;
    return (
      <Link
        href={href}
        aria-current={ativo ? "page" : undefined}
        className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-xs ${
          ativo ? "bg-blush-100 font-bold" : "text-ink-soft"
        }`}
      >
        <span className="text-xl leading-none">{icone}</span>
        {rotulo}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-blush-100 bg-white/90 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-center gap-1 px-2 py-1">
        {esquerda.map((i) => <Item key={i.href} {...i} />)}
        <Link
          href="/novo"
          aria-label="Lançar gasto"
          className="-mt-8 flex size-16 shrink-0 items-center justify-center rounded-full bg-blush-400 pb-1 text-4xl font-bold text-ink shadow-lg shadow-blush-300/60"
        >
          +
        </Link>
        {direita.map((i) => <Item key={i.href} {...i} />)}
      </div>
    </nav>
  );
}
