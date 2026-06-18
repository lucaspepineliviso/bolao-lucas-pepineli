import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalPremium = await prisma.payment.count({ where: { status: "paid" } });
    const grossTotal = totalPremium * 50;
    const prize = grossTotal * 0.8;

    return NextResponse.json({ totalPremium, grossTotal, prize });
  } catch {
    return NextResponse.json({ totalPremium: 0, grossTotal: 0, prize: 0 });
  }
}
