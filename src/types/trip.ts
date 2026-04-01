export type StepId = "destination" | "stay" | "activities" | "extras" | "review";

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  vibe: "mountains" | "desert" | "lake";
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
  nightlyRate: number;
  maxGuests: number;
  amenities: string[];
  image: string;
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
  category: string;
  tags: string[];
}

export interface Recommendation {
  id: string;
  name: string;
  description: string;
  triggerType: "activity_selected" | "has_children" | "addon_selected";
  triggerValue: string | null;
  suggestedActivityIds: string[];
  suggestedAddOnIds: string[];
  bundlePrice: number | null;
  savings: number;
}

export interface TripState {
  currentStep: StepId;
  selectedDestinationId: string | null;
  dateRange: DateRange;
  travelers: TravelerGroup;
  selectedLodgingId: string | null;
  selectedActivityIds: string[];
  selectedAddOnIds: string[];
}
