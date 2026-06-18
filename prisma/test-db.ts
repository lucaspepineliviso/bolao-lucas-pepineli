import { PrismaClient } from "@prisma/client";

const url = "postgresql://postgres:QAZ12%40%23wsx%21@db.pkysqdgyppkyzyvfuaoz.supabase.co:5432/postgres?sslmode=require";

async function main() {
  const p = new PrismaClient({ datasourceUrl: url });
  try {
    const c = await p.match.count();
    console.log("CONECTADO - Jogos: " + c);
  } catch (e: any) {
    console.log("ERRO: " + e.message);
  }
  await p.$disconnect();
}
main();
