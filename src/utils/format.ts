import type { AddOn, DateRange, Participation, TravelerGroup } from "../types/trip";

export function getNights(dateRange: DateRange): number {
  const parse = (str: string) => {
    const m = str.match(/([A-Za-z]+)\s+(\d+)/);
    if (!m) return new Date();
    const year = new Date().getFullYear();
    return new Date(`${m[1]} ${m[2]}, ${year}`);
  };
  return Math.max(1, Math.round((parse(dateRange.end).getTime() - parse(dateRange.start).getTime()) / 864e5));
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + "s"}`;
}

export function formatParticipation(p: Participation, travelers: TravelerGroup): string {
  const adults = p.type === "everyone" ? travelers.adults : p.adults;
  const kids = p.type === "everyone" ? travelers.children : p.kids;
  return [
    adults > 0 && pluralize(adults, "adult"),
    kids > 0 && pluralize(kids, "kid"),
  ].filter(Boolean).join(", ");
}

export function participantCount(p: Participation, travelers: TravelerGroup): number {
  if (p.type === "everyone") return travelers.adults + travelers.children;
  return p.adults + p.kids;
}

export function formatAddOnPrice(addOn: AddOn, count?: number): string {
  if (addOn.price <= 0) return "Included";
  if (!addOn.perPerson) return formatCurrency(addOn.price);
  return count != null
    ? `${formatCurrency(addOn.price)}/person × ${count}`
    : `${formatCurrency(addOn.price)}/person`;
}
