import type { TravelerGroup, DateRange } from "../../../types/trip";

interface StayStepProps {
  destinationId: string;
  travelers: TravelerGroup;
  dates: DateRange;
  onSelectLodging: (lodgingId: string) => void;
  onUpdateTravelers: (travelers: TravelerGroup) => void;
  onUpdateDates: (dates: DateRange) => void;
}

export function StayStep({
  destinationId: _destinationId,
  travelers: _travelers,
  dates: _dates,
  onSelectLodging: _onSelectLodging,
  onUpdateTravelers: _onUpdateTravelers,
  onUpdateDates: _onUpdateDates,
}: StayStepProps) {
  return (
    <div className="px-8 py-12">
      <p className="text-muted text-sm">StayStep placeholder</p>
    </div>
  );
}
