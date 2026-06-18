import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const { matchId, homeScore, awayScore } = await request.json();

    if (!matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    if (match.isFinished) {
      return NextResponse.json({ error: "Jogo já encerrado" }, { status: 400 });
    }

    const matchDate = new Date(match.matchDate);
    if (matchDate < new Date()) {
      return NextResponse.json({ error: "Jogo já começou" }, { status: 400 });
    }

    const existing = await prisma.bet.findUnique({
      where: { userId_matchId: { userId: user.id, matchId } },
    });

    if (existing) {
      await prisma.bet.update({
        where: { id: existing.id },
        data: { homeScore, awayScore },
      });
    } else {
      await prisma.bet.create({
        data: { userId: user.id, matchId, homeScore, awayScore },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Não autorizado") {
      return NextResponse.json({ error: "Faça login para palpitar" }, { status: 401 });
    }
    console.error("Bet error:", error);
    return NextResponse.json({ error: "Erro ao salvar palpite" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await requireAuth();

    const bets = await prisma.bet.findMany({
      where: { userId: user.id },
      include: { match: true },
      orderBy: { match: { matchDate: "asc" } },
    });

    return NextResponse.json(bets);
  } catch {
    return NextResponse.json([], { status: 401 });
  }
}
