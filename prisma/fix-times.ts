import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DATE_UPDATES: { homeTeam: string; awayTeam: string; newDate: string }[] = [
  // Grupo A
  { homeTeam: "México", awayTeam: "Coreia do Sul", newDate: "2026-06-18T22:00:00-03:00" },
  { homeTeam: "República Tcheca", awayTeam: "México", newDate: "2026-06-24T22:00:00-03:00" },
  { homeTeam: "África do Sul", awayTeam: "Coreia do Sul", newDate: "2026-06-24T22:00:00-03:00" },
  // Grupo C
  { homeTeam: "Haiti", awayTeam: "Escócia", newDate: "2026-06-13T22:00:00-03:00" },
  { homeTeam: "Brasil", awayTeam: "Haiti", newDate: "2026-06-19T21:30:00-03:00" },
  // Grupo D
  { homeTeam: "Turquia", awayTeam: "Paraguai", newDate: "2026-06-19T13:00:00-03:00" },
  { homeTeam: "Turquia", awayTeam: "Estados Unidos", newDate: "2026-06-25T23:00:00-03:00" },
  { homeTeam: "Paraguai", awayTeam: "Austrália", newDate: "2026-06-25T23:00:00-03:00" },
  // Grupo E
  { homeTeam: "Equador", awayTeam: "Curaçao", newDate: "2026-06-20T21:00:00-03:00" },
  // Grupo F
  { homeTeam: "Suécia", awayTeam: "Tunísia", newDate: "2026-06-14T23:00:00-03:00" },
  // Grupo G
  { homeTeam: "Irã", awayTeam: "Nova Zelândia", newDate: "2026-06-15T22:00:00-03:00" },
  { homeTeam: "Nova Zelândia", awayTeam: "Egito", newDate: "2026-06-21T22:00:00-03:00" },
  { homeTeam: "Egito", awayTeam: "Irã", newDate: "2026-06-27T00:00:00-03:00" },
  { homeTeam: "Nova Zelândia", awayTeam: "Bélgica", newDate: "2026-06-27T00:00:00-03:00" },
  // Grupo I
  { homeTeam: "Iraque", awayTeam: "Noruega", newDate: "2026-06-16T19:00:00-03:00" },
  // Grupo J
  { homeTeam: "Jordânia", awayTeam: "Argélia", newDate: "2026-06-23T00:00:00-03:00" },
  { homeTeam: "Argélia", awayTeam: "Áustria", newDate: "2026-06-27T23:00:00-03:00" },
  { homeTeam: "Jordânia", awayTeam: "Argentina", newDate: "2026-06-27T23:00:00-03:00" },
  // Grupo K
  { homeTeam: "Uzbequistão", awayTeam: "Colômbia", newDate: "2026-06-17T23:00:00-03:00" },
  // R32
  { homeTeam: "1º B", awayTeam: "3º Melhor", newDate: "2026-07-03T22:30:00-03:00" },
];

async function main() {
  console.log("🔄 Atualizando horários dos jogos...");

  let updated = 0;
  for (const u of DATE_UPDATES) {
    const result = await prisma.match.updateMany({
      where: { homeTeam: u.homeTeam, awayTeam: u.awayTeam },
      data: { matchDate: new Date(u.newDate) },
    });
    if (result.count > 0) {
      updated += result.count;
      console.log(`  ✅ ${u.homeTeam} vs ${u.awayTeam} → ${u.newDate}`);
    } else {
      console.log(`  ⚠️  ${u.homeTeam} vs ${u.awayTeam} não encontrado`);
    }
  }

  console.log(`\n✅ ${updated} jogos atualizados com horários corretos!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
