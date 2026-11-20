import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { cartoes } from "@/db/schema";
import { exigirUsuario } from "@/lib/sessao";
import FormularioCartao from "../formulario";

export default async function EditarCartao({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  await exigirUsuario();
  const { id } = await params;
  const { erro } = await searchParams;
  const numero = Number(id);
  if (!Number.isInteger(numero)) notFound();

  const cartao = db.select().from(cartoes).where(eq(cartoes.id, numero)).get();
  if (!cartao) notFound();

  return (
    <main className="space-y-6">
      <Link href="/cartoes" className="inline-flex min-h-11 items-center text-ink-soft">
        ← Cartões
      </Link>
      <h1 className="font-display text-2xl">Editar cartão</h1>
      {erro === "em-uso" && (
        <p role="alert" className="rounded-2xl bg-peach p-3 text-sm font-bold">
          Esse cartão tem gastos lançados, então não dá para excluir. Se quiser, edite o nome.
        </p>
      )}
      <FormularioCartao cartao={cartao} />
    </main>
  );
}
