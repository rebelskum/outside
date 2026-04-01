import type { TripState, Recommendation } from "../../../types/trip";
import { destinations } from "../../../data/mock/destinations";
import { activities } from "../../../data/mock/activities";
import { getRecommendations } from "../../../domain/services/recommendations";
import { formatCurrency } from "../../../utils/format";

interface ActivitiesStepProps {
  trip: TripState;
  onToggleActivity: (activityId: string) => void;
  onToggleAddOn: (addOnId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ActivitiesStep({
  trip,
  onToggleActivity,
  onToggleAddOn,
  onBack,
  onNext,
}: ActivitiesStepProps) {
  const destinationId = trip.selectedDestinationId!;
  const destination = destinations.find((d) => d.id === destinationId);
  const available = activities.filter((a) => a.destinationId === destinationId);

  const recs = getRecommendations(trip);
  const recommendation = recs.length > 0 ? recs[0] : null;

  return (
    <div className="py-10 px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Your stay in {destination?.name}, {destination?.region}
      </h1>
      <p className="mt-1 text-muted">
        Now add a few things to do nearby
      </p>

      {recommendation && (
        <RecommendationCard
          recommendation={recommendation}
          destinationId={destinationId}
          selectedActivityIds={trip.selectedActivityIds}
          selectedAddOnIds={trip.selectedAddOnIds}
          onToggleActivity={onToggleActivity}
          onToggleAddOn={onToggleAddOn}
        />
      )}

      <h2 className="mt-10 text-lg font-medium">Things to do</h2>

      <div className="mt-4 space-y-3">
        {available.map((activity) => {
          const selected = trip.selectedActivityIds.includes(activity.id);
          return (
            <button
              key={activity.id}
              onClick={() => onToggleActivity(activity.id)}
              className={`w-full rounded-xl border p-5 text-left transition-all ${
                selected
                  ? "border-brand bg-brand/[0.03]"
                  : "border-border bg-white hover:border-brand/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-muted mt-1">{activity.shortDescription}</p>
                  <p className="text-xs text-muted mt-1">
                    {activity.duration} · ${activity.price}/person
                  </p>
                </div>
                <span className={`text-sm ${selected ? "text-brand" : "text-muted"}`}>
                  {selected ? "✓ Added" : "+ Add"}
                </span>
              </div>
            </button>
          );
        })}
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

function RecommendationCard({
  recommendation,
  destinationId,
  selectedActivityIds,
  selectedAddOnIds,
  onToggleActivity,
  onToggleAddOn,
}: {
  recommendation: Recommendation;
  destinationId: string;
  selectedActivityIds: string[];
  selectedAddOnIds: string[];
  onToggleActivity: (id: string) => void;
  onToggleAddOn: (id: string) => void;
}) {
  const relevantActivityIds = recommendation.activityIds.filter((id) => {
    const activity = activities.find((a) => a.id === id);
    return activity?.destinationId === destinationId;
  });

  const allAlreadyAdded =
    relevantActivityIds.every((id) => selectedActivityIds.includes(id)) &&
    recommendation.addOnIds.every((id) => selectedAddOnIds.includes(id));

  const handleAdd = () => {
    for (const id of relevantActivityIds) {
      if (!selectedActivityIds.includes(id)) onToggleActivity(id);
    }
    for (const id of recommendation.addOnIds) {
      if (!selectedAddOnIds.includes(id)) onToggleAddOn(id);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-brand/10 bg-brand/[0.02] p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted mb-2">
        Suggested for your trip
      </p>
      <p className="text-lg font-semibold">{recommendation.title}</p>
      <p className="mt-1 text-sm text-muted leading-relaxed">
        {recommendation.reason}
      </p>

      <div className="mt-4 flex items-center gap-4">
        {recommendation.bundlePrice && (
          <span className="text-sm font-medium">
            {formatCurrency(recommendation.bundlePrice)}
          </span>
        )}
        {recommendation.savings > 0 && (
          <span className="text-sm text-emerald-600">
            Save {formatCurrency(recommendation.savings)}
          </span>
        )}
      </div>

      <button
        onClick={handleAdd}
        disabled={allAlreadyAdded}
        className={`mt-4 rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity ${
          allAlreadyAdded
            ? "bg-brand/5 text-muted cursor-default"
            : "bg-brand text-white hover:opacity-90"
        }`}
      >
        {allAlreadyAdded ? "✓ Added to trip" : "Add to trip"}
      </button>
    </div>
  );
}
