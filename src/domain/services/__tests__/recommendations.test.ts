import { describe, it, expect } from "vitest";
import { getRecommendations } from "../recommendations";
import { makeTripState, selectedItem, hasRecommendation } from "../../../test/helpers";

describe("getRecommendations", () => {
  describe("trigger: activity_selected (ski)", () => {
    it("returns ski-bundle when a ski-tagged activity is selected at a mountain destination", () => {
      const recs = getRecommendations(makeTripState({
        selectedActivities: [selectedItem("pc-ski")],
      }));
      expect(hasRecommendation(recs, "ski-bundle")).toBe(true);
    });

    it("excludes ski-bundle at non-mountain destinations", () => {
      const recs = getRecommendations(makeTripState({
        selectedDestinationId: "joshua-tree",
        selectedActivities: [selectedItem("jt-hike")],
      }));
      expect(hasRecommendation(recs, "ski-bundle")).toBe(false);
    });
  });

  describe("trigger: has_children", () => {
    it("returns family-adventure when traveling with children", () => {
      const recs = getRecommendations(makeTripState({
        travelers: { adults: 2, children: 1 },
      }));
      expect(hasRecommendation(recs, "family-adventure")).toBe(true);
    });

    it("excludes family-adventure when there are no children", () => {
      const recs = getRecommendations(makeTripState());
      expect(hasRecommendation(recs, "family-adventure")).toBe(false);
    });
  });

  describe("trigger: addon_selected", () => {
    it("returns gear-and-guide when equipment-rental is selected", () => {
      const recs = getRecommendations(makeTripState({
        selectedAddOns: [selectedItem("equipment-rental")],
      }));
      expect(hasRecommendation(recs, "gear-and-guide")).toBe(true);
    });
  });

  describe("trigger: destination_vibe", () => {
    it("returns breakfast-adventure at desert destinations with an activity", () => {
      const recs = getRecommendations(makeTripState({
        selectedDestinationId: "joshua-tree",
        selectedActivities: [selectedItem("jt-hike")],
      }));
      expect(hasRecommendation(recs, "breakfast-adventure")).toBe(true);
    });

    it("excludes breakfast-adventure at mountain destinations", () => {
      const recs = getRecommendations(makeTripState({
        selectedActivities: [selectedItem("pc-ski")],
      }));
      expect(hasRecommendation(recs, "breakfast-adventure")).toBe(false);
    });
  });

  it("returns no recommendations when selections have no matching triggers", () => {
    const recs = getRecommendations(makeTripState({
      selectedActivities: [selectedItem("pc-snowshoe")],
    }));
    expect(recs).toHaveLength(0);
  });

  it("returns stable recommendation shape including title and savings", () => {
    const recs = getRecommendations(makeTripState({
      selectedActivities: [selectedItem("pc-ski")],
    }));
    const ski = recs.find((r) => r.id === "ski-bundle");
    expect(ski).toMatchObject({
      id: "ski-bundle",
      title: "Ski Day Bundle",
      savings: 40,
    });
  });

  it("is deterministic — same input produces same output", () => {
    const trip = makeTripState({
      travelers: { adults: 2, children: 1 },
      selectedActivities: [selectedItem("pc-ski")],
    });
    expect(getRecommendations(trip)).toEqual(getRecommendations(trip));
  });
});
