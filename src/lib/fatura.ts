// Cálculo de fatura de cartão de crédito.
// Usa datas simples (ano, mês 1-12, dia), sem Date, para fuso horário nunca atrapalhar.

export type DataSimples = { ano: number; mes: number; dia: number };
export type ConfigCartao = { diaFechamento: number; diaVencimento: number };
export type Fatura = {
  chave: string; // "AAAA-MM" do mês em que a fatura fecha
  fechamento: DataSimples;
  vencimento: DataSimples;
};

function diasNoMes(ano: number, mes: number): number {
  return new Date(Date.UTC(ano, mes, 0)).getUTCDate();
}

// Dia 31 em fevereiro vira 28 (ou 29 em ano bissexto)
function ajustarDia(ano: number, mes: number, dia: number): number {
  return Math.min(dia, diasNoMes(ano, mes));
}

function somarMeses(ano: number, mes: number, n: number): { ano: number; mes: number } {
  const indice = ano * 12 + (mes - 1) + n;
  return { ano: Math.floor(indice / 12), mes: (indice % 12) + 1 };
}

// Monta a fatura que fecha em um determinado mês
function montarFatura(ano: number, mes: number, cartao: ConfigCartao): Fatura {
  const fechamento = { ano, mes, dia: ajustarDia(ano, mes, cartao.diaFechamento) };
  // Vencimento depois do fechamento no calendário = mesmo mês. Senão, mês seguinte.
  const mesDoVencimento =
    cartao.diaVencimento > cartao.diaFechamento ? { ano, mes } : somarMeses(ano, mes, 1);
  const vencimento = {
    ...mesDoVencimento,
    dia: ajustarDia(mesDoVencimento.ano, mesDoVencimento.mes, cartao.diaVencimento),
  };
  return { chave: `${ano}-${String(mes).padStart(2, "0")}`, fechamento, vencimento };
}

// Em qual fatura cai uma compra feita nesta data?
export function calcularFatura(compra: DataSimples, cartao: ConfigCartao): Fatura {
  // REGRA: até o dia do fechamento (inclusive) entra na fatura deste mês
  const entraNaFaturaDoMes =
    compra.dia <= ajustarDia(compra.ano, compra.mes, cartao.diaFechamento);
  const { ano, mes } = entraNaFaturaDoMes ? compra : somarMeses(compra.ano, compra.mes, 1);
  return montarFatura(ano, mes, cartao);
}

// Compra parcelada: uma fatura por parcela, mês a mês
export function calcularParcelas(
  compra: DataSimples,
  cartao: ConfigCartao,
  totalDeParcelas: number,
): Fatura[] {
  const primeira = calcularFatura(compra, cartao);
  return Array.from({ length: totalDeParcelas }, (_, i) => {
    const { ano, mes } = somarMeses(primeira.fechamento.ano, primeira.fechamento.mes, i);
    return montarFatura(ano, mes, cartao);
  });
}
