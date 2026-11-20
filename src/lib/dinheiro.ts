// Dinheiro sempre em centavos (número inteiro), nunca em decimal.

// Lê o que a pessoa digitou ("25,90", "1.234,56", "12.5") e devolve centavos.
// Devolve null se o valor não for válido ou for zero.
export function parseValor(texto: string): number | null {
  let t = texto.replace(/[R$\s]/g, "");
  if (t.includes(",")) {
    t = t.replace(/\./g, "").replace(",", "."); // com vírgula, os pontos são de milhar
  } else if (/^\d{1,3}(\.\d{3})+$/.test(t)) {
    t = t.replace(/\./g, ""); // "1.234" = mil duzentos e trinta e quatro
  }
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;

  const [inteiro, fracao = ""] = t.split(".");
  const centavos = Number(inteiro) * 100 + Number(fracao.padEnd(2, "0"));
  if (!Number.isSafeInteger(centavos) || centavos <= 0 || centavos > 9_999_999_999) return null;
  return centavos;
}

// Divide um valor em parcelas sem perder centavos: as primeiras levam o centavo que sobra.
// Ex.: 10000 em 3 vira [3334, 3333, 3333]
export function dividirEmParcelas(totalCentavos: number, parcelas: number): number[] {
  const base = Math.floor(totalCentavos / parcelas);
  const sobra = totalCentavos - base * parcelas;
  return Array.from({ length: parcelas }, (_, i) => (i < sobra ? base + 1 : base));
}

export function formatarReais(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    centavos / 100,
  );
}
