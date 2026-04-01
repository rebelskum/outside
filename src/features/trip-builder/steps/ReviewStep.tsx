import type { TripState } from "../../../types/trip";

interface ReviewStepProps {
  trip: TripState;
}

export function ReviewStep({ trip: _trip }: ReviewStepProps) {
  return (
    <div className="px-8 py-12">
      <p className="text-muted text-sm">ReviewStep placeholder</p>
    </div>
  );
}
