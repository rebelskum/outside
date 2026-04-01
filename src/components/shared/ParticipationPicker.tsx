import { useState } from "react";
import type { Participation, TravelerGroup } from "../../types/trip";
import { Stepper } from "./Stepper";

interface ParticipationPickerProps {
  participation: Participation;
  travelers: TravelerGroup;
  onChange: (participation: Participation) => void;
  trigger?: (props: { label: string; onClick: (e: React.MouseEvent) => void }) => React.ReactNode;
  /** When true, only kids can participate — adults stepper is hidden and forced to 0. */
  kidsOnly?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ParticipationPicker({
  participation,
  travelers,
  onChange,
  trigger,
  kidsOnly = false,
  onOpenChange,
}: ParticipationPickerProps) {
  const [open, setOpenRaw] = useState(false);
  const setOpen = (v: boolean) => {
    setOpenRaw(v);
    onOpenChange?.(v);
  };
  const isCustom = participation.type === "partial";

  const label = kidsOnly
    ? `${participation.kids} kid${participation.kids !== 1 ? "s" : ""}`
    : isCustom
      ? [
          participation.adults > 0 && `${participation.adults} adult${participation.adults !== 1 ? "s" : ""}`,
          participation.kids > 0 && `${participation.kids} kid${participation.kids !== 1 ? "s" : ""}`,
        ]
          .filter(Boolean)
          .join(", ")
      : "Everyone";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div className="relative">
      {trigger ? (
        trigger({ label, onClick: handleToggle })
      ) : (
        <button
          onClick={handleToggle}
          className="text-xs text-muted hover:text-brand transition-colors"
        >
          Who's going? <span className="font-medium text-brand">{label}</span>
        </button>
      )}

      {open && (
        <div
          className="absolute left-0 top-6 z-10 w-56 rounded-xl border border-border bg-white p-3 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {kidsOnly ? (
            <div className="space-y-2">
              <Stepper
                label="Kids"
                value={participation.kids}
                onChange={(v) => onChange({ ...participation, adults: 0, kids: v })}
                min={1}
                max={travelers.children}
              />
              <button
                onClick={() => setOpen(false)}
                className="mt-1 w-full rounded-lg bg-accent text-brand py-1.5 text-xs font-medium hover:bg-brand hover:text-white transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
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
                  <Stepper
                    label="Adults"
                    value={participation.adults}
                    onChange={(v) => onChange({ ...participation, adults: v })}
                    min={0}
                  />
                  <Stepper
                    label="Kids"
                    value={participation.kids}
                    onChange={(v) => onChange({ ...participation, kids: v })}
                    min={0}
                  />

                  <button
                    onClick={() => setOpen(false)}
                    className="mt-1 w-full rounded-lg bg-accent text-brand py-1.5 text-xs font-medium hover:bg-brand hover:text-white transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
