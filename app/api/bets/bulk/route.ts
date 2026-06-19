import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    const { bets } = await request.json();
    if (!bets || !Array.isArray(bets) || bets.length === 0) {
      return NextResponse.json({ error: "Envie pelo menos um palpite" }, { status: 400 });
    }

    const matchIds = bets.map((b: { matchId: number }) => b.matchId).filter(Boolean);
    const matches = await prisma.match.findMany({
      where: { id: { in: matchIds } },
    });
    const matchMap = new Map(matches.map((m) => [m.id, m]));

    const now = new Date();
    const results: { matchId: number; status: string }[] = [];
    let saved = 0;
    let skipped = 0;
    let errors = 0;

    const validBets: { userId: number; matchId: number; homeScore: number; awayScore: number }[] = [];

    for (const bet of bets) {
      const { matchId, homeScore, awayScore } = bet;

      if (!matchId || homeScore === undefined || awayScore === undefined) {
        results.push({ matchId, status: "error" });
        errors++;
        continue;
      }

      const match = matchMap.get(matchId);
      if (!match) {
        results.push({ matchId, status: "error" });
        errors++;
        continue;
      }

      if (new Date(match.matchDate) < now) {
        results.push({ matchId, status: "skipped" });
        skipped++;
        continue;
      }

      validBets.push({
        userId: user.id,
        matchId,
        homeScore: parseInt(String(homeScore)) || 0,
        awayScore: parseInt(String(awayScore)) || 0,
      });
      results.push({ matchId, status: "saved" });
      saved++;
    }

    if (validBets.length > 0) {
      await prisma.$transaction(
        validBets.map((bet) =>
          prisma.bet.upsert({
            where: { userId_matchId: { userId: bet.userId, matchId: bet.matchId } },
            update: { homeScore: bet.homeScore, awayScore: bet.awayScore },
            create: { userId: bet.userId, matchId: bet.matchId, homeScore: bet.homeScore, awayScore: bet.awayScore },
          })
        )
      );
    }

    return NextResponse.json({ summary: { saved, skipped, errors }, results });
  } catch (error) {
    if (error instanceof Error && error.message === "Não autorizado") {
      return NextResponse.json({ error: "Faça login para palpitar" }, { status: 401 });
    }
    console.error("Bulk bet error:", error);
    return NextResponse.json({ error: "Erro ao salvar palpites" }, { status: 500 });
  }
}
