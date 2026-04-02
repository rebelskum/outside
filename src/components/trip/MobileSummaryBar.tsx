import { formatCurrency } from "../../utils/format";

interface MobileSummaryBarProps {
  total: number;
  onViewTrip: () => void;
  disabled?: boolean;
}

export function MobileSummaryBar({ total, onViewTrip, disabled }: MobileSummaryBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-white px-6 py-4 flex items-center justify-between">
      <p className="text-lg font-semibold">{formatCurrency(total)} total</p>
      <button
        onClick={onViewTrip}
        disabled={disabled}
        className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-accent text-brand hover:bg-brand hover:text-white"
        }`}
      >
        View trip
      </button>
    </div>
  );
}
