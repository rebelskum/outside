import type { TripState, Recommendation } from "../../types/trip";
import { recommendations } from "../../data/mock/recommendations";
import { activities } from "../../data/mock/activities";

export function getRecommendations(trip: TripState): Recommendation[] {
  return recommendations.filter((rec) => {
    switch (rec.triggerType) {
      case "activity_selected": {
        const selectedActivities = activities.filter((a) =>
          trip.selectedActivityIds.includes(a.id)
        );
        return selectedActivities.some((a) =>
          a.tags.includes(rec.triggerValue ?? "")
        );
      }
      case "has_children":
        return trip.travelers.children > 0;
      case "addon_selected":
        return trip.selectedAddOnIds.includes(rec.triggerValue ?? "");
      default:
        return false;
    }
  });
}
