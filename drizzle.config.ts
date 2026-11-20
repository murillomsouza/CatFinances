import { defineConfig } from "drizzle-kit";

// Lê src/db/schema.ts e gera os arquivos SQL de migração na pasta ./drizzle
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
