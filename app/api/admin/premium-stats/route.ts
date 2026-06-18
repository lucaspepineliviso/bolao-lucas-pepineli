import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const paidPayments = await prisma.payment.findMany({
      where: { status: "paid" },
      select: { amount: true },
    });
    const totalPremium = paidPayments.length;
    const totalPending = await prisma.payment.count({ where: { status: "pending" } });
    const grossTotal = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const fee = grossTotal * 0.2;
    const prize = grossTotal - fee;

    const topUser = await prisma.user.findFirst({
      where: { isPremium: true, role: "USER" },
      orderBy: { points: "desc" },
      select: { name: true, points: true },
    });

    return NextResponse.json({
      totalPremium,
      totalPending,
      grossTotal,
      fee,
      prize,
      potentialWinner: topUser,
    });
  } catch (error) {
    if (error instanceof Error && (error.message === "Não autorizado" || error.message === "Acesso restrito a administradores")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
