import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const matches = await prisma.match.findMany({
    where: { stage: { startsWith: "GRUPO" } },
    orderBy: { matchDate: "asc" },
    select: {
      id: true, homeTeam: true, awayTeam: true,
      matchDate: true, stage: true,
      homeScore: true, awayScore: true, isFinished: true,
    },
  });
  console.log("Total group matches:", matches.length);
  for (const m of matches) {
    const d = m.matchDate.toISOString().slice(0, 16);
    console.log(
      `${m.id} | ${m.stage} | ${m.homeTeam} x ${m.awayTeam} | ${d} | Score: ${m.homeScore ?? "?"}-${m.awayScore ?? "?"} | Finished: ${m.isFinished}`
    );
  }
}

main().finally(() => prisma.$disconnect());
