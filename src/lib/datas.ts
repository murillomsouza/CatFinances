import type { DataSimples } from "./fatura";

// A data de hoje no horário de Brasília
export function hojeEmSaoPaulo(): DataSimples {
  const texto = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()); // formato "2026-11-19"
  const [ano, mes, dia] = texto.split("-").map(Number);
  return { ano, mes, dia };
}

export function formatarData({ ano, mes, dia }: DataSimples): string {
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
}

// Lê "AAAA-MM-DD" (campo de data do formulário). Devolve null se não for uma data real.
export function lerData(texto: string): DataSimples | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!m) return null;
  const ano = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);
  if (ano < 2000 || ano > 2100) return null;
  const conferida = new Date(Date.UTC(ano, mes - 1, dia));
  if (
    conferida.getUTCFullYear() !== ano ||
    conferida.getUTCMonth() !== mes - 1 ||
    conferida.getUTCDate() !== dia
  ) {
    return null;
  }
  return { ano, mes, dia };
}

// O contrário: transforma em "AAAA-MM-DD" para guardar no banco
export function paraTexto({ ano, mes, dia }: DataSimples): string {
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}
