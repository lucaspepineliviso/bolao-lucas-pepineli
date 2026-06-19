import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const groupStageEnd = new Date("2026-06-28T00:00:00-03:00");
    if (new Date() > groupStageEnd) {
      return NextResponse.json({ error: "Período de cadastro encerrado. Novos cadastros só são permitidos durante a fase de grupos." }, { status: 403 });
    }

    const { name, email, password, referrerId } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Senha deve ter no mínimo 6 caracteres" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    let referrer = null;
    if (referrerId) {
      referrer = await prisma.user.findUnique({ where: { id: parseInt(referrerId) } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referrerId: referrer ? referrer.id : null,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
