import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import fs from "node:fs";
import path from "node:path";
import * as schema from "./schema";

// No Docker o arquivo fica em /data (volume). Fora dele, em ./data.
const caminho =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "catfinances.db");

function abrir() {
  fs.mkdirSync(path.dirname(caminho), { recursive: true });
  const sqlite = new Database(caminho);
  sqlite.pragma("journal_mode = WAL"); // mais seguro e rápido para leitura e escrita juntas
  sqlite.pragma("foreign_keys = ON"); // faz o banco respeitar as relações entre tabelas
  sqlite.pragma("busy_timeout = 5000"); // espera até 5s se o arquivo estiver ocupado
  const db = drizzle(sqlite, { schema });
  // Aplica sozinho as migrações pendentes, em dev e em produção
  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  return db;
}

// Guarda a conexão para o hot reload do Next não abrir várias
const g = globalThis as unknown as { __catfinancesDb?: ReturnType<typeof abrir> };
export const db = g.__catfinancesDb ?? (g.__catfinancesDb = abrir());
