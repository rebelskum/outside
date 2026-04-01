import { useState, useEffect } from "react";
import type { TravelerGroup, DateRange } from "../../../types/trip";
import { destinations } from "../../../data/mock/destinations";
import { lodgings } from "../../../data/mock/lodgings";
import { OptimizedImage, preloadImages } from "../../../components/shared/OptimizedImage";
import { StayMap } from "../../../components/trip/StayMap";
import { DateRangePicker } from "../../../components/shared/DateRangePicker";
import { GuestPicker } from "../../../components/shared/GuestPicker";

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
  onUpdateTravelers,
  onUpdateDates,
  onBack,
  onNext,
}: StayStepProps) {
  const destination = destinations.find((d) => d.id === destinationId);
  const available = lodgings.filter((l) => l.destinationId === destinationId);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    preloadImages(available.map((l) => l.image));
  }, [destinationId]);

  function handleSelect(lodgingId: string) {
    onSelectLodging(lodgingId);
    onNext();
  }

  return (
    <div className="py-10 px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        {destination?.name}, {destination?.region}
      </h1>
      <p className="mt-1 text-muted">
        A curated stay selection for your weekend trip
      </p>

      <div className="mt-4 flex gap-3">
        <DateRangePicker dates={dates} onChange={onUpdateDates} />
        <GuestPicker travelers={travelers} onChange={onUpdateTravelers} />
      </div>

      <h2 className="mt-10 text-lg font-medium">Choose your stay</h2>

      {/* Area map */}
      <div className="mt-4">
        <StayMap
          lodgings={available}
          highlightedId={highlightedId}
          onPinClick={handleSelect}
        />
      </div>

      <div className="mt-6 space-y-4">
        {available.map((lodge) => (
          <button
            key={lodge.id}
            onClick={() => handleSelect(lodge.id)}
            onMouseEnter={() => setHighlightedId(lodge.id)}
            onMouseLeave={() => setHighlightedId(null)}
            className={`w-full rounded-xl border bg-white p-5 text-left transition-all ${
              highlightedId === lodge.id
                ? "border-brand/30 shadow-sm"
                : "border-border hover:border-brand/30 hover:shadow-sm"
            }`}
          >
            <div className="flex gap-5">
              <OptimizedImage
                src={lodge.image}
                alt={lodge.name}
                className="h-20 w-28 shrink-0 rounded-lg"
              />
              <div>
                <p className="font-medium">{lodge.name}</p>
                <p className="text-sm text-muted mt-1">{lodge.shortDescription}</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-sm font-medium">${lodge.nightlyRate} / night</p>
                  <span className="text-xs text-muted/70">·</span>
                  <span className="text-xs text-muted">{lodge.locationLabel}</span>
                </div>
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
          className="rounded-lg bg-accent text-brand px-6 py-2.5 text-sm font-medium hover:bg-brand hover:text-white transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
