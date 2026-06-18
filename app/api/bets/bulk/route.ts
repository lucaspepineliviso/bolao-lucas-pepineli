import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    if (user.isPremium) {
      const paid = await prisma.payment.findFirst({
        where: { userId: user.id, status: "paid" },
      });
      if (!paid) {
        return NextResponse.json({ error: "Confirme seu pagamento Premium antes de palpitar." }, { status: 403 });
      }
    }

    const groupStageEnd = new Date("2026-06-28T00:00:00-03:00");
    if (new Date() > groupStageEnd) {
      return NextResponse.json({ error: "Prazo encerrado. Não é mais possível palpitar." }, { status: 403 });
    }

    const existingBets = await prisma.bet.count({ where: { userId: user.id } });
    if (existingBets > 0) {
      return NextResponse.json({ error: "Você já salvou seus palpites. Não é possível alterar." }, { status: 403 });
    }

    const { bets } = await request.json();
    if (!bets || !Array.isArray(bets) || bets.length === 0) {
      return NextResponse.json({ error: "Envie pelo menos um palpite" }, { status: 400 });
    }

    const now = new Date();
    const results = { saved: 0, errors: 0, messages: [] as string[] };

    for (const bet of bets) {
      const { matchId, homeScore, awayScore } = bet;
      if (!matchId || homeScore === undefined || awayScore === undefined) {
        results.errors++;
        continue;
      }

      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) {
        results.messages.push(`Jogo ${matchId} não encontrado`);
        results.errors++;
        continue;
      }

      if (match.isFinished) {
        results.messages.push(`"${match.homeTeam} vs ${match.awayTeam}" já encerrou`);
        results.errors++;
        continue;
      }

      if (new Date(match.matchDate) < now) {
        results.messages.push(`"${match.homeTeam} vs ${match.awayTeam}" já começou`);
        results.errors++;
        continue;
      }

      await prisma.bet.create({
        data: { userId: user.id, matchId, homeScore, awayScore },
      });
      results.saved++;
    }

    return NextResponse.json(results);
  } catch (error) {
    if (error instanceof Error && error.message === "Não autorizado") {
      return NextResponse.json({ error: "Faça login para palpitar" }, { status: 401 });
    }
    console.error("Bulk bet error:", error);
    return NextResponse.json({ error: "Erro ao salvar palpites" }, { status: 500 });
  }
}
