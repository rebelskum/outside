import type { TripState, Participation } from "../../../types/trip";
import { getRecommendations } from "../../../domain/services/recommendations";
import { getRelevantActivityIds } from "../../../domain/services/bundles";
import { getDestination, getActivitiesForDestination } from "../../../data/selectors";
import { formatCurrency } from "../../../utils/format";
import { ParticipationPicker } from "../../../components/shared/ParticipationPicker";
import { SelectableCard } from "../../../components/shared/SelectableCard";
import { StepHeader } from "../../../components/shared/StepHeader";
import { StepActions } from "../../../components/shared/StepActions";
import { RecommendationCard } from "./RecommendationCard";

interface ActivitiesStepProps {
  trip: TripState;
  onToggleActivity: (activityId: string) => void;
  onUpdateActivityParticipation: (id: string, participation: Participation) => void;
  onToggleAddOn: (addOnId: string) => void;
  onUpdateAddOnParticipation: (id: string, participation: Participation) => void;
  onMarkRecommendationSeen: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ActivitiesStep({
  trip,
  onToggleActivity,
  onUpdateActivityParticipation,
  onToggleAddOn,
  onUpdateAddOnParticipation,
  onMarkRecommendationSeen,
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

  // Check if any active recommendation with requiresActivity is missing an activity selection
  const hasActivityRequirementViolation = recs.some((rec) => {
    if (!rec.requiresActivity) return false;
    const relevantIds = getRelevantActivityIds(rec, destinationId);
    const recAddOnsSelected = rec.addOnIds.every((id) => selectedAddOnIds.includes(id));
    const recActivitiesSelected = relevantIds.length > 0
      ? relevantIds.every((id) => selectedActivityIds.includes(id))
      : false;
    // Bundle is considered "selected" when its add-ons are added
    const bundleSelected = recAddOnsSelected && (rec.addOnIds.length > 0 || recActivitiesSelected);
    return bundleSelected && selectedActivityIds.length === 0;
  });

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
          onMarkRecommendationSeen={onMarkRecommendationSeen}
        />
      )}

      {hasActivityRequirementViolation && (
        <p className="mt-3 text-xs text-required">
          * Please select at least one activity to continue with this bundle
        </p>
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
                {activity.duration} · {formatCurrency(activity.price)}/person
              </p>
            </SelectableCard>
          );
        })}
      </div>

      <StepActions
        onBack={onBack}
        onNext={onNext}
        nextDisabled={hasActivityRequirementViolation}
        nextDisabledTooltip="Please select an activity for this bundle"
      />
    </div>
  );
}
