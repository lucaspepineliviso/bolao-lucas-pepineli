import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST() {
  try {
    const user = await requireAuth();

    const alreadyPaid = await prisma.payment.findFirst({
      where: { userId: user.id, status: "paid" },
    });
    if (alreadyPaid) {
      return NextResponse.json({ error: "Você já é premium" }, { status: 400 });
    }

    const existing = await prisma.payment.findFirst({
      where: { userId: user.id, status: "pending" },
    });
    if (existing) {
      return NextResponse.json({ payment: existing, message: "Pagamento já solicitado" });
    }

    const payment = await prisma.payment.create({
      data: { userId: user.id, amount: 50, status: "pending" },
    });

    return NextResponse.json({ payment, message: "Solicitação criada. Envie o Pix para o organizador." });
  } catch (error) {
    if (error instanceof Error && error.message === "Não autorizado") {
      return NextResponse.json({ error: "Faça login primeiro" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await requireAuth();
    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    const isPremium = payments.some((p) => p.status === "paid");
    return NextResponse.json({ payments, isPremium });
  } catch {
    return NextResponse.json({ payments: [], isPremium: false }, { status: 401 });
  }
}
