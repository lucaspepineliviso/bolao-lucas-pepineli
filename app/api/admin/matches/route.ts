import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { calculatePoints } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();

    const matches = await prisma.match.findMany({
      orderBy: { matchDate: "asc" },
      include: {
        bets: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    if (error instanceof Error && (error.message === "Não autorizado" || error.message === "Acesso restrito a administradores")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Admin matches error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { homeTeam, awayTeam, matchDate, stage, groupName } = await request.json();

    if (!homeTeam || !awayTeam || !matchDate || !stage) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios" }, { status: 400 });
    }

    const match = await prisma.match.create({
      data: {
        homeTeam,
        awayTeam,
        matchDate: new Date(matchDate),
        stage,
        groupName: groupName || null,
      },
    });

    return NextResponse.json(match);
  } catch (error) {
    if (error instanceof Error && (error.message === "Não autorizado" || error.message === "Acesso restrito a administradores")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Create match error:", error);
    return NextResponse.json({ error: "Erro ao criar jogo" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const { matchId, homeScore, awayScore } = await request.json();

    if (!matchId || homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        homeScore,
        awayScore,
        isFinished: true,
      },
      include: { bets: true },
    });

    for (const bet of match.bets) {
      const points = calculatePoints(bet.homeScore, bet.awayScore, homeScore, awayScore);

      await prisma.bet.update({
        where: { id: bet.id },
        data: { points },
      });

      await prisma.user.update({
        where: { id: bet.userId },
        data: { points: { increment: points } },
      });
    }

    return NextResponse.json(match);
  } catch (error) {
    if (error instanceof Error && (error.message === "Não autorizado" || error.message === "Acesso restrito a administradores")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Update match error:", error);
    return NextResponse.json({ error: "Erro ao atualizar jogo" }, { status: 500 });
  }
}
