import { useState, useEffect } from "react";
import type { TripState, StepId, TravelerGroup, DateRange, Participation, SelectedItem } from "../types/trip";

const STEP_ORDER: StepId[] = ["destination", "stay", "activities", "extras", "review"];
const STORAGE_KEY = "outside-trip-state";

const initialState: TripState = {
  currentStep: "destination",
  selectedDestinationId: null,
  dateRange: { start: "Mar 14", end: "Mar 16" },
  travelers: { adults: 2, children: 0 },
  selectedLodgingId: null,
  selectedActivities: [],
  selectedAddOns: [],
};

function loadState(): TripState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as TripState;
  } catch { /* ignore corrupt data */ }
  return initialState;
}

function defaultParticipation(travelers: TravelerGroup): Participation {
  return { type: "everyone", adults: travelers.adults, kids: travelers.children };
}

function toggleItem(
  items: SelectedItem[],
  id: string,
  makeParticipation: () => Participation,
): SelectedItem[] {
  return items.some((a) => a.id === id)
    ? items.filter((a) => a.id !== id)
    : [...items, { id, participation: makeParticipation() }];
}

function updateItemParticipation(
  items: SelectedItem[],
  id: string,
  participation: Participation,
): SelectedItem[] {
  return items.map((a) => (a.id === id ? { ...a, participation } : a));
}

export function useTrip() {
  const [trip, setTrip] = useState<TripState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  const setDestination = (id: string) =>
    setTrip((prev) => {
      if (id === prev.selectedDestinationId) {
        return { ...prev, currentStep: "stay" };
      }
      return {
        ...prev,
        selectedDestinationId: id,
        selectedLodgingId: null,
        selectedActivities: [],
        selectedAddOns: [],
        currentStep: "stay",
      };
    });

  const needsDestinationChangeConfirmation = (newId: string) =>
    trip.selectedDestinationId !== null &&
    trip.selectedDestinationId !== newId &&
    (trip.selectedLodgingId !== null ||
      trip.selectedActivities.length > 0 ||
      trip.selectedAddOns.length > 0);

  const setLodging = (id: string) =>
    setTrip((prev) => ({ ...prev, selectedLodgingId: id }));

  const setTravelers = (travelers: TravelerGroup) =>
    setTrip((prev) => ({ ...prev, travelers }));

  const setDates = (dateRange: DateRange) =>
    setTrip((prev) => ({ ...prev, dateRange }));

  const toggleActivity = (id: string) =>
    setTrip((prev) => ({
      ...prev,
      selectedActivities: toggleItem(
        prev.selectedActivities, id, () => defaultParticipation(prev.travelers),
      ),
    }));

  const updateActivityParticipation = (id: string, participation: Participation) =>
    setTrip((prev) => ({
      ...prev,
      selectedActivities: updateItemParticipation(prev.selectedActivities, id, participation),
    }));

  const toggleAddOn = (id: string) =>
    setTrip((prev) => ({
      ...prev,
      selectedAddOns: toggleItem(prev.selectedAddOns, id, () =>
        id === "kids-club"
          ? { type: "partial" as const, adults: 0, kids: prev.travelers.children }
          : defaultParticipation(prev.travelers),
      ),
    }));

  const updateAddOnParticipation = (id: string, participation: Participation) =>
    setTrip((prev) => ({
      ...prev,
      selectedAddOns: updateItemParticipation(prev.selectedAddOns, id, participation),
    }));

  const goToStep = (step: StepId) =>
    setTrip((prev) => ({ ...prev, currentStep: step }));

  const nextStep = () =>
    setTrip((prev) => {
      const next = STEP_ORDER[STEP_ORDER.indexOf(prev.currentStep) + 1];
      return next ? { ...prev, currentStep: next } : prev;
    });

  const prevStep = () =>
    setTrip((prev) => {
      const previous = STEP_ORDER[STEP_ORDER.indexOf(prev.currentStep) - 1];
      return previous ? { ...prev, currentStep: previous } : prev;
    });

  return {
    trip,
    setDestination,
    needsDestinationChangeConfirmation,
    setLodging,
    setTravelers,
    setDates,
    toggleActivity,
    updateActivityParticipation,
    toggleAddOn,
    updateAddOnParticipation,
    goToStep,
    nextStep,
    prevStep,
  };
}
