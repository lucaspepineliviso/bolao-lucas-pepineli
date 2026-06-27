import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("❌ Por favor, especifique o caminho do arquivo JSON de backup.");
    console.error("Exemplo: npx tsx restore-db.ts ../backups/db_backup_2026-06-27T23-20-00.json");
    process.exit(1);
  }

  const backupFile = path.resolve(args[0]);
  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Arquivo de backup não encontrado: ${backupFile}`);
    process.exit(1);
  }

  console.log(`Lendo dados do arquivo de backup: ${backupFile}...`);
  const data = JSON.parse(fs.readFileSync(backupFile, "utf-8"));

  console.log("⚠️ AVISO: Isso irá DELETAR todos os dados atuais das tabelas Bet, Payment, Match e User!");
  console.log("Aguardando 5 segundos antes de continuar. Pressione Ctrl+C para abortar...");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Limpando banco de dados...");
  // Limpa em ordem para evitar problemas de dependências / constraints
  await prisma.bet.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.match.deleteMany();
  await prisma.user.deleteMany();
  console.log("Banco de dados limpo.");

  console.log(`Restaurando ${data.users.length} usuários...`);
  for (const u of data.users) {
    // Convertemos datas do JSON de string para objeto Date
    await prisma.user.create({
      data: {
        ...u,
        createdAt: new Date(u.createdAt),
      },
    });
  }

  console.log(`Restaurando ${data.matches.length} partidas...`);
  for (const m of data.matches) {
    await prisma.match.create({
      data: {
        ...m,
        matchDate: new Date(m.matchDate),
      },
    });
  }

  console.log(`Restaurando ${data.bets.length} palpites...`);
  for (const b of data.bets) {
    await prisma.bet.create({
      data: {
        ...b,
        createdAt: new Date(b.createdAt),
      },
    });
  }

  console.log(`Restaurando ${data.payments.length} pagamentos...`);
  for (const p of data.payments) {
    await prisma.payment.create({
      data: {
        ...p,
        paidAt: p.paidAt ? new Date(p.paidAt) : null,
        createdAt: new Date(p.createdAt),
      },
    });
  }

  console.log("✅ Restauração concluída com sucesso!");
}

main()
  .catch((err) => {
    console.error("❌ Falha ao restaurar banco:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
