"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, DollarSign, Clock, XCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface Summary {
  total: number;
  paid: number;
  pending: number;
  cancelled: number;
  revenue: number;
}

export function SummaryCards() {
  const [data, setData] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/orders/summary")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: data?.total ?? "—",
      icon: ShoppingCart,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
      delay: "fade-up-1",
    },
    {
      label: "Paid Revenue",
      value: data ? formatCurrency(data.revenue) : "—",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      delay: "fade-up-2",
    },
    {
      label: "Pending Orders",
      value: data?.pending ?? "—",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      delay: "fade-up-3",
    },
    {
      label: "Cancelled Orders",
      value: data?.cancelled ?? "—",
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      delay: "fade-up-4",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className={`fade-up ${c.delay}`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${c.bg}`}>
              <c.icon size={18} className={c.color} />
            </div>
          </div>
          <p className="text-[var(--muted)] text-xs font-medium uppercase tracking-wider mb-1">
            {c.label}
          </p>
          <p className="text-2xl font-semibold text-[var(--text)]">{c.value}</p>
        </Card>
      ))}
    </div>
  );
}
