import type { TripState, Participation } from "../../../types/trip";
import { destinations } from "../../../data/mock/destinations";
import { lodgings } from "../../../data/mock/lodgings";
import { activities as allActivities } from "../../../data/mock/activities";
import { addOns } from "../../../data/mock/addons";
import { recommendations } from "../../../data/mock/recommendations";
import { calculateTotal, getBundleDiscount } from "../../../domain/services/pricing";
import { formatCurrency, formatParticipation, getNights, participantCount } from "../../../utils/format";
import { ParticipationPicker } from "../../../components/shared/ParticipationPicker";

interface ReviewStepProps {
  trip: TripState;
  onBack: () => void;
  onRemoveActivity: (id: string) => void;
  onUpdateActivityParticipation: (id: string, participation: Participation) => void;
  onRemoveAddOn: (id: string) => void;
  onUpdateAddOnParticipation: (id: string, participation: Participation) => void;
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function getActiveBundleIds(trip: TripState): { activityIds: Set<string>; addOnIds: Set<string>; title: string } | null {
  const selectedActivityIds = trip.selectedActivities.map((a) => a.id);
  const selectedAddOnIds = trip.selectedAddOns.map((a) => a.id);

  for (const rec of recommendations) {
    if (rec.savings <= 0) continue;

    const relevantActivityIds = rec.activityIds.filter((id) => {
      const activity = allActivities.find((a) => a.id === id);
      return activity?.destinationId === trip.selectedDestinationId;
    });

    const allActivitiesPresent = relevantActivityIds.every((id) => selectedActivityIds.includes(id));
    const allAddOnsPresent = rec.addOnIds.every((id) => selectedAddOnIds.includes(id));

    if (allActivitiesPresent && allAddOnsPresent && (relevantActivityIds.length > 0 || rec.addOnIds.length > 0)) {
      return {
        activityIds: new Set(relevantActivityIds),
        addOnIds: new Set(rec.addOnIds),
        title: rec.title,
      };
    }
  }
  return null;
}

function BundleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-emerald-600">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
      {label}
    </span>
  );
}

export function ReviewStep({
  trip,
  onBack,
  onRemoveActivity,
  onUpdateActivityParticipation,
  onRemoveAddOn,
  onUpdateAddOnParticipation,
}: ReviewStepProps) {
  const destination = destinations.find((d) => d.id === trip.selectedDestinationId);
  const lodging = lodgings.find((l) => l.id === trip.selectedLodgingId);
  const total = calculateTotal(trip);
  const discount = getBundleDiscount(trip);
  const activeBundle = getActiveBundleIds(trip);

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
              {formatCurrency(lodging.nightlyRate)} × {getNights(trip.dateRange)} night{getNights(trip.dateRange) !== 1 ? "s" : ""}
            </p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Activities</h2>
          {trip.selectedActivities.length > 0 ? (
            <ul className="space-y-0.5">
              {trip.selectedActivities.map((item) => {
                const activity = allActivities.find((a) => a.id === item.id);
                if (!activity) return null;
                const who = formatParticipation(item.participation, trip.travelers);
                const isBundled = activeBundle?.activityIds.has(item.id);
                return (
                  <li key={item.id} className="group rounded-lg px-3 py-3 -mx-3 hover:bg-surface/60 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{activity.name}</p>
                          {isBundled && activeBundle && <BundleBadge label={activeBundle.title} />}
                        </div>
                        <p className="text-xs text-muted mt-0.5">{who}</p>
                      </div>
                      <span className="text-sm text-muted mt-0.5">{formatCurrency(activity.price)}/person</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all overflow-hidden">
                      <ParticipationPicker
                        participation={item.participation}
                        travelers={trip.travelers}
                        onChange={(p) => onUpdateActivityParticipation(item.id, p)}
                        trigger={({ onClick }) => (
                          <button
                            onClick={onClick}
                            className="flex items-center gap-1 text-[11px] text-muted/60 hover:text-brand transition-colors"
                            title="Edit participants"
                          >
                            <PencilIcon />
                            <span>Edit</span>
                          </button>
                        )}
                      />
                      <span className="text-muted/30 text-[10px]">·</span>
                      <button
                        onClick={() => onRemoveActivity(item.id)}
                        className="flex items-center gap-1 text-[11px] text-muted/60 hover:text-red-500 transition-colors"
                        title="Remove activity"
                      >
                        <TrashIcon />
                        <span>Remove</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted">No activities selected</p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Extras</h2>
          {trip.selectedAddOns.length > 0 ? (
            <ul className="space-y-0.5">
              {trip.selectedAddOns.map((item) => {
                const addOn = addOns.find((a) => a.id === item.id);
                if (!addOn) return null;
                const who = formatParticipation(item.participation, trip.travelers);
                const count = participantCount(item.participation, trip.travelers);
                const isBundled = activeBundle?.addOnIds.has(item.id);
                return (
                  <li key={item.id} className="group rounded-lg px-3 py-3 -mx-3 hover:bg-surface/60 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{addOn.name}</p>
                          {isBundled && activeBundle && <BundleBadge label={activeBundle.title} />}
                        </div>
                        <p className="text-xs text-muted mt-0.5">{who}</p>
                      </div>
                      <span className="text-sm text-muted mt-0.5">
                        {addOn.price > 0
                          ? addOn.perPerson
                            ? `${formatCurrency(addOn.price)}/person × ${count}`
                            : formatCurrency(addOn.price)
                          : "Included"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all overflow-hidden">
                      <ParticipationPicker
                        participation={item.participation}
                        travelers={trip.travelers}
                        onChange={(p) => onUpdateAddOnParticipation(item.id, p)}
                        trigger={({ onClick }) => (
                          <button
                            onClick={onClick}
                            className="flex items-center gap-1 text-[11px] text-muted/60 hover:text-brand transition-colors"
                            title="Edit participants"
                          >
                            <PencilIcon />
                            <span>Edit</span>
                          </button>
                        )}
                      />
                      <span className="text-muted/30 text-[10px]">·</span>
                      <button
                        onClick={() => onRemoveAddOn(item.id)}
                        className="flex items-center gap-1 text-[11px] text-muted/60 hover:text-red-500 transition-colors"
                        title="Remove extra"
                      >
                        <TrashIcon />
                        <span>Remove</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted">No extras selected</p>
          )}

          {discount > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 flex justify-between text-sm">
              <span className="text-emerald-600 font-medium">Bundle discount</span>
              <span className="text-emerald-600">−{formatCurrency(discount)}</span>
            </div>
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
