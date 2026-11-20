"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { usuarios } from "@/db/schema";
import { conferirSenha, gerarHash } from "@/lib/senha";
import { criarSessao } from "@/lib/sessao";

const MAX_TENTATIVAS = 5;
const JANELA_MS = 15 * 60 * 1000;

// Contagem de erros por e-mail, na memória (zera se o app reiniciar)
const tentativas = new Map<string, { quantas: number; desde: number }>();

// Hash falso: se o e-mail não existe, gastamos o mesmo tempo de uma conferência real
const HASH_FALSO = gerarHash("senha-falsa-para-igualar-o-tempo");

export async function entrar(
  _anterior: { erro?: string },
  formData: FormData,
): Promise<{ erro?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  if (!email || !senha) return { erro: "Preencha e-mail e senha." };

  let atual = tentativas.get(email);
  if (atual && Date.now() - atual.desde > JANELA_MS) {
    tentativas.delete(email);
    atual = undefined;
  }
  if (atual && atual.quantas >= MAX_TENTATIVAS) {
    return { erro: "Muitas tentativas. Espere uns 15 minutos e tente de novo." };
  }

  const usuario = db.select().from(usuarios).where(eq(usuarios.email, email)).get();
  const ok = conferirSenha(senha, usuario?.senhaHash ?? HASH_FALSO);

  if (!usuario || !ok) {
    tentativas.set(email, {
      quantas: (atual?.quantas ?? 0) + 1,
      desde: atual?.desde ?? Date.now(),
    });
    return { erro: "E-mail ou senha incorretos." };
  }

  tentativas.delete(email);
  await criarSessao(usuario.id);
  redirect("/");
}
