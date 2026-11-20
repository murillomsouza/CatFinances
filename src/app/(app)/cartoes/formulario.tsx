"use client";

import { useActionState } from "react";
import { excluirCartao, salvarCartao } from "./actions";

type Cartao = {
  id: number;
  nome: string;
  banco: string;
  diaFechamento: number;
  diaVencimento: number;
};

const estiloCampo =
  "min-h-12 w-full rounded-2xl border border-blush-200 bg-white px-4 text-base outline-none focus:border-blush-400";

function Campo({
  rotulo,
  dica,
  ...props
}: { rotulo: string; dica?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1">
      <span className="text-sm text-ink-soft">{rotulo}</span>
      <input {...props} required className={estiloCampo} />
      {dica && <span className="block text-xs text-ink-soft">{dica}</span>}
    </label>
  );
}

export default function FormularioCartao({ cartao }: { cartao?: Cartao }) {
  const [estado, acao, pendente] = useActionState(
    salvarCartao,
    {} as { erro?: string; valores?: Record<string, string> },
  );
  const v = estado.valores;

  return (
    <>
      <form action={acao} className="space-y-4">
        {cartao && <input type="hidden" name="id" value={cartao.id} />}

        <Campo
          rotulo="Nome do cartão"
          name="nome"
          maxLength={40}
          placeholder="Ex.: Cartão da Mine"
          defaultValue={v?.nome ?? cartao?.nome ?? ""}
        />
        <Campo
          rotulo="Banco"
          name="banco"
          maxLength={40}
          placeholder="Ex.: Nubank"
          defaultValue={v?.banco ?? cartao?.banco ?? ""}
        />
        <Campo
          rotulo="Dia de fechamento da fatura"
          dica="Compras feitas até esse dia entram na fatura do mês."
          name="diaFechamento"
          type="number"
          inputMode="numeric"
          min={1}
          max={31}
          defaultValue={v?.diaFechamento ?? cartao?.diaFechamento ?? ""}
        />
        <Campo
          rotulo="Dia de vencimento da fatura"
          dica="Em meses sem esse dia, usamos o último dia do mês."
          name="diaVencimento"
          type="number"
          inputMode="numeric"
          min={1}
          max={31}
          defaultValue={v?.diaVencimento ?? cartao?.diaVencimento ?? ""}
        />

        <p role="alert" aria-live="polite" className="min-h-5 text-sm font-bold">
          {estado.erro}
        </p>

        <button
          type="submit"
          disabled={pendente}
          className="min-h-12 w-full rounded-full bg-blush-400 font-bold disabled:opacity-60"
        >
          {pendente ? "Salvando..." : "Salvar cartão"}
        </button>
      </form>

      {cartao && (
        <form
          action={excluirCartao}
          onSubmit={(e) => {
            if (!confirm("Excluir este cartão?")) e.preventDefault();
          }}
          className="mt-3"
        >
          <input type="hidden" name="id" value={cartao.id} />
          <button type="submit" className="min-h-12 w-full rounded-full bg-blush-100 font-bold">
            Excluir cartão
          </button>
        </form>
      )}
    </>
  );
}
