"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, RefreshCw } from "lucide-react";
import { Button, Input, Select, StatusBadge, toast } from "@/components/ui";
import { formatCurrency, formatDate, STATUS_TRANSITIONS, type OrderStatus } from "@/lib/utils";

interface Order {
  id: string;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  pages: number;
}

export function OrdersTable({ onStatusChange }: { onStatusChange: () => void }) {
  const [data, setData] = useState<OrdersResponse>({ orders: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), search, status });
    const res = await fetch(`/api/orders?${params}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => { setPage(1); }, [search, status]);

  const handleStatusChange = async (id: string, toStatus: OrderStatus) => {
    setUpdating(id);
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, toStatus }),
    });
    const json = await res.json();

    if (!res.ok) {
      toast.show(json.error, "error");
    } else {
      toast.show(`Order marked as ${toStatus}`, "success");
      fetchOrders();
      onStatusChange();
    }
    setUpdating(null);
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden fade-up fade-up-2">
      {/* Toolbar */}
      <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            placeholder="Search customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={status} onChange={setStatus} className="w-full sm:w-36">
          {["All", "Pending", "Paid", "Cancelled"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Button variant="ghost" size="sm" onClick={fetchOrders} className="shrink-0">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["Order ID", "Customer", "Total", "Status", "Created", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[var(--muted)]">
                  <RefreshCw size={18} className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : data.orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[var(--muted)]">
                  No orders found
                </td>
              </tr>
            ) : (
              data.orders.map((order) => {
                const transitions = STATUS_TRANSITIONS[order.status as OrderStatus];
                return (
                  <tr key={order.id} className="hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-medium">{order.customerName}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)] text-xs">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {transitions.length === 0 ? (
                          <span className="text-xs text-[var(--muted)] italic">Final</span>
                        ) : (
                          transitions.map((t) => (
                            <Button
                              key={t}
                              size="sm"
                              variant={t === "Cancelled" ? "danger" : "default"}
                              disabled={updating === order.id}
                              onClick={() => handleStatusChange(order.id, t)}
                            >
                              {updating === order.id ? (
                                <RefreshCw size={10} className="animate-spin" />
                              ) : null}
                              {t}
                            </Button>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{data.total} total orders</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <span className="px-2">
            {page} / {data.pages || 1}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= data.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
