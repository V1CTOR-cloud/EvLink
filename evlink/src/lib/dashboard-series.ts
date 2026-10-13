import type { DashboardSeriesPoint } from "@/types";

type CompletedSessionRow = {
  started_at: string;
  energy_kwh: number;
  total_amount: number | null;
};

const toKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

export function buildDailySeries(
  sessions: CompletedSessionRow[],
  days = 7,
): DashboardSeriesPoint[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = new Map<string, DashboardSeriesPoint>();

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const key = toKey(day);
    buckets.set(key, { date: key, energy: 0, spent: 0, sessions: 0 });
  }

  for (const session of sessions) {
    const bucket = buckets.get(toKey(new Date(session.started_at)));
    if (!bucket) continue;

    bucket.energy += Number(session.energy_kwh);
    bucket.spent += Number(session.total_amount ?? 0);
    bucket.sessions += 1;
  }

  return [...buckets.values()];
}