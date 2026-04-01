import type { Recommendation } from "../../types/trip";

export const recommendations: Recommendation[] = [
  {
    id: "ski-bundle",
    title: "Ski Day Bundle",
    reason: "You added ski tickets — bundle with gear and a lesson to save on a full day",
    trigger: { type: "activity_selected", value: "ski" },
    activityIds: ["pc-ski", "as-ski", "lt-ski", "pc-lesson", "as-lesson", "lt-lesson"],
    addOnIds: ["equipment-rental"],
    bundlePrice: 165,
    savings: 40,
  },
  {
    id: "family-adventure",
    title: "Family Adventure Pack",
    reason: "Traveling with kids? Kids Club makes it easy to split up the day",
    trigger: { type: "has_children", value: null },
    activityIds: [],
    addOnIds: ["kids-club"],
    bundlePrice: null,
    savings: 15,
  },
  {
    id: "gear-and-guide",
    title: "Gear + Guide",
    reason: "Already renting gear? A guided tour helps you get the most out of it",
    trigger: { type: "addon_selected", value: "equipment-rental" },
    activityIds: ["pc-hike", "as-snowmobile", "lt-hike"],
    addOnIds: [],
    bundlePrice: null,
    savings: 20,
  },
];
