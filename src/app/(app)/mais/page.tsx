import Gato from "@/components/Gato";
import { exigirUsuario } from "@/lib/sessao";
import { sair } from "./actions";

export default async function Mais() {
  const usuario = await exigirUsuario();

  return (
    <main className="space-y-6">
      <h1 className="font-display text-2xl">Mais</h1>

      <section className="flex items-center gap-3 rounded-3xl bg-white p-5">
        <Gato className="size-12" />
        <div>
          <p className="font-display text-lg">{usuario.nome}</p>
          <p className="text-sm text-ink-soft">{usuario.email}</p>
        </div>
      </section>

      <form action={sair}>
        <button
          type="submit"
          className="min-h-12 w-full rounded-full bg-blush-100 font-bold"
        >
          Sair
        </button>
      </form>
    </main>
  );
}
