import type { TripState } from "../../types/trip";
import { lodgings } from "../../data/mock/lodgings";
import { activities } from "../../data/mock/activities";
import { addOns } from "../../data/mock/addons";
import { recommendations } from "../../data/mock/recommendations";
import { participantCount } from "../../utils/format";

export function getBundleDiscount(trip: TripState): number {
  for (const rec of recommendations) {
    if (rec.bundlePrice === null || rec.savings <= 0) continue;

    const selectedActivityIds = trip.selectedActivities.map((a) => a.id);
    const selectedAddOnIds = trip.selectedAddOns.map((a) => a.id);

    const relevantActivityIds = rec.activityIds.filter((id) => {
      const activity = activities.find((a) => a.id === id);
      return activity?.destinationId === trip.selectedDestinationId;
    });

    const allActivities = relevantActivityIds.every((id) =>
      selectedActivityIds.includes(id)
    );
    const allAddOns = rec.addOnIds.every((id) =>
      selectedAddOnIds.includes(id)
    );

    if (allActivities && allAddOns && (relevantActivityIds.length > 0 || rec.addOnIds.length > 0)) {
      const bundleItem = relevantActivityIds.length > 0
        ? trip.selectedActivities.find((a) => a.id === relevantActivityIds[0])
        : trip.selectedAddOns.find((a) => rec.addOnIds.includes(a.id));
      const count = bundleItem ? participantCount(bundleItem.participation, trip.travelers) : 1;
      return rec.savings * count;
    }
  }
  return 0;
}

export function calculateTotal(trip: TripState): number {
  const nights = 2;

  const lodging = lodgings.find((l) => l.id === trip.selectedLodgingId);
  const stayTotal = (lodging?.nightlyRate ?? 0) * nights;

  const activitiesTotal = trip.selectedActivities.reduce((sum, item) => {
    const activity = activities.find((a) => a.id === item.id);
    if (!activity) return sum;
    const count = participantCount(item.participation, trip.travelers);
    return sum + activity.price * count;
  }, 0);

  const addOnsTotal = trip.selectedAddOns.reduce((sum, item) => {
    const addOn = addOns.find((a) => a.id === item.id);
    if (!addOn) return sum;
    if (addOn.perPerson) {
      const count = participantCount(item.participation, trip.travelers);
      return sum + addOn.price * count;
    }
    return sum + addOn.price;
  }, 0);

  const discount = getBundleDiscount(trip);

  return stayTotal + activitiesTotal + addOnsTotal - discount;
}
