import type { TripState, SelectedItem, Participation, Recommendation } from "../types/trip";

const DEFAULT_PARTICIPATION: Participation = {
  type: "everyone",
  adults: 2,
  kids: 0,
};

export function makeTripState(overrides: Partial<TripState> = {}): TripState {
  return {
    currentStep: "activities",
    selectedDestinationId: "park-city",
    dateRange: { start: "Mar 14", end: "Mar 16" },
    travelers: { adults: 2, children: 0 },
    selectedLodgingId: null,
    selectedActivities: [],
    selectedAddOns: [],
    seenRecommendationIds: [],
    ...overrides,
  };
}

export function selectedItem(id: string, participation?: Partial<Participation>): SelectedItem {
  return { id, participation: { ...DEFAULT_PARTICIPATION, ...participation } };
}

export function findItem(items: SelectedItem[], id: string): SelectedItem | undefined {
  return items.find((item) => item.id === id);
}

export function hasRecommendation(recs: Recommendation[], id: string): boolean {
  return recs.some((r) => r.id === id);
}
