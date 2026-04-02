import type { TripState, Recommendation, Participation } from "../../../types/trip";
import { getRelevantActivityIds } from "../../../domain/services/bundles";
import { formatCurrency } from "../../../utils/format";
import { ParticipationPicker } from "../../../components/shared/ParticipationPicker";

interface RecommendationCardProps {
  recommendation: Recommendation;
  destinationId: string;
  trip: TripState;
  selectedActivityIds: string[];
  selectedAddOnIds: string[];
  onToggleActivity: (id: string) => void;
  onUpdateActivityParticipation: (id: string, participation: Participation) => void;
  onToggleAddOn: (id: string) => void;
  onUpdateAddOnParticipation: (id: string, participation: Participation) => void;
  onMarkRecommendationSeen: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  destinationId,
  trip,
  selectedActivityIds,
  selectedAddOnIds,
  onToggleActivity,
  onUpdateActivityParticipation,
  onToggleAddOn,
  onUpdateAddOnParticipation,
  onMarkRecommendationSeen,
}: RecommendationCardProps) {
  const relevantActivityIds = getRelevantActivityIds(recommendation, destinationId);

  const allAlreadyAdded =
    relevantActivityIds.every((id) => selectedActivityIds.includes(id)) &&
    recommendation.addOnIds.every((id) => selectedAddOnIds.includes(id));

  const handleAdd = () => {
    onMarkRecommendationSeen(recommendation.id);
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
          <span className="text-sm text-bundle">
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
