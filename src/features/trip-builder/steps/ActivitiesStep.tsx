import type { TripState, Recommendation, Participation } from "../../../types/trip";
import { getRecommendations } from "../../../domain/services/recommendations";
import { getRelevantActivityIds } from "../../../domain/services/bundles";
import { getDestination, getActivitiesForDestination } from "../../../data/selectors";
import { formatCurrency } from "../../../utils/format";
import { ParticipationPicker } from "../../../components/shared/ParticipationPicker";
import { SelectableCard } from "../../../components/shared/SelectableCard";
import { StepHeader } from "../../../components/shared/StepHeader";
import { StepActions } from "../../../components/shared/StepActions";

interface ActivitiesStepProps {
  trip: TripState;
  onToggleActivity: (activityId: string) => void;
  onUpdateActivityParticipation: (id: string, participation: Participation) => void;
  onToggleAddOn: (addOnId: string) => void;
  onUpdateAddOnParticipation: (id: string, participation: Participation) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ActivitiesStep({
  trip,
  onToggleActivity,
  onUpdateActivityParticipation,
  onToggleAddOn,
  onUpdateAddOnParticipation,
  onBack,
  onNext,
}: ActivitiesStepProps) {
  const destinationId = trip.selectedDestinationId!;
  const selectedActivityIds = trip.selectedActivities.map((a) => a.id);
  const selectedAddOnIds = trip.selectedAddOns.map((a) => a.id);
  const destination = getDestination(destinationId);
  const available = getActivitiesForDestination(destinationId);

  const recs = getRecommendations(trip);
  const recommendation = recs.length > 0 ? recs[0] : null;

  return (
    <div className="py-10 px-8">
      <StepHeader
        title={`Your stay in ${destination?.name}, ${destination?.region}`}
        subtitle="Now add a few things to do nearby"
      />

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
            <SelectableCard
              key={activity.id}
              selected={selected}
              onToggle={() => onToggleActivity(activity.id)}
              trailing={
                <span className={`text-sm ${selected ? "text-brand" : "text-muted"}`}>
                  {selected ? "✓ Added" : "+ Add"}
                </span>
              }
              expanded={selected && selectedItem ? (
                <ParticipationPicker
                  participation={selectedItem.participation}
                  travelers={trip.travelers}
                  onChange={(p) => onUpdateActivityParticipation(activity.id, p)}
                />
              ) : undefined}
            >
              <p className="font-medium">{activity.name}</p>
              <p className="text-sm text-muted mt-1">{activity.shortDescription}</p>
              <p className="text-xs text-muted mt-1">
                {activity.duration} · ${activity.price}/person
              </p>
            </SelectableCard>
          );
        })}
      </div>

      <StepActions onBack={onBack} onNext={onNext} />
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
  const relevantActivityIds = getRelevantActivityIds(recommendation, destinationId);

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

  const handleRemove = () => {
    for (const id of relevantActivityIds) {
      if (selectedActivityIds.includes(id)) onToggleActivity(id);
    }
    for (const id of recommendation.addOnIds) {
      if (selectedAddOnIds.includes(id)) onToggleAddOn(id);
    }
  };

  // Use the first bundle activity or add-on's participation as the shared participation state
  const bundleItem = relevantActivityIds.length > 0
    ? trip.selectedActivities.find((a) => a.id === relevantActivityIds[0])
    : trip.selectedAddOns.find((a) => recommendation.addOnIds.includes(a.id));

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

  const handleToggle = () => {
    if (allAlreadyAdded) {
      handleRemove();
    } else {
      handleAdd();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggle(); } }}
      className={`mt-8 rounded-2xl border p-6 cursor-pointer transition-all ${
        allAlreadyAdded
          ? "border-brand bg-brand/[0.03]"
          : "border-brand/10 bg-brand/[0.02] hover:border-brand/30 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Suggested for your trip
        </p>
        <span className={`text-sm ${allAlreadyAdded ? "text-brand" : "text-muted"}`}>
          {allAlreadyAdded ? "✓ Added" : "+ Add"}
        </span>
      </div>
      <p className="text-lg font-semibold mt-2">{recommendation.title}</p>
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
          <span className="text-sm text-highlight">
            Save {formatCurrency(recommendation.savings)} per person
          </span>
        )}
      </div>

      {allAlreadyAdded && bundleItem && (
        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
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
