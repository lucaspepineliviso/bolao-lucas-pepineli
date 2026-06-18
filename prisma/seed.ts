import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findUnique({ where: { email: "lucaspepineliviso@gmail.com" } });
  if (!adminExists) {
    const hash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: { name: "Admin", email: "lucaspepineliviso@gmail.com", password: hash, role: "ADMIN" },
    });
    console.log("Admin criado, atualize a senha pelo painel");
  }

  await prisma.match.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.user.deleteMany({ where: { role: "USER" } });

  console.log("Deleted old data. Creating 2026 World Cup groups...");

  const groups = {
    A: ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
    B: ["Canadá", "Suíça", "Qatar", "Bósnia e Herzegovina"],
    C: ["Brasil", "Marrocos", "Escócia", "Haiti"],
    D: ["Estados Unidos", "Austrália", "Turquia", "Paraguai"],
    E: ["Alemanha", "Costa do Marfim", "Equador", "Curaçao"],
    F: ["Suécia", "Japão", "Holanda", "Tunísia"],
    G: ["Nova Zelândia", "Irã", "Bélgica", "Egito"],
    H: ["Uruguai", "Arábia Saudita", "Espanha", "Cabo Verde"],
    I: ["Noruega", "França", "Senegal", "Iraque"],
    J: ["Argentina", "Áustria", "Jordânia", "Argélia"],
    K: ["Colômbia", "RD Congo", "Portugal", "Uzbequistão"],
    L: ["Inglaterra", "Gana", "Panamá", "Croácia"],
  };

  const groupOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  const baseDate = new Date("2026-06-11T00:00:00-03:00");

  const schedule: { group: string; matchday: number; home: number; away: number; date: Date }[] = [];

  const MATCHDAY_PAIRS = [
    [0, 1, 2, 3], // MD1: 1v2, 3v4
    [0, 2, 3, 1], // MD2: 1v3, 4v2
    [3, 0, 1, 2], // MD3: 4v1, 2v3
  ];

  const GROUP_MD_DATES: Record<string, [number, number, number]> = {
    A: [0, 18, 24],
    B: [1, 18, 24],
    C: [1, 19, 24],
    D: [1, 19, 25],
    E: [2, 20, 25],
    F: [2, 20, 25],
    G: [3, 21, 26],
    H: [3, 21, 26],
    I: [4, 22, 26],
    J: [4, 22, 27],
    K: [5, 23, 27],
    L: [5, 23, 27],
  };

  const TIMES = [
    ["13:00", "16:00"],
    ["16:00", "19:00"],
    ["13:00", "16:00"],
    ["19:00", "22:00"],
    ["13:00", "16:00"],
    ["19:00", "22:00"],
    ["13:00", "16:00"],
    ["19:00", "22:00"],
    ["13:00", "16:00"],
    ["19:00", "22:00"],
    ["16:00", "19:00"],
    ["22:00", "13:00"],
  ];

  for (let gi = 0; gi < groupOrder.length; gi++) {
    const letter = groupOrder[gi];
    const teams = groups[letter as keyof typeof groups];
    const mdDates = GROUP_MD_DATES[letter];

    for (let md = 0; md < 3; md++) {
      const dayOffset = mdDates[md];
      const pair = MATCHDAY_PAIRS[md];
      const times = TIMES[gi];

      const d = new Date(baseDate);
      d.setDate(d.getDate() + dayOffset);

      const match1 = new Date(d);
      const [h1, m1] = times[0].split(":").map(Number);
      match1.setHours(h1, m1, 0, 0);

      const match2 = new Date(d);
      const [h2, m2] = times[1].split(":").map(Number);
      match2.setHours(h2, m2, 0, 0);

      schedule.push({ group: letter, matchday: md + 1, home: pair[0], away: pair[1], date: match1 });
      schedule.push({ group: letter, matchday: md + 1, home: pair[2], away: pair[3], date: match2 });
    }
  }

  for (const s of schedule) {
    const teams = groups[s.group as keyof typeof groups];
    const stages: Record<string, string> = {
      A: "GRUPO A", B: "GRUPO B", C: "GRUPO C", D: "GRUPO D",
      E: "GRUPO E", F: "GRUPO F", G: "GRUPO G", H: "GRUPO H",
      I: "GRUPO I", J: "GRUPO J", K: "GRUPO K", L: "GRUPO L",
    };

    await prisma.match.create({
      data: {
        homeTeam: teams[s.home],
        awayTeam: teams[s.away],
        matchDate: s.date,
        stage: stages[s.group],
        groupName: `Grupo ${s.group}`,
      },
    });
  }

  console.log("✅ 72 jogos da fase de grupos cadastrados!");

  const r32 = [
    ["2º A", "2º B", "2026-06-28T13:00:00-03:00"],
    ["1º E", "3º Melhor", "2026-06-28T16:00:00-03:00"],
    ["1º F", "2º C", "2026-06-28T19:00:00-03:00"],
    ["1º C", "2º F", "2026-06-28T22:00:00-03:00"],
    ["1º I", "3º Melhor", "2026-06-29T13:00:00-03:00"],
    ["1º D", "3º Melhor", "2026-06-29T16:00:00-03:00"],
    ["1º A", "3º Melhor", "2026-06-29T19:00:00-03:00"],
    ["1º L", "3º Melhor", "2026-06-29T22:00:00-03:00"],
    ["1º G", "3º Melhor", "2026-06-30T13:00:00-03:00"],
    ["1º B", "3º Melhor", "2026-06-30T16:00:00-03:00"],
    ["1º H", "2º J", "2026-06-30T19:00:00-03:00"],
    ["1º J", "2º H", "2026-06-30T22:00:00-03:00"],
    ["1º K", "3º Melhor", "2026-07-01T13:00:00-03:00"],
    ["2º E", "2º I", "2026-07-01T16:00:00-03:00"],
    ["2º D", "2º G", "2026-07-01T19:00:00-03:00"],
    ["2º K", "2º L", "2026-07-01T22:00:00-03:00"],
  ];

  for (const [h, a, d] of r32) {
    await prisma.match.create({ data: { homeTeam: h, awayTeam: a, matchDate: new Date(d), stage: "OITAVAS" } });
  }

  const r16 = [
    ["Vencedor Oitavas 1", "Vencedor Oitavas 2", "2026-07-03T13:00:00-03:00"],
    ["Vencedor Oitavas 3", "Vencedor Oitavas 4", "2026-07-03T16:00:00-03:00"],
    ["Vencedor Oitavas 5", "Vencedor Oitavas 6", "2026-07-04T13:00:00-03:00"],
    ["Vencedor Oitavas 7", "Vencedor Oitavas 8", "2026-07-04T16:00:00-03:00"],
    ["Vencedor Oitavas 9", "Vencedor Oitavas 10", "2026-07-05T13:00:00-03:00"],
    ["Vencedor Oitavas 11", "Vencedor Oitavas 12", "2026-07-05T16:00:00-03:00"],
    ["Vencedor Oitavas 13", "Vencedor Oitavas 14", "2026-07-06T13:00:00-03:00"],
    ["Vencedor Oitavas 15", "Vencedor Oitavas 16", "2026-07-06T16:00:00-03:00"],
  ];

  for (const [h, a, d] of r16) {
    await prisma.match.create({ data: { homeTeam: h, awayTeam: a, matchDate: new Date(d), stage: "OITAVAS FINAL" } });
  }

  const qf = [
    ["Vencedor 8avas Final 1", "Vencedor 8avas Final 2", "2026-07-09T16:00:00-03:00"],
    ["Vencedor 8avas Final 3", "Vencedor 8avas Final 4", "2026-07-10T13:00:00-03:00"],
    ["Vencedor 8avas Final 5", "Vencedor 8avas Final 6", "2026-07-10T16:00:00-03:00"],
    ["Vencedor 8avas Final 7", "Vencedor 8avas Final 8", "2026-07-11T13:00:00-03:00"],
  ];

  for (const [h, a, d] of qf) {
    await prisma.match.create({ data: { homeTeam: h, awayTeam: a, matchDate: new Date(d), stage: "QUARTAS" } });
  }

  const semis = [
    ["Vencedor Quartas 1", "Vencedor Quartas 2", "2026-07-14T16:00:00-03:00"],
    ["Vencedor Quartas 3", "Vencedor Quartas 4", "2026-07-15T16:00:00-03:00"],
  ];

  for (const [h, a, d] of semis) {
    await prisma.match.create({ data: { homeTeam: h, awayTeam: a, matchDate: new Date(d), stage: "SEMIFINAL" } });
  }

  await prisma.match.create({ data: { homeTeam: "Perdedor Semi 1", awayTeam: "Perdedor Semi 2", matchDate: new Date("2026-07-18T16:00:00-03:00"), stage: "3º LUGAR" } });
  await prisma.match.create({ data: { homeTeam: "Vencedor Semi 1", awayTeam: "Vencedor Semi 2", matchDate: new Date("2026-07-19T16:00:00-03:00"), stage: "FINAL" } });

  console.log("✅ 16 Oitavas + 8 Oitavas Final + 4 Quartas + 2 Semis + Final + 3º lugar!");
  console.log("");
  console.log("📋 Grupos da Copa 2026:");
  for (const letter of groupOrder) {
    const teams = groups[letter as keyof typeof groups];
    console.log(`   Grupo ${letter}: ${teams.join(", ")}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
