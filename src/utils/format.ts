export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + "s"}`;
}
