"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { cartoes, categorias, despesas, usuarios } from "@/db/schema";
import { lerData, paraTexto } from "@/lib/datas";
import { dividirEmParcelas, parseValor } from "@/lib/dinheiro";
import { calcularParcelas, type DataSimples } from "@/lib/fatura";
import { exigirUsuario } from "@/lib/sessao";

const FORMAS = ["credito", "debito", "pix", "boleto"] as const;
type Forma = (typeof FORMAS)[number];

export async function salvarDespesa(
  _anterior: { erro?: string },
  formData: FormData,
): Promise<{ erro?: string }> {
  const usuario = await exigirUsuario();
  const texto = (nome: string) => String(formData.get(nome) ?? "").trim();

  // Tudo é conferido de novo aqui no servidor: nunca confiamos só no formulário
  const valor = parseValor(texto("valor"));
  if (!valor) return { erro: "Informe um valor válido, como 25,90." };

  const descricao = texto("descricao");
  if (!descricao || descricao.length > 60) return { erro: "Descreva o gasto (até 60 letras)." };

  const data = lerData(texto("data"));
  if (!data) return { erro: "Data da compra inválida." };

  const categoriaId = Number(texto("categoriaId"));
  if (!db.select().from(categorias).where(eq(categorias.id, categoriaId)).get()) {
    return { erro: "Escolha uma categoria." };
  }

  const forma = texto("forma") as Forma;
  if (!FORMAS.includes(forma)) return { erro: "Escolha a forma de pagamento." };

  let pagadorId: number | null = null; // vazio = dividido
  if (texto("pagador") !== "dividido") {
    pagadorId = Number(texto("pagador"));
    if (!db.select().from(usuarios).where(eq(usuarios.id, pagadorId)).get()) {
      return { erro: "Escolha quem pagou." };
    }
  }

  let cartaoId: number | null = null;
  let vencimentos: DataSimples[] = [data]; // débito e pix: paga no dia
  let valores = [valor];
  let pago = true;

  if (forma === "credito" || forma === "debito") {
    const cartao = db.select().from(cartoes).where(eq(cartoes.id, Number(texto("cartaoId")))).get();
    if (!cartao) return { erro: "Escolha o cartão. Se ainda não tem, cadastre em Cartões." };
    cartaoId = cartao.id;

    if (forma === "credito") {
      const parcelas = Number(texto("parcelas") || "1");
      if (!Number.isInteger(parcelas) || parcelas < 1 || parcelas > 24) {
        return { erro: "O número de parcelas deve ser de 1 a 24." };
      }
      vencimentos = calcularParcelas(data, cartao, parcelas).map((f) => f.vencimento);
      valores = dividirEmParcelas(valor, parcelas);
    }
  }

  if (forma === "boleto") {
    const vencimento = lerData(texto("vencimento"));
    if (!vencimento) return { erro: "Informe o vencimento do boleto." };
    vencimentos = [vencimento];
    pago = texto("statusBoleto") === "pago";
  }

  const grupoId = randomUUID();
  db.transaction((tx) => {
    valores.forEach((valorDaParcela, i) => {
      tx.insert(despesas)
        .values({
          grupoId,
          parcela: i + 1,
          totalParcelas: valores.length,
          descricao,
          valorCentavos: valorDaParcela,
          data: paraTexto(data),
          dataPagamento: paraTexto(vencimentos[i]),
          categoriaId,
          forma,
          cartaoId,
          pagadorId,
          pago,
          criadoPorId: usuario.id,
        })
        .run();
    });
  });

  revalidatePath("/");
  redirect("/");
}

// Exclui a compra inteira (todas as parcelas)
export async function excluirDespesa(formData: FormData) {
  await exigirUsuario();
  const grupoId = String(formData.get("grupoId") ?? "");
  if (grupoId) db.delete(despesas).where(eq(despesas.grupoId, grupoId)).run();
  revalidatePath("/");
}
