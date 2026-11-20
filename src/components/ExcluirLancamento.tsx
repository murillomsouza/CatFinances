"use client";

import { excluirDespesa } from "@/app/(app)/novo/actions";

export default function ExcluirLancamento({
  grupoId,
  parcelado,
}: {
  grupoId: string;
  parcelado: boolean;
}) {
  return (
    <form
      action={excluirDespesa}
      onSubmit={(e) => {
        const pergunta = parcelado
          ? "Excluir esta compra e todas as parcelas?"
          : "Excluir este lançamento?";
        if (!confirm(pergunta)) e.preventDefault();
      }}
    >
      <input type="hidden" name="grupoId" value={grupoId} />
      <button
        type="submit"
        aria-label="Excluir lançamento"
        className="flex size-11 items-center justify-center rounded-full text-ink-soft"
      >
        ✕
      </button>
    </form>
  );
}
