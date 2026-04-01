import type { TripState } from "../../types/trip";
import { destinations } from "../../data/mock/destinations";
import { lodgings } from "../../data/mock/lodgings";
import { activities } from "../../data/mock/activities";
import { addOns } from "../../data/mock/addons";
import { calculateTotal } from "../../domain/services/pricing";
import { formatCurrency } from "../../utils/format";

interface TripSummaryRailProps {
  trip: TripState;
  onContinue: () => void;
}

export function TripSummaryRail({ trip, onContinue }: TripSummaryRailProps) {
  const destination = destinations.find((d) => d.id === trip.selectedDestinationId);
  const lodging = lodgings.find((l) => l.id === trip.selectedLodgingId);
  const selectedActivities = activities.filter((a) => trip.selectedActivityIds.includes(a.id));
  const selectedAddOns = addOns.filter((a) => trip.selectedAddOnIds.includes(a.id));
  const total = calculateTotal(trip);

  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-8 rounded-xl border border-border bg-white p-6">
        <h3 className="text-sm font-semibold mb-4">Your trip</h3>

        <div className="space-y-3 text-sm text-muted">
          {destination && <p>{destination.name}</p>}
          <p>{trip.dateRange.start} – {trip.dateRange.end}</p>
          <p>{trip.travelers.adults + trip.travelers.children} guests</p>

          <div className="border-t border-border pt-3 mt-3">
            <p className="font-medium text-brand">Stay</p>
            <p>{lodging?.name ?? "—"}</p>
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <p className="font-medium text-brand">Activities</p>
            <p>
              {selectedActivities.length > 0
                ? selectedActivities.map((a) => a.name).join(", ")
                : "—"}
            </p>
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <p className="font-medium text-brand">Extras</p>
            <p>
              {selectedAddOns.length > 0
                ? selectedAddOns.map((a) => a.name).join(", ")
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted">Total</p>
          <p className="text-xl font-semibold">{total > 0 ? formatCurrency(total) : "—"}</p>
        </div>

        <button
          onClick={onContinue}
          className="mt-4 w-full rounded-lg bg-brand text-white py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </aside>
  );
}
