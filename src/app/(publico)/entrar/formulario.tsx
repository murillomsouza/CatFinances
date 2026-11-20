"use client";

import { useActionState } from "react";
import { entrar } from "./actions";

export default function Formulario() {
  const [estado, acao, pendente] = useActionState(entrar, {} as { erro?: string });

  const campo =
    "min-h-12 w-full rounded-2xl border border-blush-200 bg-white px-4 text-base outline-none focus:border-blush-400";

  return (
    <form action={acao} className="space-y-4">
      <label className="block space-y-1">
        <span className="text-sm text-ink-soft">E-mail</span>
        <input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          required
          className={campo}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-ink-soft">Senha</span>
        <input
          name="senha"
          type="password"
          autoComplete="current-password"
          required
          className={campo}
        />
      </label>

      <p role="alert" aria-live="polite" className="min-h-5 text-sm font-bold text-ink">
        {estado.erro}
      </p>

      <button
        type="submit"
        disabled={pendente}
        className="min-h-12 w-full rounded-full bg-blush-400 font-bold disabled:opacity-60"
      >
        {pendente ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
