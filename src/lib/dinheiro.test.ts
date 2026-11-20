import { describe, expect, it } from "vitest";
import { dividirEmParcelas, parseValor } from "./dinheiro";

describe("parseValor", () => {
  it("entende vírgula decimal", () => {
    expect(parseValor("12,50")).toBe(1250);
    expect(parseValor("7,9")).toBe(790);
  });
  it("entende ponto de milhar", () => {
    expect(parseValor("1.234,56")).toBe(123456);
    expect(parseValor("1.234")).toBe(123400);
  });
  it("entende ponto como decimal quando só tem 1 ou 2 casas", () => {
    expect(parseValor("12.5")).toBe(1250);
  });
  it("aceita número inteiro e o símbolo R$", () => {
    expect(parseValor("12")).toBe(1200);
    expect(parseValor("R$ 7,90")).toBe(790);
  });
  it("recusa valores inválidos, zero e negativos", () => {
    expect(parseValor("")).toBeNull();
    expect(parseValor("abc")).toBeNull();
    expect(parseValor("0")).toBeNull();
    expect(parseValor("-5")).toBeNull();
    expect(parseValor("12,345")).toBeNull();
    expect(parseValor("1,234,56")).toBeNull();
  });
});

describe("dividirEmParcelas", () => {
  it("não perde centavos", () => {
    expect(dividirEmParcelas(10000, 3)).toEqual([3334, 3333, 3333]);
    expect(dividirEmParcelas(10000, 3).reduce((a, b) => a + b, 0)).toBe(10000);
  });
  it("divisão exata e parcela única", () => {
    expect(dividirEmParcelas(9000, 3)).toEqual([3000, 3000, 3000]);
    expect(dividirEmParcelas(100, 1)).toEqual([100]);
  });
});
