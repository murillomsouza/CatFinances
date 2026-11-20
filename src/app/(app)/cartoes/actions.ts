"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { cartoes, despesas } from "@/db/schema";
import { exigirUsuario } from "@/lib/sessao";

type Estado = { erro?: string; valores?: Record<string, string> };

function lerDia(valor: FormDataEntryValue | null): number | null {
  const n = Number(valor);
  return Number.isInteger(n) && n >= 1 && n <= 31 ? n : null;
}

export async function salvarCartao(_anterior: Estado, formData: FormData): Promise<Estado> {
  await exigirUsuario();

  const id = Number(formData.get("id")) || null;
  const nome = String(formData.get("nome") ?? "").trim();
  const banco = String(formData.get("banco") ?? "").trim();
  const diaFechamento = lerDia(formData.get("diaFechamento"));
  const diaVencimento = lerDia(formData.get("diaVencimento"));

  // Devolvemos o que foi digitado, para a tela não apagar tudo quando der erro
  const valores = {
    nome,
    banco,
    diaFechamento: String(formData.get("diaFechamento") ?? ""),
    diaVencimento: String(formData.get("diaVencimento") ?? ""),
  };

  if (!nome || nome.length > 40) return { erro: "Dê um nome ao cartão (até 40 letras).", valores };
  if (!banco || banco.length > 40) return { erro: "Informe o banco (até 40 letras).", valores };
  if (!diaFechamento) return { erro: "O dia de fechamento deve ser de 1 a 31.", valores };
  if (!diaVencimento) return { erro: "O dia de vencimento deve ser de 1 a 31.", valores };

  const dados = { nome, banco, diaFechamento, diaVencimento };
  if (id) db.update(cartoes).set(dados).where(eq(cartoes.id, id)).run();
  else db.insert(cartoes).values(dados).run();

  revalidatePath("/cartoes");
  redirect("/cartoes");
}

export async function excluirCartao(formData: FormData) {
  await exigirUsuario();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) redirect("/cartoes");

  // Cartão com gastos lançados não pode sumir, senão as faturas antigas se perdem
  const emUso = db.select({ id: despesas.id }).from(despesas).where(eq(despesas.cartaoId, id)).get();
  if (emUso) redirect(`/cartoes/${id}?erro=em-uso`);

  db.delete(cartoes).where(eq(cartoes.id, id)).run();
  revalidatePath("/cartoes");
  redirect("/cartoes");
}
