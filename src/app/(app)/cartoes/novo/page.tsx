import Link from "next/link";
import { exigirUsuario } from "@/lib/sessao";
import FormularioCartao from "../formulario";

export default async function NovoCartao() {
  await exigirUsuario();
  return (
    <main className="space-y-6">
      <Link href="/cartoes" className="inline-flex min-h-11 items-center text-ink-soft">
        ← Cartões
      </Link>
      <h1 className="font-display text-2xl">Novo cartão</h1>
      <FormularioCartao />
    </main>
  );
}
