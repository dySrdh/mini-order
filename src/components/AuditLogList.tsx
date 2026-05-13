"use client";

import { useEffect, useState } from "react";
import { ArrowRight, History } from "lucide-react";
import { Card, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

interface AuditLog {
  id: string;
  orderId: string;
  fromStatus: string;
  toStatus: string;
  createdAt: string;
  order: { customerName: string };
}

export function AuditLogList({ refreshKey }: { refreshKey: number }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/audit-logs")
      .then((r) => r.json())
      .then((data) => { setLogs(data); setLoading(false); });
  }, [refreshKey]);

  return (
    <Card className="fade-up fade-up-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-violet-400/10">
          <History size={16} className="text-violet-400" />
        </div>
        <h2 className="font-semibold text-sm">Audit Log</h2>
        <span className="ml-auto text-xs text-[var(--muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-full">
          Last 50
        </span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-xs text-[var(--muted)] text-center py-6">Loading…</p>
        ) : logs.length === 0 ? (
          <p className="text-xs text-[var(--muted)] text-center py-6">No status changes yet</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{log.order.customerName}</p>
                <p className="text-xs text-[var(--muted)] font-mono">
                  #{log.orderId.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <StatusBadge status={log.fromStatus} />
                <ArrowRight size={12} className="text-[var(--muted)]" />
                <StatusBadge status={log.toStatus} />
              </div>
              <p className="text-xs text-[var(--muted)] shrink-0 hidden lg:block">
                {formatDate(log.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
