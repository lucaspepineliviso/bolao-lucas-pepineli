import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const match = await prisma.match.findFirst({
    where: { homeTeam: "Austrália" },
  });

  if (!match) {
    console.log("Jogo não encontrado");
    return;
  }

  console.log("Antes:", match.matchDate.toISOString());

  await prisma.match.update({
    where: { id: match.id },
    data: { matchDate: new Date("2026-06-14T01:00:00-03:00") },
  });

  const updated = await prisma.match.findUnique({ where: { id: match.id } });
  console.log("Depois:", updated?.matchDate.toISOString());
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
