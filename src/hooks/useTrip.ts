import { useState, useEffect } from "react";
import type { TripState, StepId, TravelerGroup, DateRange, Participation, SelectedItem } from "../types/trip";
import { STEP_ORDER } from "../config/steps";
import { KIDS_CLUB_ID } from "../domain/constants";

const STORAGE_KEY = "outside-trip-state";

const initialState: TripState = {
  currentStep: "destination",
  selectedDestinationId: null,
  dateRange: { start: "Mar 14", end: "Mar 16" },
  travelers: { adults: 2, children: 0 },
  selectedLodgingId: null,
  selectedActivities: [],
  selectedAddOns: [],
  seenRecommendationIds: [],
};

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

function clampParticipation(p: Participation, travelers: TravelerGroup): Participation {
  if (p.type === "everyone") {
    return { type: "everyone", adults: travelers.adults, kids: travelers.children };
  }
  return {
    type: "partial",
    adults: Math.min(p.adults, travelers.adults),
    kids: Math.min(p.kids, travelers.children),
  };
}

function normalizeItemsForTravelers(
  items: SelectedItem[],
  travelers: TravelerGroup,
): SelectedItem[] {
  return items.map((item) => ({
    ...item,
    participation: clampParticipation(item.participation, travelers),
  }));
}

function loadState(): TripState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...initialState, ...JSON.parse(stored) } as TripState;
    }
  } catch { /* ignore corrupt data */ }
  return initialState;
}

export function useTrip() {
  const [trip, setTrip] = useState<TripState>(loadState);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
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
        seenRecommendationIds: [],
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
    setTrip((prev) => {
      let addOns = normalizeItemsForTravelers(prev.selectedAddOns, travelers);
      if (travelers.children === 0) {
        addOns = addOns.filter((item) => item.id !== KIDS_CLUB_ID);
      }
      return {
        ...prev,
        travelers,
        selectedActivities: normalizeItemsForTravelers(prev.selectedActivities, travelers),
        selectedAddOns: addOns,
      };
    });

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
        id === KIDS_CLUB_ID
          ? { type: "partial" as const, adults: 0, kids: prev.travelers.children }
          : defaultParticipation(prev.travelers),
      ),
    }));

  const updateAddOnParticipation = (id: string, participation: Participation) =>
    setTrip((prev) => ({
      ...prev,
      selectedAddOns: updateItemParticipation(prev.selectedAddOns, id, participation),
    }));

  const markRecommendationSeen = (id: string) =>
    setTrip((prev) =>
      prev.seenRecommendationIds.includes(id)
        ? prev
        : { ...prev, seenRecommendationIds: [...prev.seenRecommendationIds, id] },
    );

  const canAdvancePast = (step: StepId, state: TripState): boolean => {
    if (step === "stay" && !state.selectedLodgingId) return false;
    return true;
  };

  const goToStep = (step: StepId) =>
    setTrip((prev) => {
      const targetIdx = STEP_ORDER.indexOf(step);
      const currentIdx = STEP_ORDER.indexOf(prev.currentStep);
      if (targetIdx > currentIdx && !canAdvancePast(prev.currentStep, prev)) return prev;
      return { ...prev, currentStep: step };
    });

  const nextStep = () =>
    setTrip((prev) => {
      if (!canAdvancePast(prev.currentStep, prev)) return prev;
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
    markRecommendationSeen,
    goToStep,
    nextStep,
    prevStep,
  };
}
