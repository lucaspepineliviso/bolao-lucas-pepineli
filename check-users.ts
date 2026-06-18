import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, isPremium: true,
      createdAt: true, points: true,
    },
    orderBy: { createdAt: "asc" },
  });
  console.log("Total users:", users.length);
  for (const u of users) {
    console.log(`${u.id} | ${u.name} | ${u.email} | Role: ${u.role} | Premium: ${u.isPremium} | Points: ${u.points} | Created: ${u.createdAt.toISOString().slice(0,10)}`);
  }

  console.log("\n--- Payments ---");
  const payments = await prisma.payment.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
  console.log("Total payments:", payments.length);
  for (const p of payments) {
    console.log(`${p.id} | User: ${p.user.name} (${p.user.email}) | Amount: ${p.amount} | Status: ${p.status} | Method: ${p.paymentMethod} | Paid: ${p.paidAt}`);
  }
}

main().finally(() => prisma.$disconnect());
