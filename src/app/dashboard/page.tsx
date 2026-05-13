"use client";

import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { SummaryCards } from "@/components/SummaryCards";
import { OrdersTable } from "@/components/OrdersTable";
import { AuditLogList } from "@/components/AuditLogList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToastContainer } from "@/components/ui";

export default function DashboardPage() {
  const [auditKey, setAuditKey] = useState(0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Ambient top glow */}
      <div
        className="fixed inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #6366f1 40%, #8b5cf6 60%, transparent)" }}
      />
      <div
        className="fixed inset-x-0 top-0 h-32 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 100%)" }}
      />

      {/* Sidebar + main layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 border-r border-[var(--border)] bg-[var(--surface)] px-4 py-6 shrink-0">
          <div className="flex items-center gap-2.5 mb-8 px-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm">OrderFlow</span>
          </div>
          <nav className="space-y-1">
            <button
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600/15 text-[var(--accent-text)] transition-colors"
            >
              Dashboard
            </button>
          </nav>
          <div className="mt-auto pt-6 border-t border-[var(--border)] space-y-3">
            <ThemeToggle />
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
              <div>
                <p className="text-xs font-medium">Admin</p>
                <p className="text-xs text-[var(--muted)]">admin@orderflow.io</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 fade-up">
            <h1 className="text-2xl font-semibold tracking-tight">Order Management</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Monitor and manage all customer orders
            </p>
          </div>

          {/* Summary cards */}
          <div className="mb-8">
            <SummaryCards key={auditKey} />
          </div>

          {/* Orders table */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
              Orders
            </h2>
            <OrdersTable onStatusChange={() => setAuditKey((k) => k + 1)} />
          </div>

          {/* Audit log */}
          <div>
            <h2 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
              Status History
            </h2>
            <AuditLogList refreshKey={auditKey} />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
