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
