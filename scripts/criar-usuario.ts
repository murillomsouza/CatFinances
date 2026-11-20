import readline from "node:readline";
import { db } from "../src/db";
import { usuarios } from "../src/db/schema";
import { gerarHash } from "../src/lib/senha";

const MAXIMO_DE_USUARIOS = 2;

function perguntar(texto: string, esconder = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    let mudo = false;
    // Para senha: não mostra o que está sendo digitado
    (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (s) => {
      if (!mudo) process.stdout.write(s);
    };
    rl.question(texto, (resposta) => {
      rl.close();
      if (esconder) process.stdout.write("\n");
      resolve(resposta.trim());
    });
    mudo = esconder;
  });
}

function falhar(mensagem: string): never {
  console.error(`✗ ${mensagem}`);
  process.exit(1);
}

async function main() {
  if (db.select().from(usuarios).all().length >= MAXIMO_DE_USUARIOS) {
    falhar(`Já existem ${MAXIMO_DE_USUARIOS} usuários. Este app é só para o casal.`);
  }

  const nome = await perguntar("Nome: ");
  const email = (await perguntar("E-mail: ")).toLowerCase();
  const senha = await perguntar("Senha (mínimo 8 caracteres): ", true);
  const repetir = await perguntar("Repita a senha: ", true);

  if (!nome) falhar("Informe o nome.");
  if (!email.includes("@")) falhar("E-mail inválido.");
  if (senha.length < 8) falhar("A senha precisa ter pelo menos 8 caracteres.");
  if (senha !== repetir) falhar("As senhas não conferem.");

  try {
    db.insert(usuarios).values({ nome, email, senhaHash: gerarHash(senha) }).run();
  } catch {
    falhar("Não consegui criar. Esse e-mail já está cadastrado?");
  }
  console.log(`✓ Usuário criado: ${nome} <${email}>`);
}

main();
