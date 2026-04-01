import type { TripState, Participation } from "../../../types/trip";
import { addOns } from "../../../data/mock/addons";
import { getDestination } from "../../../data/selectors";
import { ParticipationPicker } from "../../../components/shared/ParticipationPicker";
import { SelectableCard } from "../../../components/shared/SelectableCard";
import { StepHeader } from "../../../components/shared/StepHeader";
import { StepActions } from "../../../components/shared/StepActions";

const PARTICIPATION_CATEGORIES = new Set(["Dining", "Family", "Gear"]);

interface ExtrasStepProps {
  trip: TripState;
  onToggleAddOn: (addOnId: string) => void;
  onUpdateAddOnParticipation: (id: string, participation: Participation) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ExtrasStep({
  trip,
  onToggleAddOn,
  onUpdateAddOnParticipation,
  onBack,
  onNext,
}: ExtrasStepProps) {
  const destinationId = trip.selectedDestinationId!;
  const selectedAddOnIds = trip.selectedAddOns.map((a) => a.id);
  const vibe = getDestination(destinationId)?.vibe;
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
      <StepHeader
        title="A few thoughtful extras"
        subtitle="Optional additions that fit your trip"
      />

      <div className="mt-8 space-y-3">
        {globalAddOns.map((addon) => {
          const selected = selectedAddOnIds.includes(addon.id);
          const selectedItem = trip.selectedAddOns.find((a) => a.id === addon.id);
          const showParticipation = selected && selectedItem && PARTICIPATION_CATEGORIES.has(addon.category);

          return (
            <SelectableCard
              key={addon.id}
              selected={selected}
              onToggle={() => onToggleAddOn(addon.id)}
              trailing={
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
              }
              expanded={showParticipation ? (
                <ParticipationPicker
                  participation={selectedItem.participation}
                  travelers={trip.travelers}
                  onChange={(p) => onUpdateAddOnParticipation(addon.id, p)}
                  kidsOnly={addon.id === "kids-club"}
                />
              ) : undefined}
            >
              <p className="font-medium">{addon.name}</p>
              <p className="text-sm text-muted mt-1">{addon.shortDescription}</p>
            </SelectableCard>
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
                <SelectableCard
                  key={addon.id}
                  selected={selected}
                  onToggle={() => onToggleAddOn(addon.id)}
                  trailing={
                    <div className="flex items-center gap-3">
                      {priceRange && (
                        <span className="text-sm text-muted">{priceRange}</span>
                      )}
                      <span className={`text-sm ${selected ? "text-brand" : "text-muted"}`}>
                        {selected ? "✓" : "+"}
                      </span>
                    </div>
                  }
                  expanded={selected && selectedItem ? (
                    <ParticipationPicker
                      participation={selectedItem.participation}
                      travelers={trip.travelers}
                      onChange={(p) => onUpdateAddOnParticipation(addon.id, p)}
                    />
                  ) : undefined}
                >
                  <p className="font-medium">{addon.name}</p>
                  <p className="text-sm text-muted mt-1">{addon.shortDescription}</p>
                </SelectableCard>
              );
            })}
          </div>
        </>
      )}

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
