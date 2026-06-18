import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();

    const matches = await prisma.match.findMany({
      orderBy: { matchDate: "asc" },
    });

    const data = [];
    for (const m of matches) {
      let userBet = null;
      if (user) {
        const bet = await prisma.bet.findUnique({
          where: { userId_matchId: { userId: user.id, matchId: m.id } },
          select: { homeScore: true, awayScore: true, points: true },
        });
        userBet = bet;
      }

      data.push({
        id: m.id,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        matchDate: m.matchDate.toISOString(),
        stage: m.stage,
        groupName: m.groupName,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        isFinished: m.isFinished,
        userBet,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Matches error:", error);
    return NextResponse.json({ error: "Erro ao carregar jogos" }, { status: 500 });
  }
}
