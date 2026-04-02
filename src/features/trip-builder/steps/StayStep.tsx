import { useState, useEffect } from "react";
import type { TravelerGroup, DateRange } from "../../../types/trip";
import { getDestination, getLodgingsForDestination } from "../../../data/selectors";
import { formatCurrency } from "../../../utils/format";
import { OptimizedImage, preloadImages } from "../../../components/shared/OptimizedImage";
import { StayMap } from "../../../components/trip/StayMap";
import { DateRangePicker } from "../../../components/shared/DateRangePicker";
import { GuestPicker } from "../../../components/shared/GuestPicker";
import { StepHeader } from "../../../components/shared/StepHeader";
import { StepActions } from "../../../components/shared/StepActions";

interface StayStepProps {
  destinationId: string;
  selectedLodgingId: string | null;
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
  selectedLodgingId,
  travelers,
  dates,
  onSelectLodging,
  onUpdateTravelers,
  onUpdateDates,
  onBack,
  onNext,
}: StayStepProps) {
  const destination = getDestination(destinationId);
  const available = getLodgingsForDestination(destinationId);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const activeId = highlightedId ?? selectedLodgingId;

  useEffect(() => {
    preloadImages(available.map((l) => l.image));
  }, [destinationId]);

  function cardStyle(lodgeId: string) {
    const isSelected = selectedLodgingId === lodgeId;
    const isActive = activeId === lodgeId;

    if (isSelected)
      return "border-brand bg-brand/[0.03]";
    if (isActive)
      return "bg-white border-brand/30 shadow-sm";
    return "bg-white border-border hover:border-brand/30 hover:shadow-sm";
  }

  return (
    <div className="py-10 px-8">
      <StepHeader
        title={`${destination?.name}, ${destination?.region}`}
        subtitle="A curated stay selection for your weekend trip"
      />

      <div className="mt-4 flex gap-3">
        <DateRangePicker dates={dates} onChange={onUpdateDates} />
        <GuestPicker travelers={travelers} onChange={onUpdateTravelers} />
      </div>

      <h2 className="mt-10 text-lg font-medium">Choose your stay</h2>

      {/* Area map */}
      <div className="mt-4">
        <StayMap
          lodgings={available}
          highlightedId={activeId}
          onPinClick={onSelectLodging}
          onPinHover={setHighlightedId}
        />
      </div>

      <div className="mt-6 space-y-4">
        {available.map((lodge) => (
          <button
            key={lodge.id}
            onClick={() => onSelectLodging(lodge.id)}
            onMouseEnter={() => setHighlightedId(lodge.id)}
            onMouseLeave={() => setHighlightedId(null)}
            aria-label={`Select ${lodge.name}`}
            className={`w-full rounded-xl border p-5 text-left transition-all ${cardStyle(lodge.id)}`}
          >
            <div className="flex gap-5">
              <OptimizedImage
                src={lodge.image}
                alt={lodge.name}
                className="h-20 w-28 shrink-0 rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium">{lodge.name}</p>
                <p className="text-sm text-muted mt-1">{lodge.shortDescription}</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-sm font-medium">{formatCurrency(lodge.nightlyRate)} / night</p>
                  <span className="text-xs text-muted/70">·</span>
                  <span className="text-xs text-muted">{lodge.locationLabel}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <StepActions onBack={onBack} onNext={onNext} nextDisabled={!selectedLodgingId} />
    </div>
  );
}
