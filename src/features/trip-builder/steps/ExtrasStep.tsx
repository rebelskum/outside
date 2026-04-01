import { addOns } from "../../../data/mock/addons";

interface ExtrasStepProps {
  selectedAddOnIds: string[];
  onToggleAddOn: (addOnId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ExtrasStep({
  selectedAddOnIds,
  onToggleAddOn,
  onBack,
  onNext,
}: ExtrasStepProps) {
  return (
    <div className="py-10 px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        A few thoughtful extras
      </h1>
      <p className="mt-1 text-muted">
        Optional additions that fit your trip
      </p>

      <div className="mt-8 space-y-3">
        {addOns.map((addon) => {
          const selected = selectedAddOnIds.includes(addon.id);
          return (
            <button
              key={addon.id}
              onClick={() => onToggleAddOn(addon.id)}
              className={`w-full rounded-xl border p-5 text-left transition-all ${
                selected
                  ? "border-brand bg-brand/[0.03]"
                  : "border-border bg-white hover:border-brand/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{addon.name}</p>
                  <p className="text-sm text-muted mt-1">{addon.shortDescription}</p>
                </div>
                <div className="flex items-center gap-3">
                  {addon.price > 0 && (
                    <span className="text-sm text-muted">${addon.price}</span>
                  )}
                  <span className={`text-sm ${selected ? "text-brand" : "text-muted"}`}>
                    {selected ? "✓" : "+"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-brand/20 bg-brand/[0.02] p-5">
        <p className="text-sm text-muted">
          Contextual nudge placeholder — suggestions based on your trip will appear here
        </p>
      </div>

      <div className="mt-10 flex justify-between">
        <button
          onClick={onBack}
          className="text-sm text-muted hover:text-brand transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="rounded-lg bg-brand text-white px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
