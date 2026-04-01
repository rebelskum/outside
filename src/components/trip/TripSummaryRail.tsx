import type { TripState } from "../../types/trip";
import { getDestination, getLodging, getActivity, getAddOn } from "../../data/selectors";
import { calculateTotal } from "../../domain/services/pricing";
import { formatCurrency, formatParticipation } from "../../utils/format";

interface TripSummaryRailProps {
  trip: TripState;
  onContinue: () => void;
}

export function TripSummaryRail({ trip, onContinue }: TripSummaryRailProps) {
  const destination = trip.selectedDestinationId ? getDestination(trip.selectedDestinationId) : undefined;
  const lodging = trip.selectedLodgingId ? getLodging(trip.selectedLodgingId) : undefined;
  const total = calculateTotal(trip);

  return (
    <aside className="hidden lg:block w-80 shrink-0 pt-10">
      <div className="sticky top-8 rounded-xl border border-border bg-white p-6">
        <h3 className="text-sm font-semibold mb-4">Your trip</h3>

        <div className="space-y-3 text-sm text-muted">
          {destination && <p>{destination.name}, {destination.region}</p>}
          <p>{trip.dateRange.start} – {trip.dateRange.end}</p>
          <p>{trip.travelers.adults + trip.travelers.children} guests</p>

          <div className="border-t border-border pt-3 mt-3">
            <p className="font-medium text-brand">Stay</p>
            <p>{lodging?.name ?? "—"}</p>
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <p className="font-medium text-brand">Activities</p>
            {trip.selectedActivities.length > 0 ? (
              <ul className="space-y-1 mt-1">
                {trip.selectedActivities.map((item) => {
                  const activity = getActivity(item.id);
                  if (!activity) return null;
                  const who = formatParticipation(item.participation, trip.travelers);
                  return (
                    <li key={item.id}>
                      <span>{activity.name}</span>
                      <span className="text-muted/60"> · {who}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>—</p>
            )}
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <p className="font-medium text-brand">Extras</p>
            {trip.selectedAddOns.length > 0 ? (
              <ul className="space-y-1 mt-1">
                {trip.selectedAddOns.map((item) => {
                  const addOn = getAddOn(item.id);
                  if (!addOn) return null;
                  const who = formatParticipation(item.participation, trip.travelers);
                  return (
                    <li key={item.id}>
                      <span>{addOn.name}</span>
                      <span className="text-muted/60"> · {who}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>—</p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted">Total</p>
          <p className="text-xl font-semibold">{total > 0 ? formatCurrency(total) : "—"}</p>
        </div>

        <button
          onClick={onContinue}
          className="mt-4 w-full rounded-lg bg-accent text-brand py-3 text-sm font-medium hover:bg-brand hover:text-white transition-colors"
        >
          Continue
        </button>
      </div>
    </aside>
  );
}
