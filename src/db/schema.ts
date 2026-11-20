import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// As 2 contas do casal
export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(), // nunca a senha em si
  criadoEm: text("criado_em").notNull().default(sql`(datetime('now'))`),
});

// Sessões de login. O "id" é um hash do token; o token em si só existe no cookie.
export const sessoes = sqliteTable("sessoes", {
  id: text("id").primaryKey(),
  usuarioId: integer("usuario_id")
    .notNull()
    .references(() => usuarios.id, { onDelete: "cascade" }),
  expiraEm: integer("expira_em").notNull(), // milissegundos desde 1970
});

// Cartões do casal (os dois enxergam todos)
export const cartoes = sqliteTable("cartoes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  banco: text("banco").notNull(),
  diaFechamento: integer("dia_fechamento").notNull(), // 1 a 31
  diaVencimento: integer("dia_vencimento").notNull(), // 1 a 31
  criadoEm: text("criado_em").notNull().default(sql`(datetime('now'))`),
});

// Categorias de gasto (as 4 primeiras são criadas sozinhas ao abrir o banco)
export const categorias = sqliteTable("categorias", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull().unique(),
  emoji: text("emoji").notNull().default("🐾"),
});

// Cada linha é UMA parcela. Compra à vista = 1 linha.
// Compra em 3x no crédito = 3 linhas com o mesmo grupo_id.
export const despesas = sqliteTable("despesas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  grupoId: text("grupo_id").notNull(),
  parcela: integer("parcela").notNull().default(1),
  totalParcelas: integer("total_parcelas").notNull().default(1),
  descricao: text("descricao").notNull(),
  valorCentavos: integer("valor_centavos").notNull(), // dinheiro sempre em centavos
  data: text("data").notNull(), // "AAAA-MM-DD": dia da compra
  dataPagamento: text("data_pagamento").notNull(), // "AAAA-MM-DD": quando o dinheiro sai
  categoriaId: integer("categoria_id")
    .notNull()
    .references(() => categorias.id),
  forma: text("forma", { enum: ["credito", "debito", "pix", "boleto"] }).notNull(),
  cartaoId: integer("cartao_id").references(() => cartoes.id),
  pagadorId: integer("pagador_id").references(() => usuarios.id), // vazio = dividido
  pago: integer("pago", { mode: "boolean" }).notNull().default(true),
  criadoPorId: integer("criado_por_id")
    .notNull()
    .references(() => usuarios.id),
  criadoEm: text("criado_em").notNull().default(sql`(datetime('now'))`),
});
