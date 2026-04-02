import { describe, it, expect } from "vitest";
import { calculateTotal, getBundleDiscount } from "../pricing";
import { getNights } from "../../../utils/format";
import { makeTripState, selectedItem } from "../../../test/helpers";

describe("getNights", () => {
  it("calculates nights between two dates", () => {
    expect(getNights({ start: "Mar 14", end: "Mar 16" })).toBe(2);
    expect(getNights({ start: "Mar 14", end: "Mar 15" })).toBe(1);
    expect(getNights({ start: "Mar 14", end: "Mar 17" })).toBe(3);
  });

  it("returns at least 1 for same-day range", () => {
    expect(getNights({ start: "Mar 14", end: "Mar 14" })).toBe(1);
  });
});

describe("calculateTotal", () => {
  it("returns 0 when nothing is selected", () => {
    expect(calculateTotal(makeTripState())).toBe(0);
  });

  it("calculates lodging as nightly rate × nights", () => {
    // pc-cabin: $240/night × 2 nights
    expect(calculateTotal(makeTripState({ selectedLodgingId: "pc-cabin" }))).toBe(480);
  });

  it("scales lodging cost with longer stays", () => {
    // pc-cabin: $240/night × 3 nights
    const trip = makeTripState({
      selectedLodgingId: "pc-cabin",
      dateRange: { start: "Mar 14", end: "Mar 17" },
    });
    expect(calculateTotal(trip)).toBe(720);
  });

  it("prices activities per participant", () => {
    // pc-ski: $120/person × 2 adults
    const trip = makeTripState({
      selectedActivities: [selectedItem("pc-ski")],
    });
    expect(calculateTotal(trip)).toBe(240);
  });

  it("sums multiple activities", () => {
    // pc-ski $120 + pc-snowshoe $45 = $165/person × 2
    const trip = makeTripState({
      selectedActivities: [selectedItem("pc-ski"), selectedItem("pc-snowshoe")],
    });
    expect(calculateTotal(trip)).toBe(330);
  });

  it("respects partial participation for activities", () => {
    // pc-ski: $120 × 1 person
    const trip = makeTripState({
      selectedActivities: [
        selectedItem("pc-ski", { type: "partial", adults: 1, kids: 0 }),
      ],
    });
    expect(calculateTotal(trip)).toBe(120);
  });

  it("prices per-person add-ons by participant count", () => {
    // equipment-rental: $60/person × 2 (non-mountain to avoid bundle)
    const trip = makeTripState({
      selectedDestinationId: "joshua-tree",
      selectedAddOns: [selectedItem("equipment-rental")],
    });
    expect(calculateTotal(trip)).toBe(120);
  });

  it("prices flat-rate add-ons regardless of group size", () => {
    // grocery-delivery: $35 flat
    const trip = makeTripState({
      selectedAddOns: [selectedItem("grocery-delivery")],
    });
    expect(calculateTotal(trip)).toBe(35);
  });

  it("sums lodging + activities + add-ons for a full trip", () => {
    // pc-cabin: $240 × 2 = $480
    // pc-snowshoe: $45 × 2 = $90
    // grocery-delivery: $35 flat
    // total = $605
    const trip = makeTripState({
      selectedLodgingId: "pc-cabin",
      selectedActivities: [selectedItem("pc-snowshoe")],
      selectedAddOns: [selectedItem("grocery-delivery")],
    });
    expect(calculateTotal(trip)).toBe(605);
  });
});

describe("getBundleDiscount", () => {
  it("returns 0 when no bundle conditions are met", () => {
    expect(getBundleDiscount(makeTripState())).toBe(0);
  });

  it("applies ski bundle savings per participant when all items are present", () => {
    // ski-bundle: pc-ski + pc-lesson + equipment-rental → $40/person × 2
    const trip = makeTripState({
      selectedActivities: [selectedItem("pc-ski"), selectedItem("pc-lesson")],
      selectedAddOns: [selectedItem("equipment-rental")],
    });
    expect(getBundleDiscount(trip)).toBe(80);
  });

  it("subtracts bundle discount from the trip total", () => {
    // pc-ski: $120×2 + pc-lesson: $85×2 + equipment-rental: $60×2 = $530
    // discount: $40×2 = $80 → total = $450
    const trip = makeTripState({
      selectedActivities: [selectedItem("pc-ski"), selectedItem("pc-lesson")],
      selectedAddOns: [selectedItem("equipment-rental")],
    });
    expect(calculateTotal(trip)).toBe(450);
  });

  it("applies family bundle savings based on first matching item's participation", () => {
    // family-adventure: kids-club + breakfast → $15/person
    // kids-club has 1 kid → discount based on 1 participant = $15
    const trip = makeTripState({
      travelers: { adults: 2, children: 1 },
      selectedAddOns: [
        selectedItem("kids-club", { type: "partial", adults: 0, kids: 1 }),
        selectedItem("breakfast", { type: "everyone", adults: 2, kids: 1 }),
      ],
    });
    expect(getBundleDiscount(trip)).toBe(15);
  });

  it("scales discount with participation count", () => {
    // ski-bundle with 1 partial participant → $40 × 1 = $40
    const trip = makeTripState({
      selectedActivities: [
        selectedItem("pc-ski", { type: "partial", adults: 1, kids: 0 }),
        selectedItem("pc-lesson", { type: "partial", adults: 1, kids: 0 }),
      ],
      selectedAddOns: [selectedItem("equipment-rental")],
    });
    expect(getBundleDiscount(trip)).toBe(40);
  });
});
