import Link from "next/link";
import Gato from "@/components/Gato";

export const dynamic = "force-dynamic"; // o mês mostrado precisa ser o de hoje, sempre

export default function Inicio() {
  const mes = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  return (
    <main className="space-y-6">
      <header className="flex items-center gap-3">
        <Gato className="size-14" />
        <div>
          <p className="text-sm text-ink-soft first-letter:uppercase">{mes}</p>
          <h1 className="font-display text-2xl">CatFinances</h1>
        </div>
      </header>

      {/* Resumo do mês (valores de exemplo, ainda sem dados reais) */}
      <section className="orelhas mt-8 rounded-3xl bg-blush-200 p-5">
        <p className="text-sm text-ink-soft">Sobra do mês</p>
        <p className="font-display text-4xl">R$ 0,00</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-mint p-3">
            <p className="text-xs text-ink-soft">Receitas</p>
            <p className="font-display text-lg">R$ 0,00</p>
          </div>
          <div className="rounded-2xl bg-peach p-3">
            <p className="text-xs text-ink-soft">Despesas</p>
            <p className="font-display text-lg">R$ 0,00</p>
          </div>
        </div>
      </section>

      {/* Estado vazio com mascote */}
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center">
        <Gato className="size-20" />
        <p className="font-display text-lg">Nenhum gasto ainda, miau!</p>
        <Link
          href="/novo"
          className="flex min-h-11 items-center rounded-full bg-blush-400 px-5 font-bold"
        >
          Lançar primeiro gasto
        </Link>
      </section>
    </main>
  );
}
