import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type OrderStatus = "Pending" | "Paid" | "Cancelled";

export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Paid", "Cancelled"],
  Paid: [],
  Cancelled: [],
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  Paid: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  Cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export const PAGE_SIZE = 10;
