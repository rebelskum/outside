import { useState, useRef } from "react";
import type { TripState, Participation, DateRange, TravelerGroup } from "../../../types/trip";
import { getDestination, getLodging, getActivity, getAddOn } from "../../../data/selectors";
import { getActiveBundle } from "../../../domain/services/bundles";
import { calculateTotal, getBundleDiscount } from "../../../domain/services/pricing";
import { formatCurrency, formatParticipation, getNights, participantCount } from "../../../utils/format";
import { ParticipationPicker } from "../../../components/shared/ParticipationPicker";
import { DateRangePicker } from "../../../components/shared/DateRangePicker";
import { GuestPicker } from "../../../components/shared/GuestPicker";
import { StepHeader } from "../../../components/shared/StepHeader";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface ReviewStepProps {
  trip: TripState;
  onBack: () => void;
  onUpdateDates: (dates: DateRange) => void;
  onUpdateTravelers: (travelers: TravelerGroup) => void;
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

function BundleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-highlight px-2 py-0.5 text-[10px] font-medium tracking-wide text-white">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
      {label}
    </span>
  );
}

interface ReviewLineItemProps {
  name: string;
  priceLabel: string;
  who: string;
  isBundled: boolean;
  isEditing: boolean;
  participation: Participation;
  travelers: TravelerGroup;
  onUpdateParticipation: (p: Participation) => void;
  onSetEditing: (editing: boolean) => void;
  onRemove: () => void;
  kidsOnly?: boolean;
}

function ReviewLineItem({
  name,
  priceLabel,
  who,
  isBundled,
  isEditing,
  participation,
  travelers,
  onUpdateParticipation,
  onSetEditing,
  onRemove,
  kidsOnly,
}: ReviewLineItemProps) {
  return (
    <li className="group rounded-lg px-3 py-3 -mx-3 hover:bg-surface/60 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{name}</p>
            {isBundled && <BundleBadge label="Bundled" />}
          </div>
          <p className="text-xs text-muted mt-0.5">{who}</p>
        </div>
        <span className="text-sm text-muted mt-0.5">{priceLabel}</span>
      </div>
      <div className={`flex items-center gap-1 mt-1.5 transition-opacity ${isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <ParticipationPicker
          participation={participation}
          travelers={travelers}
          onChange={onUpdateParticipation}
          onOpenChange={(open) => onSetEditing(open)}
          kidsOnly={kidsOnly}
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
          onClick={onRemove}
          className="flex items-center gap-1 text-[11px] text-muted/60 hover:text-highlight transition-colors"
          title="Remove"
        >
          <TrashIcon />
          <span>Remove</span>
        </button>
      </div>
    </li>
  );
}

export function ReviewStep({
  trip,
  onBack,
  onUpdateDates,
  onUpdateTravelers,
  onRemoveActivity,
  onUpdateActivityParticipation,
  onRemoveAddOn,
  onUpdateAddOnParticipation,
}: ReviewStepProps) {
  const [editingStay, setEditingStay] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const staySectionRef = useRef<HTMLElement>(null);

  useClickOutside(staySectionRef, editingStay, () => setEditingStay(false));

  const destination = trip.selectedDestinationId ? getDestination(trip.selectedDestinationId) : undefined;
  const lodging = trip.selectedLodgingId ? getLodging(trip.selectedLodgingId) : undefined;
  const total = calculateTotal(trip);
  const discount = getBundleDiscount(trip);
  const activeBundle = getActiveBundle(trip);
  const nights = getNights(trip.dateRange);
  const guestCount = trip.travelers.adults + trip.travelers.children;

  return (
    <div className="py-10 px-8">
      <StepHeader
        title="Review your weekend"
        subtitle="A final look before you book"
      />

      <div className="mt-8 space-y-6">
        <section ref={staySectionRef} className="group rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Stay</h2>
          <p className="font-medium">{lodging?.name ?? "—"}</p>
          <p className="text-sm text-muted mt-1">
            {destination?.name}, {destination?.region} · {trip.dateRange.start} – {trip.dateRange.end}
          </p>
          <p className="text-sm text-muted">
            {guestCount} guest{guestCount !== 1 ? "s" : ""}
          </p>
          {lodging && (
            <p className="text-sm font-medium mt-2">
              {formatCurrency(lodging.nightlyRate)} × {nights} night{nights !== 1 ? "s" : ""}
            </p>
          )}

          <div className={`flex items-center gap-1 mt-1.5 transition-opacity ${editingStay ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button
              onClick={() => setEditingStay(true)}
              className="flex items-center gap-1 text-[11px] text-muted/60 hover:text-brand transition-colors"
            >
              <PencilIcon />
              <span>Edit</span>
            </button>
          </div>

          {editingStay && (
            <div className="flex flex-wrap gap-2 mt-3">
              <DateRangePicker dates={trip.dateRange} onChange={onUpdateDates} />
              <GuestPicker travelers={trip.travelers} onChange={onUpdateTravelers} />
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Activities</h2>
          {trip.selectedActivities.length > 0 ? (
            <ul className="space-y-0.5">
              {trip.selectedActivities.map((item) => {
                const activity = getActivity(item.id);
                if (!activity) return null;
                return (
                  <ReviewLineItem
                    key={item.id}
                    name={activity.name}
                    priceLabel={`${formatCurrency(activity.price)}/person`}
                    who={formatParticipation(item.participation, trip.travelers)}
                    isBundled={activeBundle?.activityIds.has(item.id) ?? false}
                    isEditing={editingItemId === item.id}
                    participation={item.participation}
                    travelers={trip.travelers}
                    onUpdateParticipation={(p) => onUpdateActivityParticipation(item.id, p)}
                    onSetEditing={(editing) => setEditingItemId(editing ? item.id : null)}
                    onRemove={() => onRemoveActivity(item.id)}
                  />
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
                const addOn = getAddOn(item.id);
                if (!addOn) return null;
                const count = participantCount(item.participation, trip.travelers);
                const priceLabel = addOn.price > 0
                  ? addOn.perPerson
                    ? `${formatCurrency(addOn.price)}/person × ${count}`
                    : formatCurrency(addOn.price)
                  : "Included";
                return (
                  <ReviewLineItem
                    key={item.id}
                    name={addOn.name}
                    priceLabel={priceLabel}
                    who={formatParticipation(item.participation, trip.travelers)}
                    isBundled={activeBundle?.addOnIds.has(item.id) ?? false}
                    isEditing={editingItemId === item.id}
                    participation={item.participation}
                    travelers={trip.travelers}
                    onUpdateParticipation={(p) => onUpdateAddOnParticipation(item.id, p)}
                    onSetEditing={(editing) => setEditingItemId(editing ? item.id : null)}
                    onRemove={() => onRemoveAddOn(item.id)}
                    kidsOnly={item.id === "kids-club"}
                  />
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted">No extras selected</p>
          )}

          {discount > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 flex justify-between text-sm">
              <span className="text-highlight font-medium">Bundle discount</span>
              <span className="text-highlight">−{formatCurrency(discount)}</span>
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

      <button className="mt-6 w-full rounded-lg bg-accent text-brand py-3.5 text-sm font-medium hover:bg-brand hover:text-white transition-colors">
        Reserve trip
      </button>
    </div>
  );
}
