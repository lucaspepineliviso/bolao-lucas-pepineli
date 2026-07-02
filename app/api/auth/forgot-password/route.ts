import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateResetToken } from "@/lib/auth";
import { sendResetPasswordEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "E-mail inválido ou não fornecido" }, { status: 400 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // Busca o usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (user) {
      // Gera token temporário (expira em 1 hora e assina com os últimos 10 caracteres do hash da senha atual)
      const token = generateResetToken(user.id, user.email, user.password);

      // Constrói a URL para redefinição
      const host = request.headers.get("host") || "localhost:3000";
      const protocol = request.headers.get("x-forwarded-proto") || "http";
      const resetUrl = `${protocol}://${host}/login/resetar?token=${token}`;

      // Envia o e-mail de recuperação
      await sendResetPasswordEmail(user.email, resetUrl);
    }

    // Retorna sempre a mesma mensagem por segurança (evita enumeração de contas)
    return NextResponse.json({
      message: "Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha em instantes.",
    });
  } catch (error) {
    console.error("Erro na solicitação de recuperação de senha:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
