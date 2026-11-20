# Estágio de desenvolvimento. O estágio de produção entra depois, quando o banco existir.
FROM node:22-bookworm-slim AS dev
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
USER node
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
