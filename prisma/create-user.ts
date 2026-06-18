import { PrismaClient } from "@prisma/client";

async function main() {
  const p = new PrismaClient({
    datasourceUrl: "postgresql://postgres:QAZ12%40%23wsx%21@db.pkysqdgyppkyzyvfuaoz.supabase.co:5432/postgres",
  });

  try {
    await p.$executeRawUnsafe(`DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vercel_user') THEN CREATE ROLE vercel_user WITH LOGIN PASSWORD 'Bolao2026Verce1'; GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vercel_user; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vercel_user; GRANT USAGE ON SCHEMA public TO vercel_user; END IF; END $$;`);
    console.log("Usuario vercel_user criado!");
  } catch (e: any) {
    console.log("Erro ao criar usuario (pode ja existir): " + e.message);
  }

  // Test the new user
  try {
    const p2 = new PrismaClient({
      datasourceUrl: "postgresql://vercel_user:Bolao2026Verce1@db.pkysqdgyppkyzyvfuaoz.supabase.co:5432/postgres?sslmode=require",
    });
    const c = await p2.match.count();
    console.log("Novo usuario funciona! Jogos: " + c);
    await p2.$disconnect();
  } catch (e: any) {
    console.log("Novo usuario erro: " + e.message);
  }

  await p.$disconnect();
}
main();
