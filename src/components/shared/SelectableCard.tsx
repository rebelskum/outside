import type { ReactNode } from "react";

interface SelectableCardProps {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
  trailing?: ReactNode;
  expanded?: ReactNode;
}

export function SelectableCard({ selected, onToggle, children, trailing, expanded }: SelectableCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        selected
          ? "border-brand bg-brand/[0.03]"
          : "border-border bg-white hover:border-brand/30 hover:shadow-sm"
      }`}
    >
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">{children}</div>
          {trailing}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50">
          {expanded}
        </div>
      )}
    </div>
  );
}
