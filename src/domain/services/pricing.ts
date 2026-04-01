import type { TripState } from "../../types/trip";
import { lodgings } from "../../data/mock/lodgings";
import { activities } from "../../data/mock/activities";
import { addOns } from "../../data/mock/addons";

export function calculateTotal(trip: TripState): number {
  const nights = 2;
  const guestCount = trip.travelers.adults + trip.travelers.children;

  const lodging = lodgings.find((l) => l.id === trip.selectedLodgingId);
  const stayTotal = (lodging?.nightlyRate ?? 0) * nights;

  const activitiesTotal = trip.selectedActivityIds.reduce((sum, id) => {
    const activity = activities.find((a) => a.id === id);
    return sum + (activity?.price ?? 0) * guestCount;
  }, 0);

  const addOnsTotal = trip.selectedAddOnIds.reduce((sum, id) => {
    const addOn = addOns.find((a) => a.id === id);
    return sum + (addOn?.price ?? 0);
  }, 0);

  return stayTotal + activitiesTotal + addOnsTotal;
}
