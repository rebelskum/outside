import type { Recommendation, TripState, Vibe } from "../../types/trip";
import { getActivity, getDestination } from "../../data/selectors";
import { recommendations } from "../../data/mock/recommendations";

export const SKI_RECOMMENDATION_IDS = new Set(["ski-bundle", "gear-and-guide"]);

export function getRelevantActivityIds(
  recommendation: Recommendation,
  destinationId: string,
): string[] {
  return recommendation.activityIds.filter((id) =>
    getActivity(id)?.destinationId === destinationId,
  );
}

export function isRecommendationAllowed(
  recommendation: Recommendation,
  vibe: Vibe | undefined,
): boolean {
  return vibe === "mountains" || !SKI_RECOMMENDATION_IDS.has(recommendation.id);
}

export function getActiveBundle(
  trip: TripState,
): {
  activityIds: Set<string>;
  addOnIds: Set<string>;
  title: string;
  savings: number;
} | null {
  const vibe = trip.selectedDestinationId
    ? getDestination(trip.selectedDestinationId)?.vibe
    : undefined;

  const selectedActivityIds = trip.selectedActivities.map((a) => a.id);
  const selectedAddOnIds = trip.selectedAddOns.map((a) => a.id);

  for (const rec of recommendations) {
    if (rec.savings <= 0) continue;
    if (!isRecommendationAllowed(rec, vibe)) continue;

    const relevantActivityIds = trip.selectedDestinationId
      ? getRelevantActivityIds(rec, trip.selectedDestinationId)
      : [];

    const allActivitiesPresent = relevantActivityIds.every((id) =>
      selectedActivityIds.includes(id),
    );
    const allAddOnsPresent = rec.addOnIds.every((id) =>
      selectedAddOnIds.includes(id),
    );

    if (
      allActivitiesPresent &&
      allAddOnsPresent &&
      (relevantActivityIds.length > 0 || rec.addOnIds.length > 0)
    ) {
      return {
        activityIds: new Set(relevantActivityIds),
        addOnIds: new Set(rec.addOnIds),
        title: rec.title,
        savings: rec.savings,
      };
    }
  }
  return null;
}
