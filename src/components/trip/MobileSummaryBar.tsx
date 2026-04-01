import { formatCurrency } from "../../utils/format";

interface MobileSummaryBarProps {
  total: number;
  onViewTrip: () => void;
}

export function MobileSummaryBar({ total, onViewTrip }: MobileSummaryBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-white px-6 py-4 flex items-center justify-between">
      <p className="text-lg font-semibold">{formatCurrency(total)} total</p>
      <button
        onClick={onViewTrip}
        className="rounded-lg bg-accent text-brand px-6 py-3 text-sm font-medium hover:bg-brand hover:text-white transition-colors"
      >
        View trip
      </button>
    </div>
  );
}
