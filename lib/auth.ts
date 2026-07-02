import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "bolao-secret-key-mude-em-producao";

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface ResetJwtPayload {
  userId: number;
  email: string;
  passSig: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function generateResetToken(userId: number, email: string, passwordHash: string): string {
  const passSig = passwordHash.slice(-10);
  return jwt.sign({ userId, email, passSig }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyResetToken(token: string): ResetJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as ResetJwtPayload;
  } catch {
    return null;
  }
}


export async function getTokenFromRequest() {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

export async function getAuthUser() {
  const token = await getTokenFromRequest();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  return user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) throw new Error("Não autorizado");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") throw new Error("Acesso restrito a administradores");
  return user;
}
