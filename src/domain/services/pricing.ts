import type { TripState } from "../../types/trip";
import { lodgings } from "../../data/mock/lodgings";
import { activities } from "../../data/mock/activities";
import { addOns } from "../../data/mock/addons";
import { participantCount } from "../../utils/format";

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
    return sum + (addOn?.price ?? 0);
  }, 0);

  return stayTotal + activitiesTotal + addOnsTotal;
}
