import type { TripState, Recommendation } from "../../types/trip";
import { recommendations } from "../../data/mock/recommendations";
import { activities } from "../../data/mock/activities";
import { destinations } from "../../data/mock/destinations";

const SKI_RECOMMENDATION_IDS = new Set(["ski-bundle", "gear-and-guide"]);

export function getRecommendations(trip: TripState): Recommendation[] {
  const vibe = destinations.find((d) => d.id === trip.selectedDestinationId)?.vibe;
  const selectedActivityIds = trip.selectedActivities.map((a) => a.id);
  const selectedAddOnIds = trip.selectedAddOns.map((a) => a.id);

  return recommendations.filter((rec) => {
    if (vibe !== "mountains" && SKI_RECOMMENDATION_IDS.has(rec.id)) return false;
    switch (rec.trigger.type) {
      case "activity_selected": {
        const selected = activities.filter((a) => selectedActivityIds.includes(a.id));
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
