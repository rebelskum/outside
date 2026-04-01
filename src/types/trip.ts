export type StepId = "destination" | "stay" | "activities" | "extras" | "review";

export type Vibe = "mountains" | "desert" | "coast";

export interface Destination {
  id: string;
  name: string;
  region: string;
  vibe: Vibe;
  shortDescription: string;
  heroLabel: string;
  image: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface TravelerGroup {
  adults: number;
  children: number;
}

export interface Lodging {
  id: string;
  destinationId: string;
  name: string;
  shortDescription: string;
  locationLabel: string;
  nightlyRate: number;
  maxGuests: number;
  amenities: string[];
  image: string;
  mapPosition: { x: number; y: number };
}

export interface Activity {
  id: string;
  destinationId: string;
  name: string;
  shortDescription: string;
  price: number;
  duration: string;
  tags: string[];
  category: string;
}

export interface AddOn {
  id: string;
  destinationId: string | null;
  name: string;
  shortDescription: string;
  price: number;
  perPerson: boolean;
  category: string;
  tags: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  trigger: {
    type: "activity_selected" | "has_children" | "addon_selected";
    value: string | null;
  };
  activityIds: string[];
  addOnIds: string[];
  bundlePrice: number | null;
  savings: number;
}

export type ParticipationType = "everyone" | "partial";

export interface Participation {
  type: ParticipationType;
  adults: number;
  kids: number;
}

export interface SelectedItem {
  id: string;
  participation: Participation;
}

export interface TripState {
  currentStep: StepId;
  selectedDestinationId: string | null;
  dateRange: DateRange;
  travelers: TravelerGroup;
  selectedLodgingId: string | null;
  selectedActivities: SelectedItem[];
  selectedAddOns: SelectedItem[];
  seenRecommendationIds: string[];
}
