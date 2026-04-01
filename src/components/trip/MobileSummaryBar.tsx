interface MobileSummaryBarProps {
  total: number;
  onViewTrip: () => void;
}

export function MobileSummaryBar({ total, onViewTrip }: MobileSummaryBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-border bg-white px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-lg font-semibold">${total} total</p>
      </div>
      <button
        onClick={onViewTrip}
        className="rounded-lg bg-brand text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
      >
        View trip
      </button>
    </div>
  );
}
