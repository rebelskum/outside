import { useState } from "react";
import type { Participation, TravelerGroup } from "../../types/trip";

interface ParticipationPickerProps {
  participation: Participation;
  travelers: TravelerGroup;
  onChange: (participation: Participation) => void;
}

export function ParticipationPicker({
  participation,
  travelers,
  onChange,
}: ParticipationPickerProps) {
  const [open, setOpen] = useState(false);
  const isCustom = participation.type === "partial";

  const label = isCustom
    ? [
        participation.adults > 0 && `${participation.adults} adult${participation.adults !== 1 ? "s" : ""}`,
        participation.kids > 0 && `${participation.kids} kid${participation.kids !== 1 ? "s" : ""}`,
      ]
        .filter(Boolean)
        .join(", ")
    : "Everyone";

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="text-xs text-muted hover:text-brand transition-colors"
      >
        Who's going? <span className="font-medium text-brand">{label}</span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-6 z-10 w-56 rounded-xl border border-border bg-white p-3 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1">
            <button
              onClick={() => {
                onChange({ type: "everyone", adults: travelers.adults, kids: travelers.children });
                setOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !isCustom
                  ? "bg-brand/[0.05] font-medium text-brand"
                  : "hover:bg-surface text-muted"
              }`}
            >
              Everyone
            </button>
            <button
              onClick={() => {
                if (!isCustom) {
                  onChange({ type: "partial", adults: travelers.adults, kids: travelers.children });
                }
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isCustom
                  ? "bg-brand/[0.05] font-medium text-brand"
                  : "hover:bg-surface text-muted"
              }`}
            >
              Custom
            </button>
          </div>

          {isCustom && (
            <div className="mt-3 space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Adults</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onChange({ ...participation, adults: Math.max(0, participation.adults - 1) })
                    }
                    className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm font-medium">{participation.adults}</span>
                  <button
                    onClick={() =>
                      onChange({ ...participation, adults: participation.adults + 1 })
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
                      onChange({ ...participation, kids: Math.max(0, participation.kids - 1) })
                    }
                    className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm font-medium">{participation.kids}</span>
                  <button
                    onClick={() =>
                      onChange({ ...participation, kids: participation.kids + 1 })
                    }
                    className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-1 w-full rounded-lg bg-brand text-white py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
