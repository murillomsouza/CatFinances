import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false, // esconde o ícone do Next no canto da tela (só existe em desenvolvimento)
  // O better-sqlite3 tem parte nativa e não pode ser empacotado pelo Next
  serverExternalPackages: ["better-sqlite3"],
  // Liga o Tailwind (veio assim no template, não remover)
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Deixa abrir o servidor de desenvolvimento pelo celular, na rede local
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
