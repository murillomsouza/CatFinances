import { desc, eq, like, sql } from "drizzle-orm";
import Link from "next/link";
import ExcluirLancamento from "@/components/ExcluirLancamento";
import Gato from "@/components/Gato";
import { db } from "@/db";
import { cartoes, categorias, despesas, usuarios } from "@/db/schema";
import { formatarData, hojeEmSaoPaulo, lerData } from "@/lib/datas";
import { formatarReais } from "@/lib/dinheiro";
import { exigirUsuario } from "@/lib/sessao";

export const dynamic = "force-dynamic"; // o mês mostrado precisa ser o de hoje, sempre

const ROTULO_FORMA = { credito: "Crédito", debito: "Débito", pix: "Pix", boleto: "Boleto" } as const;

export default async function Inicio() {
  await exigirUsuario();

  const hoje = hojeEmSaoPaulo();
  const mes = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  // "Despesas do mês" = o que sai do bolso neste mês (parcela entra no mês do vencimento)
  const prefixo = `${hoje.ano}-${String(hoje.mes).padStart(2, "0")}-`;
  const totalDoMes =
    db
      .select({ total: sql<number>`coalesce(sum(${despesas.valorCentavos}), 0)` })
      .from(despesas)
      .where(like(despesas.dataPagamento, `${prefixo}%`))
      .get()?.total ?? 0;

  // Uma linha por compra (a parcela 1 representa a compra inteira)
  const lancamentos = db
    .select({
      grupoId: despesas.grupoId,
      descricao: despesas.descricao,
      valor: despesas.valorCentavos,
      totalParcelas: despesas.totalParcelas,
      data: despesas.data,
      dataPagamento: despesas.dataPagamento,
      forma: despesas.forma,
      pago: despesas.pago,
      emoji: categorias.emoji,
      cartao: cartoes.nome,
      pagador: usuarios.nome,
    })
    .from(despesas)
    .innerJoin(categorias, eq(categorias.id, despesas.categoriaId))
    .leftJoin(cartoes, eq(cartoes.id, despesas.cartaoId))
    .leftJoin(usuarios, eq(usuarios.id, despesas.pagadorId))
    .where(eq(despesas.parcela, 1))
    .orderBy(desc(despesas.data), desc(despesas.id))
    .limit(30)
    .all();

  const detalhe = (l: (typeof lancamentos)[number]) => {
    const partes = [
      formatarData(lerData(l.data)!),
      ROTULO_FORMA[l.forma] + (l.cartao ? ` ${l.cartao}` : ""),
      l.pagador ?? "Dividido",
    ];
    if (l.forma === "credito" || l.forma === "boleto") {
      partes.push(`vence ${formatarData(lerData(l.dataPagamento)!)}`);
    }
    if (l.forma === "boleto") partes.push(l.pago ? "pago" : "pendente");
    return partes.join(" · ");
  };

  return (
    <main className="space-y-6">
      <header className="flex items-center gap-3">
        <Gato className="size-14" />
        <div>
          <p className="text-sm text-ink-soft first-letter:uppercase">{mes}</p>
          <h1 className="font-display text-2xl">CatFinances</h1>
        </div>
      </header>

      <section className="orelhas mt-8 rounded-3xl bg-blush-200 p-5">
        <p className="text-sm text-ink-soft">Sobra do mês</p>
        <p className="font-display text-4xl">—</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-mint p-3">
            <p className="text-xs text-ink-soft">Receitas</p>
            <p className="font-display text-lg">R$ 0,00</p>
          </div>
          <div className="rounded-2xl bg-peach p-3">
            <p className="text-xs text-ink-soft">Despesas</p>
            <p className="font-display text-lg">{formatarReais(totalDoMes)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          Despesas = o que sai neste mês. Parcelas do cartão contam no mês do vencimento da fatura.
        </p>
      </section>

      {lancamentos.length === 0 ? (
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
      ) : (
        <section className="space-y-3">
          <h2 className="font-display text-lg">Últimos lançamentos</h2>
          <ul className="space-y-2">
            {lancamentos.map((l) => (
              <li key={l.grupoId} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                <span className="text-2xl" aria-hidden="true">
                  {l.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{l.descricao}</p>
                  <p className="text-xs text-ink-soft">{detalhe(l)}</p>
                </div>
                <p className="shrink-0 font-display">
                  {l.totalParcelas > 1 ? `${l.totalParcelas}x ` : ""}
                  {formatarReais(l.valor)}
                </p>
                <ExcluirLancamento grupoId={l.grupoId} parcelado={l.totalParcelas > 1} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
