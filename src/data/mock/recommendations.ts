import type { Recommendation } from "../../types/trip";

export const recommendations: Recommendation[] = [
  {
    id: "ski-bundle",
    name: "Ski Day Bundle",
    description: "Lift tickets, rentals, and a lesson — a simple way to plan one full day on the mountain",
    triggerType: "activity_selected",
    triggerValue: "ski",
    suggestedActivityIds: [],
    suggestedAddOnIds: ["equipment-rental"],
    bundlePrice: 165,
    savings: 40,
  },
  {
    id: "family-adventure",
    name: "Family Adventure Pack",
    description: "Kids Club plus family-friendly activities to make the weekend easy for everyone",
    triggerType: "has_children",
    triggerValue: null,
    suggestedActivityIds: [],
    suggestedAddOnIds: ["kids-club"],
    bundlePrice: null,
    savings: 15,
  },
  {
    id: "gear-and-guide",
    name: "Gear + Guide",
    description: "Already renting gear? Add a guided tour or lesson to get the most out of it",
    triggerType: "addon_selected",
    triggerValue: "equipment-rental",
    suggestedActivityIds: [],
    suggestedAddOnIds: [],
    bundlePrice: null,
    savings: 20,
  },
];
