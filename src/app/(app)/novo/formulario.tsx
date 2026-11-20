"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { formatarData, lerData } from "@/lib/datas";
import { dividirEmParcelas, formatarReais, parseValor } from "@/lib/dinheiro";
import { calcularParcelas } from "@/lib/fatura";
import { salvarDespesa } from "./actions";

type Categoria = { id: number; nome: string; emoji: string };
type Cartao = {
  id: number;
  nome: string;
  banco: string;
  diaFechamento: number;
  diaVencimento: number;
};
type Pessoa = { id: number; nome: string };

const FORMAS = [
  { valor: "credito", rotulo: "Crédito" },
  { valor: "debito", rotulo: "Débito" },
  { valor: "pix", rotulo: "Pix" },
  { valor: "boleto", rotulo: "Boleto" },
];

const estiloCampo =
  "min-h-12 w-full rounded-2xl border border-blush-200 bg-white px-4 text-base outline-none focus:border-blush-400";

// Botão de escolha (rádio) no formato de "chip"
function Opcao({
  name,
  value,
  marcada,
  aoEscolher,
  children,
}: {
  name: string;
  value: string;
  marcada: boolean;
  aoEscolher: (valor: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={marcada}
        onChange={() => aoEscolher(value)}
        className="peer sr-only"
      />
      <span className="flex min-h-11 items-center justify-center gap-1 rounded-2xl border border-blush-200 bg-white px-3 text-sm peer-checked:border-blush-400 peer-checked:bg-blush-200 peer-checked:font-bold peer-focus-visible:ring-2 peer-focus-visible:ring-blush-400">
        {children}
      </span>
    </label>
  );
}

function Rotulo({ texto, children }: { texto: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <span className="text-sm text-ink-soft">{texto}</span>
      {children}
    </div>
  );
}

export default function FormularioDespesa({
  categorias,
  cartoes,
  pessoas,
  usuarioId,
  hoje,
}: {
  categorias: Categoria[];
  cartoes: Cartao[];
  pessoas: Pessoa[];
  usuarioId: number;
  hoje: string; // "AAAA-MM-DD"
}) {
  const [estado, acao, pendente] = useActionState(salvarDespesa, {} as { erro?: string });

  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState(String(categorias[0]?.id ?? ""));
  const [forma, setForma] = useState(cartoes.length > 0 ? "credito" : "pix");
  const [cartaoId, setCartaoId] = useState(String(cartoes[0]?.id ?? ""));
  const [parcelas, setParcelas] = useState("1");
  const [data, setData] = useState(hoje);
  const [vencimento, setVencimento] = useState(hoje);
  const [statusBoleto, setStatusBoleto] = useState("pendente");
  const [pagador, setPagador] = useState(String(usuarioId));

  // Prévia da fatura (só no crédito): o servidor refaz o mesmo cálculo ao salvar
  const cartao = cartoes.find((c) => String(c.id) === cartaoId);
  const dataDaCompra = lerData(data);
  const faturas =
    forma === "credito" && cartao && dataDaCompra
      ? calcularParcelas(dataDaCompra, cartao, Number(parcelas))
      : null;
  const centavos = parseValor(valor);
  const valoresDasParcelas =
    faturas && centavos ? dividirEmParcelas(centavos, faturas.length) : null;

  return (
    <form action={acao} className="space-y-5">
      <Rotulo texto="Valor (R$)">
        <input
          name="valor"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0,00"
          required
          autoFocus
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className={`${estiloCampo} font-display text-2xl`}
        />
      </Rotulo>

      <Rotulo texto="Descrição">
        <input
          name="descricao"
          type="text"
          maxLength={60}
          placeholder="Ex.: iFood, feira da semana"
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className={estiloCampo}
        />
      </Rotulo>

      <Rotulo texto="Categoria">
        <div className="grid grid-cols-2 gap-2">
          {categorias.map((c) => (
            <Opcao
              key={c.id}
              name="categoriaId"
              value={String(c.id)}
              marcada={categoriaId === String(c.id)}
              aoEscolher={setCategoriaId}
            >
              <span aria-hidden="true">{c.emoji}</span> {c.nome}
            </Opcao>
          ))}
        </div>
      </Rotulo>

      <Rotulo texto="Forma de pagamento">
        <div className="grid grid-cols-4 gap-2">
          {FORMAS.map((f) => (
            <Opcao
              key={f.valor}
              name="forma"
              value={f.valor}
              marcada={forma === f.valor}
              aoEscolher={setForma}
            >
              {f.rotulo}
            </Opcao>
          ))}
        </div>
      </Rotulo>

      {(forma === "credito" || forma === "debito") &&
        (cartoes.length === 0 ? (
          <p className="rounded-2xl bg-peach p-3 text-sm">
            Você ainda não cadastrou nenhum cartão.{" "}
            <Link href="/cartoes/novo" className="font-bold underline">
              Cadastrar cartão
            </Link>
          </p>
        ) : (
          <Rotulo texto="Cartão">
            <select
              name="cartaoId"
              value={cartaoId}
              onChange={(e) => setCartaoId(e.target.value)}
              className={estiloCampo}
            >
              {cartoes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.banco})
                </option>
              ))}
            </select>
          </Rotulo>
        ))}

      {forma === "credito" && cartoes.length > 0 && (
        <Rotulo texto="Parcelas">
          <select
            name="parcelas"
            value={parcelas}
            onChange={(e) => setParcelas(e.target.value)}
            className={estiloCampo}
          >
            {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "À vista" : `${n}x`}
              </option>
            ))}
          </select>
        </Rotulo>
      )}

      <Rotulo texto="Data da compra">
        <input
          name="data"
          type="date"
          required
          value={data}
          onChange={(e) => setData(e.target.value)}
          className={estiloCampo}
        />
      </Rotulo>

      {faturas && (
        <div className="rounded-2xl bg-lilac p-3 text-sm">
          <p>
            Cai na fatura que vence em <strong>{formatarData(faturas[0].vencimento)}</strong>.
          </p>
          {valoresDasParcelas && faturas.length > 1 && (
            <p className="mt-1">
              {faturas.length}x de {formatarReais(valoresDasParcelas[0])} · última parcela em{" "}
              {formatarData(faturas[faturas.length - 1].vencimento)}
            </p>
          )}
        </div>
      )}

      {forma === "boleto" && (
        <>
          <Rotulo texto="Vencimento do boleto">
            <input
              name="vencimento"
              type="date"
              required
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              className={estiloCampo}
            />
          </Rotulo>
          <Rotulo texto="Situação do boleto">
            <div className="grid grid-cols-2 gap-2">
              <Opcao
                name="statusBoleto"
                value="pendente"
                marcada={statusBoleto === "pendente"}
                aoEscolher={setStatusBoleto}
              >
                Pendente
              </Opcao>
              <Opcao
                name="statusBoleto"
                value="pago"
                marcada={statusBoleto === "pago"}
                aoEscolher={setStatusBoleto}
              >
                Pago
              </Opcao>
            </div>
          </Rotulo>
        </>
      )}

      <Rotulo texto="Quem pagou">
        <div className="grid grid-cols-3 gap-2">
          {pessoas.map((p) => (
            <Opcao
              key={p.id}
              name="pagador"
              value={String(p.id)}
              marcada={pagador === String(p.id)}
              aoEscolher={setPagador}
            >
              {p.nome}
            </Opcao>
          ))}
          <Opcao
            name="pagador"
            value="dividido"
            marcada={pagador === "dividido"}
            aoEscolher={setPagador}
          >
            Dividido
          </Opcao>
        </div>
      </Rotulo>

      <p role="alert" aria-live="polite" className="min-h-5 text-sm font-bold">
        {estado.erro}
      </p>

      <button
        type="submit"
        disabled={pendente}
        className="min-h-12 w-full rounded-full bg-blush-400 font-bold disabled:opacity-60"
      >
        {pendente ? "Salvando..." : "Salvar gasto"}
      </button>
    </form>
  );
}
