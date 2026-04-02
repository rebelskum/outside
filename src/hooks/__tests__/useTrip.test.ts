import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTrip } from "../useTrip";
import { findItem } from "../../test/helpers";

describe("useTrip", () => {
  describe("destination change resets downstream state", () => {
    it("clears lodging, activities, addons, and seenRecommendationIds", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setDestination("park-city"));
      act(() => result.current.setLodging("pc-cabin"));
      act(() => result.current.toggleActivity("pc-ski"));
      act(() => result.current.toggleAddOn("breakfast"));
      act(() => result.current.markRecommendationSeen("ski-bundle"));

      expect(result.current.trip.selectedLodgingId).toBe("pc-cabin");
      expect(findItem(result.current.trip.selectedActivities, "pc-ski")).toBeDefined();
      expect(findItem(result.current.trip.selectedAddOns, "breakfast")).toBeDefined();
      expect(result.current.trip.seenRecommendationIds).toContain("ski-bundle");

      act(() => result.current.setDestination("aspen"));

      expect(result.current.trip.selectedDestinationId).toBe("aspen");
      expect(result.current.trip.selectedLodgingId).toBeNull();
      expect(result.current.trip.selectedActivities).toEqual([]);
      expect(result.current.trip.selectedAddOns).toEqual([]);
      expect(result.current.trip.seenRecommendationIds).toEqual([]);
    });

    it("preserves dateRange and travelers across destination changes", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setDestination("park-city"));
      act(() => result.current.setDates({ start: "Apr 1", end: "Apr 4" }));
      act(() => result.current.setTravelers({ adults: 3, children: 1 }));

      act(() => result.current.setDestination("aspen"));

      expect(result.current.trip.dateRange).toEqual({ start: "Apr 1", end: "Apr 4" });
      expect(result.current.trip.travelers).toEqual({ adults: 3, children: 1 });
    });

    it("keeps all selections intact when re-selecting the same destination", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setDestination("park-city"));
      act(() => result.current.setLodging("pc-cabin"));
      act(() => result.current.toggleActivity("pc-ski"));
      act(() => result.current.toggleAddOn("breakfast"));
      act(() => result.current.markRecommendationSeen("ski-bundle"));

      act(() => result.current.setDestination("park-city"));

      expect(result.current.trip.selectedLodgingId).toBe("pc-cabin");
      expect(findItem(result.current.trip.selectedActivities, "pc-ski")).toBeDefined();
      expect(findItem(result.current.trip.selectedAddOns, "breakfast")).toBeDefined();
      expect(result.current.trip.seenRecommendationIds).toContain("ski-bundle");
    });
  });

  describe("participation", () => {
    it("defaults to 'everyone' participation matching current travelers", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setDestination("park-city"));
      act(() => result.current.toggleActivity("pc-ski"));

      const item = findItem(result.current.trip.selectedActivities, "pc-ski");
      expect(item?.participation).toEqual({ type: "everyone", adults: 2, kids: 0 });
    });

    it("updates participation on a selected activity", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setDestination("park-city"));
      act(() => result.current.toggleActivity("pc-ski"));
      act(() =>
        result.current.updateActivityParticipation("pc-ski", {
          type: "partial", adults: 1, kids: 0,
        }),
      );

      const item = findItem(result.current.trip.selectedActivities, "pc-ski");
      expect(item?.participation).toEqual({ type: "partial", adults: 1, kids: 0 });
    });

    it("is a no-op when updating participation on an unselected activity", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setDestination("park-city"));
      act(() => result.current.toggleActivity("pc-ski"));

      const before = result.current.trip.selectedActivities;

      act(() =>
        result.current.updateActivityParticipation("pc-hike", {
          type: "partial", adults: 1, kids: 0,
        }),
      );

      expect(result.current.trip.selectedActivities).toEqual(before);
    });

    it("defaults kids-club add-on to kids-only participation", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setTravelers({ adults: 2, children: 2 }));
      act(() => result.current.setDestination("park-city"));
      act(() => result.current.toggleAddOn("kids-club"));

      const item = findItem(result.current.trip.selectedAddOns, "kids-club");
      expect(item?.participation).toEqual({ type: "partial", adults: 0, kids: 2 });
    });

    it("clamps partial participation when traveler count is reduced", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setTravelers({ adults: 3, children: 2 }));
      act(() => result.current.setDestination("park-city"));
      act(() => result.current.toggleActivity("pc-ski"));
      act(() =>
        result.current.updateActivityParticipation("pc-ski", {
          type: "partial", adults: 3, kids: 2,
        }),
      );

      act(() => result.current.setTravelers({ adults: 1, children: 1 }));

      const item = findItem(result.current.trip.selectedActivities, "pc-ski");
      expect(item?.participation).toEqual({ type: "partial", adults: 1, kids: 1 });
    });

    it("clamps partial participation to 0 kids when children are removed", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setTravelers({ adults: 2, children: 2 }));
      act(() => result.current.setDestination("park-city"));
      act(() => result.current.toggleActivity("pc-ski"));
      act(() =>
        result.current.updateActivityParticipation("pc-ski", {
          type: "partial", adults: 1, kids: 2,
        }),
      );

      act(() => result.current.setTravelers({ adults: 2, children: 0 }));

      const item = findItem(result.current.trip.selectedActivities, "pc-ski");
      expect(item?.participation).toEqual({ type: "partial", adults: 1, kids: 0 });
    });

    it("removes kids-club add-on when children count drops to 0", () => {
      const { result } = renderHook(() => useTrip());

      act(() => result.current.setTravelers({ adults: 2, children: 2 }));
      act(() => result.current.setDestination("park-city"));
      act(() => result.current.toggleAddOn("kids-club"));
      expect(findItem(result.current.trip.selectedAddOns, "kids-club")).toBeDefined();

      act(() => result.current.setTravelers({ adults: 2, children: 0 }));
      expect(findItem(result.current.trip.selectedAddOns, "kids-club")).toBeUndefined();
    });
  });
});
