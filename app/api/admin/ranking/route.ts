import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      include: {
        bets: {
          where: { points: { not: null } },
          select: { points: true },
        },
      },
      orderBy: { points: "desc" },
    });

    const ranking = users.map((user) => ({
      id: user.id,
      name: user.name,
      points: user.points,
      betCount: user.bets.length,
      exactHits: user.bets.filter((b) => b.points === 10).length,
      isPremium: user.isPremium,
    }));

    return NextResponse.json(ranking);
  } catch (error) {
    console.error("Ranking error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
