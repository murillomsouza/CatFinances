import { createHash, randomBytes } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { sessoes, usuarios } from "@/db/schema";

const NOME_DO_COOKIE = "cf_sessao";
const DURACAO_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

// No banco guardamos só o hash do token; o token de verdade fica no cookie
const hashDoToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function criarSessao(usuarioId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiraEm = Date.now() + DURACAO_MS;

  db.delete(sessoes).where(lt(sessoes.expiraEm, Date.now())).run(); // limpa sessões vencidas
  db.insert(sessoes).values({ id: hashDoToken(token), usuarioId, expiraEm }).run();

  const jar = await cookies();
  jar.set(NOME_DO_COOKIE, token, {
    httpOnly: true, // o JavaScript da página não consegue ler o cookie
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true", // só funciona com HTTPS
    path: "/",
    expires: new Date(expiraEm),
  });
}

// Devolve o usuário logado, ou null
export const obterUsuario = cache(async () => {
  const jar = await cookies();
  const token = jar.get(NOME_DO_COOKIE)?.value;
  if (!token) return null;

  const linha = db
    .select({
      id: usuarios.id,
      nome: usuarios.nome,
      email: usuarios.email,
      expiraEm: sessoes.expiraEm,
    })
    .from(sessoes)
    .innerJoin(usuarios, eq(usuarios.id, sessoes.usuarioId))
    .where(eq(sessoes.id, hashDoToken(token)))
    .get();

  if (!linha || linha.expiraEm < Date.now()) return null;
  return { id: linha.id, nome: linha.nome, email: linha.email };
});

// Usar no começo de toda tela ou ação que mexe com dados
export async function exigirUsuario() {
  const usuario = await obterUsuario();
  if (!usuario) redirect("/entrar");
  return usuario;
}

export async function encerrarSessao() {
  const jar = await cookies();
  const token = jar.get(NOME_DO_COOKIE)?.value;
  if (token) db.delete(sessoes).where(eq(sessoes.id, hashDoToken(token))).run();
  jar.delete(NOME_DO_COOKIE);
}
