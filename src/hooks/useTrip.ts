import { useState } from "react";
import type { TripState, StepId, TravelerGroup, DateRange } from "../types/trip";

const STEP_ORDER: StepId[] = ["destination", "stay", "activities", "extras", "review"];

const initialState: TripState = {
  currentStep: "destination",
  selectedDestinationId: null,
  dateRange: { start: "Mar 14", end: "Mar 16" },
  travelers: { adults: 2, children: 0 },
  selectedLodgingId: null,
  selectedActivityIds: [],
  selectedAddOnIds: [],
};

export function useTrip() {
  const [trip, setTrip] = useState<TripState>(initialState);

  const hasDownstreamSelections = (state: TripState) =>
    state.selectedLodgingId !== null ||
    state.selectedActivityIds.length > 0 ||
    state.selectedAddOnIds.length > 0;

  const setDestination = (id: string) =>
    setTrip((prev) => {
      if (id === prev.selectedDestinationId) {
        return { ...prev, currentStep: "stay" };
      }
      return {
        ...prev,
        selectedDestinationId: id,
        selectedLodgingId: null,
        selectedActivityIds: [],
        selectedAddOnIds: [],
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
    setTrip((prev) => ({
      ...prev,
      selectedActivityIds: prev.selectedActivityIds.includes(id)
        ? prev.selectedActivityIds.filter((a) => a !== id)
        : [...prev.selectedActivityIds, id],
    }));

  const toggleAddOn = (id: string) =>
    setTrip((prev) => ({
      ...prev,
      selectedAddOnIds: prev.selectedAddOnIds.includes(id)
        ? prev.selectedAddOnIds.filter((a) => a !== id)
        : [...prev.selectedAddOnIds, id],
    }));

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
    setDestination,
    needsDestinationChangeConfirmation,
    setLodging,
    setTravelers,
    setDates,
    toggleActivity,
    toggleAddOn,
    goToStep,
    nextStep,
    prevStep,
  };
}
