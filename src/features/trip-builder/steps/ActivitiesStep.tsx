import type { TripState, Recommendation, Participation } from "../../../types/trip";
import { destinations } from "../../../data/mock/destinations";
import { activities } from "../../../data/mock/activities";
import { getRecommendations } from "../../../domain/services/recommendations";
import { formatCurrency } from "../../../utils/format";
import { ParticipationPicker } from "../../../components/shared/ParticipationPicker";

interface ActivitiesStepProps {
  trip: TripState;
  selectedActivityIds: string[];
  selectedAddOnIds: string[];
  onToggleActivity: (activityId: string) => void;
  onUpdateActivityParticipation: (id: string, participation: Participation) => void;
  onToggleAddOn: (addOnId: string) => void;
  onUpdateAddOnParticipation: (id: string, participation: Participation) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ActivitiesStep({
  trip,
  selectedActivityIds,
  selectedAddOnIds,
  onToggleActivity,
  onUpdateActivityParticipation,
  onToggleAddOn,
  onUpdateAddOnParticipation,
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
          trip={trip}
          selectedActivityIds={selectedActivityIds}
          selectedAddOnIds={selectedAddOnIds}
          onToggleActivity={onToggleActivity}
          onUpdateActivityParticipation={onUpdateActivityParticipation}
          onToggleAddOn={onToggleAddOn}
          onUpdateAddOnParticipation={onUpdateAddOnParticipation}
        />
      )}

      <h2 className="mt-10 text-lg font-medium">Things to do</h2>

      <div className="mt-4 space-y-3">
        {available.map((activity) => {
          const selected = selectedActivityIds.includes(activity.id);
          const selectedItem = trip.selectedActivities.find((a) => a.id === activity.id);
          return (
            <div
              key={activity.id}
              className={`rounded-xl border p-5 transition-all ${
                selected
                  ? "border-brand bg-brand/[0.03]"
                  : "border-border bg-white hover:border-brand/30 hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => onToggleActivity(activity.id)}
                className="w-full text-left"
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

              {selected && selectedItem && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <ParticipationPicker
                    participation={selectedItem.participation}
                    travelers={trip.travelers}
                    onChange={(p) => onUpdateActivityParticipation(activity.id, p)}
                  />
                </div>
              )}
            </div>
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
  trip,
  selectedActivityIds,
  selectedAddOnIds,
  onToggleActivity,
  onUpdateActivityParticipation,
  onToggleAddOn,
  onUpdateAddOnParticipation,
}: {
  recommendation: Recommendation;
  destinationId: string;
  trip: TripState;
  selectedActivityIds: string[];
  selectedAddOnIds: string[];
  onToggleActivity: (id: string) => void;
  onUpdateActivityParticipation: (id: string, participation: Participation) => void;
  onToggleAddOn: (id: string) => void;
  onUpdateAddOnParticipation: (id: string, participation: Participation) => void;
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

  // Use the first bundle activity's participation as the shared participation state
  const bundleItem = relevantActivityIds.length > 0
    ? trip.selectedActivities.find((a) => a.id === relevantActivityIds[0])
    : null;

  const handleBundleParticipation = (p: Participation) => {
    for (const id of relevantActivityIds) {
      onUpdateActivityParticipation(id, p);
    }
    for (const id of recommendation.addOnIds) {
      if (selectedAddOnIds.includes(id)) {
        onUpdateAddOnParticipation(id, p);
      }
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
            {formatCurrency(recommendation.bundlePrice)}/person
          </span>
        )}
        {recommendation.savings > 0 && (
          <span className="text-sm text-emerald-600">
            Save {formatCurrency(recommendation.savings)} per person
          </span>
        )}
      </div>

      {!allAlreadyAdded && (
        <button
          onClick={handleAdd}
          className="mt-4 rounded-lg px-5 py-2.5 text-sm font-medium bg-brand text-white hover:opacity-90 transition-opacity"
        >
          Add to trip
        </button>
      )}

      {allAlreadyAdded && bundleItem && (
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-brand font-medium">✓ Added</span>
          <ParticipationPicker
            participation={bundleItem.participation}
            travelers={trip.travelers}
            onChange={handleBundleParticipation}
          />
        </div>
      )}
    </div>
  );
}
