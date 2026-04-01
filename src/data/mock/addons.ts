import type { AddOn } from "../../types/trip";

export const addOns: AddOn[] = [
  {
    id: "breakfast",
    destinationId: null,
    name: "Breakfast Package",
    shortDescription: "Daily breakfast for all guests",
    price: 25,
    category: "Dining",
    tags: ["food", "morning"],
  },
  {
    id: "equipment-rental",
    destinationId: null,
    name: "Equipment Rental",
    shortDescription: "Ski or snowboard gear for the weekend",
    price: 60,
    category: "Gear",
    tags: ["ski", "snowboard", "rental"],
  },
  {
    id: "kids-club",
    destinationId: null,
    name: "Kids Club",
    shortDescription: "Half-day supervised activities for children",
    price: 45,
    category: "Family",
    tags: ["kids", "family", "childcare"],
  },
  {
    id: "grocery-delivery",
    destinationId: null,
    name: "Grocery Delivery",
    shortDescription: "Stock your kitchen before you arrive",
    price: 35,
    category: "Convenience",
    tags: ["groceries", "convenience"],
  },
];
