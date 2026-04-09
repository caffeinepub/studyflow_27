import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Subject } from "../types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a nanosecond bigint timestamp to a human-readable deadline string */
export function formatDeadline(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  const date = new Date(ms);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `Overdue ${Math.abs(diffDays)}d ago`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays <= 7) return `Due in ${diffDays}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function deadlineUrgency(
  timestamp: bigint,
): "overdue" | "urgent" | "soon" | "normal" {
  const ms = Number(timestamp / 1_000_000n);
  const diffMs = ms - Date.now();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "overdue";
  if (diffDays <= 1) return "urgent";
  if (diffDays <= 3) return "soon";
  return "normal";
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function getDayName(day: number): string {
  return DAY_NAMES[day] ?? "Unknown";
}

export function getDayShort(day: number): string {
  return DAY_NAMES[day]?.slice(0, 3) ?? "???";
}

export function subjectColorToIndex(color: string): 1 | 2 | 3 | 4 | 5 {
  const map: Record<string, 1 | 2 | 3 | 4 | 5> = {
    "chart-1": 1,
    "chart-2": 2,
    "chart-3": 3,
    "chart-4": 4,
    "chart-5": 5,
    blue: 1,
    green: 2,
    amber: 3,
    purple: 4,
    red: 5,
  };
  return map[color] ?? 1;
}

export function getSubjectColorClass(subject: Subject): string {
  const colorIndex = subjectColorToIndex(subject.color);
  return `chart-${colorIndex}`;
}

export const COLOR_OPTIONS = [
  {
    value: "chart-1",
    label: "Blue",
    bg: "bg-chart-1/20",
    ring: "ring-chart-1",
  },
  {
    value: "chart-2",
    label: "Green",
    bg: "bg-chart-2/20",
    ring: "ring-chart-2",
  },
  {
    value: "chart-3",
    label: "Amber",
    bg: "bg-chart-3/20",
    ring: "ring-chart-3",
  },
  {
    value: "chart-4",
    label: "Purple",
    bg: "bg-chart-4/20",
    ring: "ring-chart-4",
  },
  { value: "chart-5", label: "Red", bg: "bg-chart-5/20", ring: "ring-chart-5" },
];

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function dateToNanoTimestamp(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

export function nanoTimestampToDate(ts: bigint): Date {
  return new Date(Number(ts / 1_000_000n));
}
