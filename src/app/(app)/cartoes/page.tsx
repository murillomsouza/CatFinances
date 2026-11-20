import Link from "next/link";
import Gato from "@/components/Gato";
import { db } from "@/db";
import { cartoes } from "@/db/schema";
import { formatarData, hojeEmSaoPaulo } from "@/lib/datas";
import { calcularFatura } from "@/lib/fatura";
import { exigirUsuario } from "@/lib/sessao";

export default async function Cartoes() {
  await exigirUsuario();
  const lista = db.select().from(cartoes).orderBy(cartoes.nome).all();
  const hoje = hojeEmSaoPaulo();

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Cartões</h1>
        <Link
          href="/cartoes/novo"
          className="flex min-h-11 items-center rounded-full bg-blush-400 px-5 font-bold"
        >
          + Novo
        </Link>
      </header>

      {lista.length === 0 ? (
        <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center">
          <Gato className="size-20" />
          <p className="font-display text-lg">Nenhum cartão ainda, miau!</p>
          <Link
            href="/cartoes/novo"
            className="flex min-h-11 items-center rounded-full bg-blush-400 px-5 font-bold"
          >
            Cadastrar primeiro cartão
          </Link>
        </section>
      ) : (
        <ul className="space-y-6 pt-2">
          {lista.map((c) => {
            const fatura = calcularFatura(hoje, c);
            return (
              <li key={c.id}>
                <Link
                  href={`/cartoes/${c.id}`}
                  className="orelhas block space-y-1 rounded-3xl bg-blush-100 p-4"
                >
                  <p className="font-display text-lg">{c.nome}</p>
                  <p className="text-sm text-ink-soft">{c.banco}</p>
                  <p className="pt-1 text-sm">
                    Fecha dia {c.diaFechamento} · Vence dia {c.diaVencimento}
                  </p>
                  <p className="text-xs text-ink-soft">
                    Uma compra de hoje cai na fatura que vence em {formatarData(fatura.vencimento)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
