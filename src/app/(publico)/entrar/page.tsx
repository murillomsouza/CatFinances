import { redirect } from "next/navigation";
import Gato from "@/components/Gato";
import { obterUsuario } from "@/lib/sessao";
import Formulario from "./formulario";

export default async function Entrar() {
  if (await obterUsuario()) redirect("/"); // já está logado

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-6 py-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <Gato className="size-24" />
        <h1 className="font-display text-3xl">CatFinances</h1>
        <p className="text-ink-soft">Entre para ver as finanças de vocês 🐾</p>
      </div>
      <Formulario />
    </main>
  );
}
