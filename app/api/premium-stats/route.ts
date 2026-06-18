import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const paidPayments = await prisma.payment.findMany({
      where: { status: "paid" },
      select: { amount: true },
    });
    const totalPremium = paidPayments.length;
    const grossTotal = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const prize = grossTotal * 0.8;

    return NextResponse.json({ totalPremium, grossTotal, prize });
  } catch {
    return NextResponse.json({ totalPremium: 0, grossTotal: 0, prize: 0 });
  }
}
