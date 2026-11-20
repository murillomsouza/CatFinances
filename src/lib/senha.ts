import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Transforma a senha em um hash com "sal" aleatório (scrypt, já vem no Node)
export function gerarHash(senha: string): string {
  const sal = randomBytes(16);
  const hash = scryptSync(senha, sal, 64);
  return `scrypt$${sal.toString("hex")}$${hash.toString("hex")}`;
}

// Confere uma senha digitada contra o hash guardado
export function conferirSenha(senha: string, guardado: string): boolean {
  const [tipo, salHex, hashHex] = guardado.split("$");
  if (tipo !== "scrypt" || !salHex || !hashHex) return false;
  const esperado = Buffer.from(hashHex, "hex");
  const calculado = scryptSync(senha, Buffer.from(salHex, "hex"), esperado.length);
  return timingSafeEqual(calculado, esperado);
}
