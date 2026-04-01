import type { TripState } from "../../types/trip";
import { getLodging, getActivity, getAddOn } from "../../data/selectors";
import { getNights, participantCount } from "../../utils/format";
import { getActiveBundle } from "./bundles";

export function getBundleDiscount(trip: TripState): number {
  const bundle = getActiveBundle(trip);
  if (!bundle) return 0;

  const bundleItem = bundle.activityIds.size > 0
    ? trip.selectedActivities.find((a) => bundle.activityIds.has(a.id))
    : trip.selectedAddOns.find((a) => bundle.addOnIds.has(a.id));
  const count = bundleItem ? participantCount(bundleItem.participation, trip.travelers) : 1;
  return bundle.savings * count;
}

export function calculateTotal(trip: TripState): number {
  const nights = getNights(trip.dateRange);

  const lodging = trip.selectedLodgingId ? getLodging(trip.selectedLodgingId) : undefined;
  const stayTotal = (lodging?.nightlyRate ?? 0) * nights;

  const activitiesTotal = trip.selectedActivities.reduce((sum, item) => {
    const activity = getActivity(item.id);
    if (!activity) return sum;
    return sum + activity.price * participantCount(item.participation, trip.travelers);
  }, 0);

  const addOnsTotal = trip.selectedAddOns.reduce((sum, item) => {
    const addOn = getAddOn(item.id);
    if (!addOn) return sum;
    if (addOn.perPerson) {
      return sum + addOn.price * participantCount(item.participation, trip.travelers);
    }
    return sum + addOn.price;
  }, 0);

  return stayTotal + activitiesTotal + addOnsTotal - getBundleDiscount(trip);
}
