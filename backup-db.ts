import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando backup lógico do banco de dados Neon...");

  const users = await prisma.user.findMany();
  const matches = await prisma.match.findMany();
  const bets = await prisma.bet.findMany();
  const payments = await prisma.payment.findMany();

  const backupData = {
    timestamp: new Date().toISOString(),
    users,
    matches,
    bets,
    payments,
  };

  const backupsDir = path.join(__dirname, "../backups");
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const timestampStr = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(backupsDir, `db_backup_${timestampStr}.json`);

  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

  console.log(`✅ Backup lógico salvo com sucesso em: ${backupFile}`);
  console.log(`   Usuários: ${users.length}`);
  console.log(`   Partidas: ${matches.length}`);
  console.log(`   Palpites: ${bets.length}`);
  console.log(`   Pagamentos: ${payments.length}`);
}

main()
  .catch((err) => {
    console.error("❌ Falha ao realizar backup:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
