import type { TripState, Participation } from "../../../types/trip";
import { addOns } from "../../../data/mock/addons";
import { destinations } from "../../../data/mock/destinations";
import { ParticipationPicker } from "../../../components/shared/ParticipationPicker";

const PARTICIPATION_CATEGORIES = new Set(["Dining", "Family", "Gear"]);

interface ExtrasStepProps {
  trip: TripState;
  selectedAddOnIds: string[];
  onToggleAddOn: (addOnId: string) => void;
  onUpdateAddOnParticipation: (id: string, participation: Participation) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ExtrasStep({
  trip,
  selectedAddOnIds,
  onToggleAddOn,
  onUpdateAddOnParticipation,
  onBack,
  onNext,
}: ExtrasStepProps) {
  const destinationId = trip.selectedDestinationId!;
  const vibe = destinations.find((d) => d.id === destinationId)?.vibe;
  const hasKids = trip.travelers.children > 0;
  const isSkiVibe = vibe === "mountains";
  const globalAddOns = addOns.filter(
    (a) =>
      a.destinationId === null &&
      (a.id !== "kids-club" || hasKids) &&
      (a.id !== "equipment-rental" || isSkiVibe)
  );
  const diningAddOns = addOns.filter(
    (a) => a.destinationId === destinationId && a.category === "Dining"
  );

  return (
    <div className="py-10 px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        A few thoughtful extras
      </h1>
      <p className="mt-1 text-muted">
        Optional additions that fit your trip
      </p>

      <div className="mt-8 space-y-3">
        {globalAddOns.map((addon) => {
          const selected = selectedAddOnIds.includes(addon.id);
          const selectedItem = trip.selectedAddOns.find((a) => a.id === addon.id);
          const showParticipation = selected && selectedItem && PARTICIPATION_CATEGORIES.has(addon.category);

          return (
            <div
              key={addon.id}
              className={`rounded-xl border p-5 transition-all ${
                selected
                  ? "border-brand bg-brand/[0.03]"
                  : "border-border bg-white hover:border-brand/30 hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => onToggleAddOn(addon.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{addon.name}</p>
                    <p className="text-sm text-muted mt-1">{addon.shortDescription}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {addon.price > 0 && (
                      <span className="text-sm text-muted">
                        ${addon.price}{addon.perPerson ? "/person" : ""}
                      </span>
                    )}
                    <span className={`text-sm ${selected ? "text-brand" : "text-muted"}`}>
                      {selected ? "✓" : "+"}
                    </span>
                  </div>
                </div>
              </button>

              {showParticipation && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <ParticipationPicker
                    participation={selectedItem.participation}
                    travelers={trip.travelers}
                    onChange={(p) => onUpdateAddOnParticipation(addon.id, p)}
                    kidsOnly={addon.id === "kids-club"}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {diningAddOns.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-medium">Dinner reservations</h2>
          <p className="mt-1 text-sm text-muted">
            Complimentary reservation at nearby restaurants
          </p>

          <div className="mt-4 space-y-3">
            {diningAddOns.map((addon) => {
              const selected = selectedAddOnIds.includes(addon.id);
              const selectedItem = trip.selectedAddOns.find((a) => a.id === addon.id);
              const priceRange = addon.tags.find((t) => /^\$+$/.test(t));

              return (
                <div
                  key={addon.id}
                  className={`rounded-xl border p-5 transition-all ${
                    selected
                      ? "border-brand bg-brand/[0.03]"
                      : "border-border bg-white hover:border-brand/30 hover:shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => onToggleAddOn(addon.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{addon.name}</p>
                        <p className="text-sm text-muted mt-1">{addon.shortDescription}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {priceRange && (
                          <span className="text-sm text-muted">{priceRange}</span>
                        )}
                        <span className={`text-sm ${selected ? "text-brand" : "text-muted"}`}>
                          {selected ? "✓" : "+"}
                        </span>
                      </div>
                    </div>
                  </button>

                  {selected && selectedItem && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <ParticipationPicker
                        participation={selectedItem.participation}
                        travelers={trip.travelers}
                        onChange={(p) => onUpdateAddOnParticipation(addon.id, p)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

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
