"use client";

import { cn, type OrderStatus, STATUS_COLORS } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";
import { X } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        STATUS_COLORS[status as OrderStatus] ?? "bg-slate-800 text-slate-400 border-slate-700"
      )}
    >
      {status}
    </span>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-[var(--surface)] border-[var(--border)] p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "danger";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "default" && "bg-indigo-600 hover:bg-indigo-500 text-white",
        variant === "ghost" && "bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)]",
        variant === "danger" && "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-indigo-500 transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export function Select({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-indigo-500 transition-colors cursor-pointer",
        className
      )}
    >
      {children}
    </select>
  );
}

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

export const toast = {
  show(message: string, type: ToastType = "success") {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, message, type }];
    listeners.forEach((l) => l(toasts));
    setTimeout(() => toast.dismiss(id), 4000);
  },
  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  },
};

export function ToastContainer() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast[]) => setItems([...t]);
    listeners.push(listener);
    return () => { listeners = listeners.filter((l) => l !== listener); };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-sm fade-up",
            t.type === "success"
              ? "bg-emerald-950/90 border-emerald-700/50 text-emerald-300"
              : "bg-red-950/90 border-red-700/50 text-red-300"
          )}
        >
          <span>{t.message}</span>
          <button onClick={() => toast.dismiss(t.id)} className="opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
