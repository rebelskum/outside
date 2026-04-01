import type { TripState, Recommendation } from "../../types/trip";
import { recommendations } from "../../data/mock/recommendations";
import { activities } from "../../data/mock/activities";

export function getRecommendations(trip: TripState): Recommendation[] {
  return recommendations.filter((rec) => {
    switch (rec.trigger.type) {
      case "activity_selected": {
        const selected = activities.filter((a) =>
          trip.selectedActivityIds.includes(a.id)
        );
        return selected.some((a) => a.tags.includes(rec.trigger.value ?? ""));
      }
      case "has_children":
        return trip.travelers.children > 0;
      case "addon_selected":
        return trip.selectedAddOnIds.includes(rec.trigger.value ?? "");
      default:
        return false;
    }
  });
}
