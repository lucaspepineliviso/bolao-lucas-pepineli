import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL || "postgresql://postgres:QAZ12%40%23wsx%21@db.pkysqdgyppkyzyvfuaoz.supabase.co:5432/postgres?sslmode=require";

async function main() {
  const p = new PrismaClient({ datasourceUrl: url });
  try {
    const c = await p.match.count();
    console.log("OK: " + c + " jogos");
  } catch (e: any) {
    console.error("ERRO: " + e.message);
  }
  await p.$disconnect();
}
main();
