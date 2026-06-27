import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      include: {
        bets: {
          select: { points: true },
        },
      },
    });

    const ranking = users.map((user) => {
      const exactHits = user.bets.filter((b) => b.points === 10).length;
      const fivePtBets = user.bets.filter((b) => b.points === 5).length;
      const missingBets = 104 - user.bets.length;

      return {
        id: user.id,
        name: user.name,
        points: user.points,
        betCount: user.bets.length,
        exactHits,
        fivePtBets,
        missingBets,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      };
    });

    ranking.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
      if (b.fivePtBets !== a.fivePtBets) return b.fivePtBets - a.fivePtBets;
      if (a.missingBets !== b.missingBets) return a.missingBets - b.missingBets;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return NextResponse.json(ranking);
  } catch (error) {
    console.error("Ranking error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
