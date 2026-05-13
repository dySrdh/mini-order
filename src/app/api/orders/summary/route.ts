import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [total, paid, pending, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "Paid" } }),
    prisma.order.count({ where: { status: "Pending" } }),
    prisma.order.aggregate({
      where: { status: "Paid" },
      _sum: { totalPrice: true },
    }),
  ]);

  return NextResponse.json({
    total,
    paid,
    pending,
    cancelled: total - paid - pending,
    revenue: revenue._sum.totalPrice ?? 0,
  });
}
