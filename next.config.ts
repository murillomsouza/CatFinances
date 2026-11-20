import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
