import type { Participation, TravelerGroup } from "../types/trip";

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + "s"}`;
}

export function formatParticipation(p: Participation, travelers: TravelerGroup): string {
  if (p.type === "everyone") {
    const parts: string[] = [];
    if (travelers.adults > 0) parts.push(pluralize(travelers.adults, "adult"));
    if (travelers.children > 0) parts.push(pluralize(travelers.children, "kid"));
    return parts.join(", ");
  }
  const parts: string[] = [];
  if (p.adults > 0) parts.push(pluralize(p.adults, "adult"));
  if (p.kids > 0) parts.push(pluralize(p.kids, "kid"));
  return parts.join(", ");
}

export function participantCount(p: Participation, travelers: TravelerGroup): number {
  if (p.type === "everyone") return travelers.adults + travelers.children;
  return p.adults + p.kids;
}
