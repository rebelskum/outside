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

export function useTrip() {
  const [trip, setTrip] = useState<TripState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  const hasDownstreamSelections = (state: TripState) =>
    state.selectedLodgingId !== null ||
    state.selectedActivities.length > 0 ||
    state.selectedAddOns.length > 0;

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
    hasDownstreamSelections(trip);

  const setLodging = (id: string) =>
    setTrip((prev) => ({ ...prev, selectedLodgingId: id }));

  const setTravelers = (travelers: TravelerGroup) =>
    setTrip((prev) => ({ ...prev, travelers }));

  const setDates = (dateRange: DateRange) =>
    setTrip((prev) => ({ ...prev, dateRange }));

  const toggleActivity = (id: string) =>
    setTrip((prev) => {
      const exists = prev.selectedActivities.find((a) => a.id === id);
      return {
        ...prev,
        selectedActivities: exists
          ? prev.selectedActivities.filter((a) => a.id !== id)
          : [...prev.selectedActivities, { id, participation: defaultParticipation(prev.travelers) }],
      };
    });

  const updateActivityParticipation = (id: string, participation: Participation) =>
    setTrip((prev) => ({
      ...prev,
      selectedActivities: prev.selectedActivities.map((a) =>
        a.id === id ? { ...a, participation } : a
      ),
    }));

  const toggleAddOn = (id: string) =>
    setTrip((prev) => {
      const exists = prev.selectedAddOns.find((a) => a.id === id);
      const participation =
        id === "kids-club"
          ? { type: "partial" as const, adults: 0, kids: prev.travelers.children }
          : defaultParticipation(prev.travelers);
      return {
        ...prev,
        selectedAddOns: exists
          ? prev.selectedAddOns.filter((a) => a.id !== id)
          : [...prev.selectedAddOns, { id, participation }],
      };
    });

  const updateAddOnParticipation = (id: string, participation: Participation) =>
    setTrip((prev) => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.map((a) =>
        a.id === id ? { ...a, participation } : a
      ),
    }));

  const selectedActivityIds = trip.selectedActivities.map((a) => a.id);
  const selectedAddOnIds = trip.selectedAddOns.map((a) => a.id);

  const findActivity = (id: string): SelectedItem | undefined =>
    trip.selectedActivities.find((a) => a.id === id);

  const findAddOn = (id: string): SelectedItem | undefined =>
    trip.selectedAddOns.find((a) => a.id === id);

  const goToStep = (step: StepId) =>
    setTrip((prev) => ({ ...prev, currentStep: step }));

  const nextStep = () =>
    setTrip((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.currentStep);
      const next = STEP_ORDER[currentIndex + 1];
      return next ? { ...prev, currentStep: next } : prev;
    });

  const prevStep = () =>
    setTrip((prev) => {
      const currentIndex = STEP_ORDER.indexOf(prev.currentStep);
      const previous = STEP_ORDER[currentIndex - 1];
      return previous ? { ...prev, currentStep: previous } : prev;
    });

  return {
    trip,
    selectedActivityIds,
    selectedAddOnIds,
    findActivity,
    findAddOn,
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
