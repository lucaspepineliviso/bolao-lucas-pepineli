import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token e nova senha são obrigatórios" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter no mínimo 6 caracteres" }, { status: 400 });
    }

    // Valida o token JWT
    const payload = verifyResetToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Link de recuperação inválido ou expirado" }, { status: 400 });
    }

    // Busca o usuário no banco para validar o status
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.email !== payload.email) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 });
    }

    // Valida se o token já foi usado
    // Comparamos a assinatura do hash da senha armazenada no banco com a assinatura do token
    const currentPassSig = user.password.slice(-10);
    if (currentPassSig !== payload.passSig) {
      return NextResponse.json({ error: "Este link de recuperação já foi utilizado" }, { status: 400 });
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualiza a senha no banco de dados
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error("Erro ao redefinir a senha:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
