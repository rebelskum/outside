import type { TripState } from "../../../types/trip";
import { destinations } from "../../../data/mock/destinations";
import { lodgings } from "../../../data/mock/lodgings";
import { activities } from "../../../data/mock/activities";
import { addOns } from "../../../data/mock/addons";
import { calculateTotal } from "../../../domain/services/pricing";
import { formatCurrency } from "../../../utils/format";

interface ReviewStepProps {
  trip: TripState;
  onBack: () => void;
}

export function ReviewStep({ trip, onBack }: ReviewStepProps) {
  const destination = destinations.find((d) => d.id === trip.selectedDestinationId);
  const lodging = lodgings.find((l) => l.id === trip.selectedLodgingId);
  const selectedActivities = activities.filter((a) => trip.selectedActivityIds.includes(a.id));
  const selectedAddOns = addOns.filter((a) => trip.selectedAddOnIds.includes(a.id));
  const total = calculateTotal(trip);

  return (
    <div className="py-10 px-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Review your weekend
      </h1>
      <p className="mt-1 text-muted">
        A final look before you book
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Stay</h2>
          <p className="font-medium">{lodging?.name ?? "—"}</p>
          <p className="text-sm text-muted mt-1">
            {destination?.name}, {destination?.region} · {trip.dateRange.start} – {trip.dateRange.end}
          </p>
          <p className="text-sm text-muted">
            {trip.travelers.adults + trip.travelers.children} guests
          </p>
          {lodging && (
            <p className="text-sm font-medium mt-2">
              {formatCurrency(lodging.nightlyRate)} × 2 nights
            </p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Activities</h2>
          {selectedActivities.length > 0 ? (
            <ul className="space-y-2">
              {selectedActivities.map((a) => (
                <li key={a.id} className="flex justify-between text-sm">
                  <span>{a.name}</span>
                  <span className="text-muted">{formatCurrency(a.price)}/person</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No activities selected</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Extras</h2>
          {selectedAddOns.length > 0 ? (
            <ul className="space-y-2">
              {selectedAddOns.map((a) => (
                <li key={a.id} className="flex justify-between text-sm">
                  <span>{a.name}</span>
                  <span className="text-muted">{a.price > 0 ? formatCurrency(a.price) : "Free"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No extras selected</p>
          )}
        </section>
      </div>

      <div className="mt-10 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-sm text-muted hover:text-brand transition-colors"
        >
          ← Back
        </button>
        <div className="text-right">
          <p className="text-sm text-muted">Total</p>
          <p className="text-2xl font-semibold">{formatCurrency(total)}</p>
        </div>
      </div>

      <button className="mt-6 w-full rounded-lg bg-brand text-white py-3.5 text-sm font-medium hover:opacity-90 transition-opacity">
        Reserve trip
      </button>
    </div>
  );
}
