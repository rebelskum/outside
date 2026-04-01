import { useState, useRef, useEffect } from "react";
import type { TravelerGroup } from "../../types/trip";

interface GuestPickerProps {
  travelers: TravelerGroup;
  onChange: (travelers: TravelerGroup) => void;
}

export function GuestPicker({ travelers, onChange }: GuestPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const total = travelers.adults + travelers.children;
  const label =
    travelers.children > 0
      ? `${travelers.adults} adult${travelers.adults !== 1 ? "s" : ""}, ${travelers.children} kid${travelers.children !== 1 ? "s" : ""}`
      : `${total} guest${total !== 1 ? "s" : ""}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm hover:border-brand/30 hover:shadow-sm transition-all cursor-pointer"
      >
        <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        {label}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-20 w-56 rounded-xl border border-border bg-white p-4 shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Adults</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onChange({ ...travelers, adults: Math.max(1, travelers.adults - 1) })
                  }
                  disabled={travelers.adults <= 1}
                  className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors disabled:opacity-30 disabled:hover:border-border"
                >
                  −
                </button>
                <span className="w-4 text-center text-sm font-medium">{travelers.adults}</span>
                <button
                  onClick={() =>
                    onChange({ ...travelers, adults: travelers.adults + 1 })
                  }
                  className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Kids</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onChange({ ...travelers, children: Math.max(0, travelers.children - 1) })
                  }
                  disabled={travelers.children <= 0}
                  className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors disabled:opacity-30 disabled:hover:border-border"
                >
                  −
                </button>
                <span className="w-4 text-center text-sm font-medium">{travelers.children}</span>
                <button
                  onClick={() =>
                    onChange({ ...travelers, children: travelers.children + 1 })
                  }
                  className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="mt-4 w-full rounded-lg bg-accent text-brand py-2 text-sm font-medium hover:bg-brand hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
