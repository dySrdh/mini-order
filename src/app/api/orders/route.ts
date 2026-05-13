import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PAGE_SIZE, STATUS_TRANSITIONS, type OrderStatus } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";

  const where = {
    ...(search && { customerName: { contains: search } }),
    ...(status && status !== "All" && { status }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, pages: Math.ceil(total / PAGE_SIZE) });
}

export async function PATCH(req: NextRequest) {
  const { id, toStatus } = (await req.json()) as { id: string; toStatus: OrderStatus };

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const allowed = STATUS_TRANSITIONS[order.status as OrderStatus];
  if (!allowed.includes(toStatus)) {
    return NextResponse.json(
      { error: `Cannot transition from ${order.status} to ${toStatus}` },
      { status: 422 }
    );
  }

  const [updated] = await prisma.$transaction([
    prisma.order.update({ where: { id }, data: { status: toStatus } }),
    prisma.auditLog.create({
      data: { orderId: id, fromStatus: order.status, toStatus },
    }),
  ]);

  return NextResponse.json(updated);
}
