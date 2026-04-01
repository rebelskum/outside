import type { TravelerGroup, DateRange } from "../../../types/trip";
import { destinations } from "../../../data/mock/destinations";
import { lodgings } from "../../../data/mock/lodgings";

interface StayStepProps {
  destinationId: string;
  travelers: TravelerGroup;
  dates: DateRange;
  onSelectLodging: (lodgingId: string) => void;
  onUpdateTravelers: (travelers: TravelerGroup) => void;
  onUpdateDates: (dates: DateRange) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StayStep({
  destinationId,
  travelers,
  dates,
  onSelectLodging,
  onBack,
  onNext,
}: StayStepProps) {
  const destination = destinations.find((d) => d.id === destinationId);
  const available = lodgings.filter((l) => l.destinationId === destinationId);

  return (
    <div className="py-10 px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        {destination?.name}, {destination?.region}
      </h1>
      <p className="mt-1 text-muted">
        A curated stay selection for your weekend trip
      </p>

      <div className="mt-4 flex gap-3">
        <span className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm">
          {dates.start} – {dates.end}
        </span>
        <span className="inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm">
          {travelers.adults + travelers.children} guests
        </span>
      </div>

      <h2 className="mt-10 text-lg font-medium">Choose your stay</h2>

      <div className="mt-4 space-y-4">
        {available.map((lodge) => (
          <button
            key={lodge.id}
            onClick={() => {
              onSelectLodging(lodge.id);
              onNext();
            }}
            className="w-full rounded-xl border border-border bg-white p-5 text-left hover:border-brand/30 hover:shadow-sm transition-all"
          >
            <div className="flex gap-5">
              <div className="h-20 w-28 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-muted text-xs">
                photo
              </div>
              <div>
                <p className="font-medium">{lodge.name}</p>
                <p className="text-sm text-muted mt-1">{lodge.shortDescription}</p>
                <p className="text-sm font-medium mt-2">${lodge.nightlyRate} / night</p>
              </div>
            </div>
          </button>
        ))}
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
