import type { TripState, Recommendation } from "../../types/trip";
import { recommendations } from "../../data/mock/recommendations";
import { getActivity, getDestination } from "../../data/selectors";
import { isRecommendationAllowed } from "./bundles";

export function getRecommendations(trip: TripState): Recommendation[] {
  const vibe = trip.selectedDestinationId
    ? getDestination(trip.selectedDestinationId)?.vibe
    : undefined;
  const selectedAddOnIds = trip.selectedAddOns.map((a) => a.id);

  return recommendations.filter((rec) => {
    if (!isRecommendationAllowed(rec, vibe)) return false;
    if (trip.seenRecommendationIds.includes(rec.id)) return true;
    switch (rec.trigger.type) {
      case "activity_selected": {
        const selected = trip.selectedActivities
          .map((a) => getActivity(a.id))
          .filter((a) => a !== undefined);
        return selected.some((a) => a.tags.includes(rec.trigger.value ?? ""));
      }
      case "has_children":
        return trip.travelers.children > 0;
      case "addon_selected":
        return selectedAddOnIds.includes(rec.trigger.value ?? "");
      default:
        return false;
    }
  });
}
