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

  const matchCount = await prisma.match.count();
  if (matchCount > 0) {
    console.log("⚠️ Jogos já existem no banco. Seed ignorado para preservar palpites e dados.");
    console.log(`   ${matchCount} jogos, ${await prisma.user.count()} usuários, ${await prisma.bet.count()} palpites preservados.`);
    return;
  }

  console.log("Criando 2026 World Cup groups...");

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

  const OFFICIAL_MATCHES: { group: string; home: string; away: string; date: string }[] = [
    // GRUPO A: México, África do Sul, Coreia do Sul, República Tcheca
    { group: "A", home: "México", away: "África do Sul", date: "2026-06-11T18:00:00-03:00" },
    { group: "A", home: "Coreia do Sul", away: "República Tcheca", date: "2026-06-11T21:00:00-03:00" },
    { group: "A", home: "República Tcheca", away: "África do Sul", date: "2026-06-18T15:00:00-03:00" },
    { group: "A", home: "México", away: "Coreia do Sul", date: "2026-06-19T00:00:00-03:00" },
    { group: "A", home: "República Tcheca", away: "México", date: "2026-06-25T00:00:00-03:00" },
    { group: "A", home: "África do Sul", away: "Coreia do Sul", date: "2026-06-25T00:00:00-03:00" },

    // GRUPO B: Canadá, Suíça, Qatar, Bósnia e Herzegovina
    { group: "B", home: "Canadá", away: "Bósnia e Herzegovina", date: "2026-06-12T18:00:00-03:00" },
    { group: "B", home: "Qatar", away: "Suíça", date: "2026-06-13T18:00:00-03:00" },
    { group: "B", home: "Suíça", away: "Bósnia e Herzegovina", date: "2026-06-18T18:00:00-03:00" },
    { group: "B", home: "Canadá", away: "Qatar", date: "2026-06-18T21:00:00-03:00" },
    { group: "B", home: "Suíça", away: "Canadá", date: "2026-06-24T18:00:00-03:00" },
    { group: "B", home: "Bósnia e Herzegovina", away: "Qatar", date: "2026-06-24T18:00:00-03:00" },

    // GRUPO C: Brasil, Marrocos, Haiti, Escócia
    { group: "C", home: "Brasil", away: "Marrocos", date: "2026-06-13T21:00:00-03:00" },
    { group: "C", home: "Haiti", away: "Escócia", date: "2026-06-14T00:00:00-03:00" },
    { group: "C", home: "Escócia", away: "Marrocos", date: "2026-06-19T21:00:00-03:00" },
    { group: "C", home: "Brasil", away: "Haiti", date: "2026-06-20T00:00:00-03:00" },
    { group: "C", home: "Escócia", away: "Brasil", date: "2026-06-24T21:00:00-03:00" },
    { group: "C", home: "Marrocos", away: "Haiti", date: "2026-06-24T21:00:00-03:00" },

    // GRUPO D: Estados Unidos, Austrália, Turquia, Paraguai
    { group: "D", home: "Estados Unidos", away: "Paraguai", date: "2026-06-12T21:00:00-03:00" },
    { group: "D", home: "Austrália", away: "Turquia", date: "2026-06-14T18:00:00-03:00" },
    { group: "D", home: "Estados Unidos", away: "Austrália", date: "2026-06-19T18:00:00-03:00" },
    { group: "D", home: "Turquia", away: "Paraguai", date: "2026-06-20T00:00:00-03:00" },
    { group: "D", home: "Turquia", away: "Estados Unidos", date: "2026-06-25T00:00:00-03:00" },
    { group: "D", home: "Paraguai", away: "Austrália", date: "2026-06-26T00:00:00-03:00" },

    // GRUPO E: Alemanha, Costa do Marfim, Equador, Curaçao
    { group: "E", home: "Alemanha", away: "Curaçao", date: "2026-06-14T18:00:00-03:00" },
    { group: "E", home: "Costa do Marfim", away: "Equador", date: "2026-06-14T21:00:00-03:00" },
    { group: "E", home: "Alemanha", away: "Costa do Marfim", date: "2026-06-20T18:00:00-03:00" },
    { group: "E", home: "Equador", away: "Curaçao", date: "2026-06-21T00:00:00-03:00" },
    { group: "E", home: "Curaçao", away: "Costa do Marfim", date: "2026-06-25T18:00:00-03:00" },
    { group: "E", home: "Equador", away: "Alemanha", date: "2026-06-25T18:00:00-03:00" },

    // GRUPO F: Suécia, Japão, Holanda, Tunísia
    { group: "F", home: "Holanda", away: "Japão", date: "2026-06-14T18:00:00-03:00" },
    { group: "F", home: "Suécia", away: "Tunísia", date: "2026-06-15T00:00:00-03:00" },
    { group: "F", home: "Tunísia", away: "Japão", date: "2026-06-21T15:00:00-03:00" },
    { group: "F", home: "Holanda", away: "Suécia", date: "2026-06-21T18:00:00-03:00" },
    { group: "F", home: "Japão", away: "Suécia", date: "2026-06-25T21:00:00-03:00" },
    { group: "F", home: "Tunísia", away: "Holanda", date: "2026-06-25T21:00:00-03:00" },

    // GRUPO G: Nova Zelândia, Irã, Bélgica, Egito
    { group: "G", home: "Bélgica", away: "Egito", date: "2026-06-15T18:00:00-03:00" },
    { group: "G", home: "Irã", away: "Nova Zelândia", date: "2026-06-16T00:00:00-03:00" },
    { group: "G", home: "Bélgica", away: "Irã", date: "2026-06-21T18:00:00-03:00" },
    { group: "G", home: "Nova Zelândia", away: "Egito", date: "2026-06-22T00:00:00-03:00" },
    { group: "G", home: "Egito", away: "Irã", date: "2026-06-26T00:00:00-03:00" },
    { group: "G", home: "Nova Zelândia", away: "Bélgica", date: "2026-06-27T00:00:00-03:00" },

    // GRUPO H: Uruguai, Arábia Saudita, Espanha, Cabo Verde
    { group: "H", home: "Espanha", away: "Cabo Verde", date: "2026-06-15T18:00:00-03:00" },
    { group: "H", home: "Arábia Saudita", away: "Uruguai", date: "2026-06-15T21:00:00-03:00" },
    { group: "H", home: "Espanha", away: "Arábia Saudita", date: "2026-06-21T18:00:00-03:00" },
    { group: "H", home: "Uruguai", away: "Cabo Verde", date: "2026-06-21T21:00:00-03:00" },
    { group: "H", home: "Cabo Verde", away: "Arábia Saudita", date: "2026-06-26T21:00:00-03:00" },
    { group: "H", home: "Uruguai", away: "Espanha", date: "2026-06-26T21:00:00-03:00" },

    // GRUPO I: Noruega, França, Senegal, Iraque
    { group: "I", home: "França", away: "Senegal", date: "2026-06-16T18:00:00-03:00" },
    { group: "I", home: "Iraque", away: "Noruega", date: "2026-06-17T00:00:00-03:00" },
    { group: "I", home: "França", away: "Iraque", date: "2026-06-22T18:00:00-03:00" },
    { group: "I", home: "Noruega", away: "Senegal", date: "2026-06-22T21:00:00-03:00" },
    { group: "I", home: "Noruega", away: "França", date: "2026-06-26T18:00:00-03:00" },
    { group: "I", home: "Senegal", away: "Iraque", date: "2026-06-26T18:00:00-03:00" },

    // GRUPO J: Argentina, Áustria, Jordânia, Argélia
    { group: "J", home: "Argentina", away: "Argélia", date: "2026-06-16T21:00:00-03:00" },
    { group: "J", home: "Áustria", away: "Jordânia", date: "2026-06-17T18:00:00-03:00" },
    { group: "J", home: "Argentina", away: "Áustria", date: "2026-06-22T18:00:00-03:00" },
    { group: "J", home: "Jordânia", away: "Argélia", date: "2026-06-23T00:00:00-03:00" },
    { group: "J", home: "Argélia", away: "Áustria", date: "2026-06-27T00:00:00-03:00" },
    { group: "J", home: "Jordânia", away: "Argentina", date: "2026-06-27T00:00:00-03:00" },

    // GRUPO K: Colômbia, RD Congo, Portugal, Uzbequistão
    { group: "K", home: "Portugal", away: "RD Congo", date: "2026-06-17T18:00:00-03:00" },
    { group: "K", home: "Uzbequistão", away: "Colômbia", date: "2026-06-18T00:00:00-03:00" },
    { group: "K", home: "Portugal", away: "Uzbequistão", date: "2026-06-23T18:00:00-03:00" },
    { group: "K", home: "Colômbia", away: "RD Congo", date: "2026-06-23T21:00:00-03:00" },
    { group: "K", home: "Colômbia", away: "Portugal", date: "2026-06-27T21:00:00-03:00" },
    { group: "K", home: "RD Congo", away: "Uzbequistão", date: "2026-06-27T21:00:00-03:00" },

    // GRUPO L: Inglaterra, Gana, Panamá, Croácia
    { group: "L", home: "Inglaterra", away: "Croácia", date: "2026-06-17T18:00:00-03:00" },
    { group: "L", home: "Gana", away: "Panamá", date: "2026-06-17T21:00:00-03:00" },
    { group: "L", home: "Inglaterra", away: "Gana", date: "2026-06-23T18:00:00-03:00" },
    { group: "L", home: "Panamá", away: "Croácia", date: "2026-06-23T21:00:00-03:00" },
    { group: "L", home: "Panamá", away: "Inglaterra", date: "2026-06-27T18:00:00-03:00" },
    { group: "L", home: "Croácia", away: "Gana", date: "2026-06-27T18:00:00-03:00" },
  ];

  const stages: Record<string, string> = {
    A: "GRUPO A", B: "GRUPO B", C: "GRUPO C", D: "GRUPO D",
    E: "GRUPO E", F: "GRUPO F", G: "GRUPO G", H: "GRUPO H",
    I: "GRUPO I", J: "GRUPO J", K: "GRUPO K", L: "GRUPO L",
  };

  for (const m of OFFICIAL_MATCHES) {
    await prisma.match.create({
      data: {
        homeTeam: m.home,
        awayTeam: m.away,
        matchDate: new Date(m.date),
        stage: stages[m.group],
        groupName: `Grupo ${m.group}`,
      },
    });
  }

  console.log("✅ 72 jogos da fase de grupos cadastrados!");

  const r32 = [
    ["2º A", "2º B", "2026-06-28T16:00:00-03:00"],
    ["1º E", "3º Melhor", "2026-06-29T17:30:00-03:00"],
    ["1º C", "2º F", "2026-06-29T14:00:00-03:00"],
    ["1º F", "2º C", "2026-06-29T22:00:00-03:00"],
    ["1º I", "3º Melhor", "2026-06-30T18:00:00-03:00"],
    ["2º E", "2º I", "2026-06-30T14:00:00-03:00"],
    ["1º A", "3º Melhor", "2026-06-30T22:00:00-03:00"],
    ["1º L", "3º Melhor", "2026-07-01T13:00:00-03:00"],
    ["1º D", "3º Melhor", "2026-07-01T21:00:00-03:00"],
    ["1º G", "3º Melhor", "2026-07-01T17:00:00-03:00"],
    ["2º K", "2º L", "2026-07-02T20:00:00-03:00"],
    ["1º H", "2º J", "2026-07-02T16:00:00-03:00"],
    ["1º B", "3º Melhor", "2026-07-03T00:00:00-03:00"],
    ["1º J", "2º H", "2026-07-03T19:00:00-03:00"],
    ["1º K", "3º Melhor", "2026-07-03T22:30:00-03:00"],
    ["2º D", "2º G", "2026-07-03T15:00:00-03:00"],
  ];

  for (const [h, a, d] of r32) {
    await prisma.match.create({ data: { homeTeam: h, awayTeam: a, matchDate: new Date(d), stage: "OITAVAS" } });
  }

  const r16 = [
    ["Vencedor 80", "Vencedor 79", "2026-07-04T17:00:00-03:00"],
    ["Vencedor 74", "Vencedor 77", "2026-07-04T18:00:00-03:00"],
    ["Vencedor 73", "Vencedor 75", "2026-07-05T14:00:00-03:00"],
    ["Vencedor 76", "Vencedor 78", "2026-07-05T21:00:00-03:00"],
    ["Vencedor 83", "Vencedor 84", "2026-07-06T16:00:00-03:00"],
    ["Vencedor 81", "Vencedor 82", "2026-07-06T21:00:00-03:00"],
    ["Vencedor 86", "Vencedor 88", "2026-07-07T13:00:00-03:00"],
    ["Vencedor 85", "Vencedor 87", "2026-07-07T17:00:00-03:00"],
  ];

  for (const [h, a, d] of r16) {
    await prisma.match.create({ data: { homeTeam: h, awayTeam: a, matchDate: new Date(d), stage: "OITAVAS FINAL" } });
  }

  const qf = [
    ["Vencedor 89", "Vencedor 90", "2026-07-09T17:00:00-03:00"],
    ["Vencedor 93", "Vencedor 94", "2026-07-10T16:00:00-03:00"],
    ["Vencedor 91", "Vencedor 92", "2026-07-11T18:00:00-03:00"],
    ["Vencedor 95", "Vencedor 96", "2026-07-11T22:00:00-03:00"],
  ];

  for (const [h, a, d] of qf) {
    await prisma.match.create({ data: { homeTeam: h, awayTeam: a, matchDate: new Date(d), stage: "QUARTAS" } });
  }

  const semis = [
    ["Vencedor 97", "Vencedor 98", "2026-07-14T16:00:00-03:00"],
    ["Vencedor 99", "Vencedor 100", "2026-07-15T16:00:00-03:00"],
  ];

  for (const [h, a, d] of semis) {
    await prisma.match.create({ data: { homeTeam: h, awayTeam: a, matchDate: new Date(d), stage: "SEMIFINAL" } });
  }

  await prisma.match.create({ data: { homeTeam: "Perdedor 101", awayTeam: "Perdedor 102", matchDate: new Date("2026-07-18T18:00:00-03:00"), stage: "3º LUGAR" } });
  await prisma.match.create({ data: { homeTeam: "Vencedor 101", awayTeam: "Vencedor 102", matchDate: new Date("2026-07-19T16:00:00-03:00"), stage: "FINAL" } });

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
