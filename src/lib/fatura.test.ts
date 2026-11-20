import { describe, expect, it } from "vitest";
import { calcularFatura, calcularParcelas } from "./fatura";

const d = (ano: number, mes: number, dia: number) => ({ ano, mes, dia });

describe("calcularFatura: fecha dia 10, vence dia 17", () => {
  const cartao = { diaFechamento: 10, diaVencimento: 17 };

  it("compra antes do fechamento entra na fatura do mesmo mês", () => {
    const f = calcularFatura(d(2026, 11, 5), cartao);
    expect(f.fechamento).toEqual(d(2026, 11, 10));
    expect(f.vencimento).toEqual(d(2026, 11, 17));
    expect(f.chave).toBe("2026-11");
  });

  it("compra no próprio dia do fechamento ainda entra na fatura do mês", () => {
    const f = calcularFatura(d(2026, 11, 10), cartao);
    expect(f.fechamento).toEqual(d(2026, 11, 10));
  });

  it("compra depois do fechamento vai para a fatura do mês seguinte", () => {
    const f = calcularFatura(d(2026, 11, 12), cartao);
    expect(f.fechamento).toEqual(d(2026, 12, 10));
    expect(f.vencimento).toEqual(d(2026, 12, 17));
  });

  it("vira o ano corretamente", () => {
    const f = calcularFatura(d(2026, 12, 20), cartao);
    expect(f.fechamento).toEqual(d(2027, 1, 10));
    expect(f.vencimento).toEqual(d(2027, 1, 17));
  });
});

describe("calcularFatura: vencimento menor que o fechamento (fecha 25, vence 5)", () => {
  const cartao = { diaFechamento: 25, diaVencimento: 5 };

  it("vence no mês seguinte ao fechamento", () => {
    const f = calcularFatura(d(2026, 11, 10), cartao);
    expect(f.fechamento).toEqual(d(2026, 11, 25));
    expect(f.vencimento).toEqual(d(2026, 12, 5));
  });

  it("compra depois do fechamento, virando o ano", () => {
    const f = calcularFatura(d(2026, 11, 28), cartao);
    expect(f.fechamento).toEqual(d(2026, 12, 25));
    expect(f.vencimento).toEqual(d(2027, 1, 5));
  });
});

describe("calcularFatura: meses curtos (fecha 31, vence 10)", () => {
  const cartao = { diaFechamento: 31, diaVencimento: 10 };

  it("fevereiro fecha no dia 28", () => {
    const f = calcularFatura(d(2027, 2, 15), cartao);
    expect(f.fechamento).toEqual(d(2027, 2, 28));
    expect(f.vencimento).toEqual(d(2027, 3, 10));
  });

  it("fevereiro de ano bissexto fecha no dia 29", () => {
    const f = calcularFatura(d(2028, 2, 29), cartao);
    expect(f.fechamento).toEqual(d(2028, 2, 29));
  });

  it("compra de 1º de março entra na fatura de março, que fecha dia 31", () => {
    const f = calcularFatura(d(2027, 3, 1), cartao);
    expect(f.fechamento).toEqual(d(2027, 3, 31));
  });
});

describe("calcularParcelas", () => {
  it("gera uma fatura por mês, a partir da primeira", () => {
    const cartao = { diaFechamento: 10, diaVencimento: 17 };
    const parcelas = calcularParcelas(d(2026, 11, 12), cartao, 3);
    expect(parcelas.map((p) => p.chave)).toEqual(["2026-12", "2027-01", "2027-02"]);
    expect(parcelas.map((p) => p.vencimento)).toEqual([
      d(2026, 12, 17),
      d(2027, 1, 17),
      d(2027, 2, 17),
    ]);
  });
});
