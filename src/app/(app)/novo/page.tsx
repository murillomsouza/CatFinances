import Link from "next/link";
import { db } from "@/db";
import { cartoes, categorias, usuarios } from "@/db/schema";
import { hojeEmSaoPaulo, paraTexto } from "@/lib/datas";
import { exigirUsuario } from "@/lib/sessao";
import FormularioDespesa from "./formulario";

export const dynamic = "force-dynamic"; // a data de "hoje" tem que ser a de hoje mesmo

export default async function NovoGasto() {
  const usuario = await exigirUsuario();
  const listaCategorias = db.select().from(categorias).orderBy(categorias.id).all();
  const listaCartoes = db.select().from(cartoes).orderBy(cartoes.nome).all();
  const pessoas = db
    .select({ id: usuarios.id, nome: usuarios.nome })
    .from(usuarios)
    .orderBy(usuarios.id)
    .all();

  return (
    <main className="space-y-5">
      <Link href="/" className="inline-flex min-h-11 items-center text-ink-soft">
        ← Início
      </Link>
      <h1 className="font-display text-2xl">Novo gasto</h1>
      <FormularioDespesa
        categorias={listaCategorias}
        cartoes={listaCartoes}
        pessoas={pessoas}
        usuarioId={usuario.id}
        hoje={paraTexto(hojeEmSaoPaulo())}
      />
    </main>
  );
}
