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

  // Dining — Park City
  {
    id: "pc-riverhorse",
    destinationId: "park-city",
    name: "Riverhorse on Main",
    shortDescription: "Upscale mountain dining on historic Main Street",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$"],
  },
  {
    id: "pc-handle",
    destinationId: "park-city",
    name: "Handle",
    shortDescription: "Farm-to-table small plates and craft cocktails",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$"],
  },

  // Dining — Aspen
  {
    id: "as-ajax",
    destinationId: "aspen",
    name: "Ajax Tavern",
    shortDescription: "Slopeside bistro with truffle fries and mountain views",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$"],
  },
  {
    id: "as-whitehouse",
    destinationId: "aspen",
    name: "The White House Tavern",
    shortDescription: "Historic cottage with seasonal American fare",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$"],
  },

  // Dining — Lake Tahoe
  {
    id: "lt-sunnyside",
    destinationId: "lake-tahoe",
    name: "Sunnyside Lodge",
    shortDescription: "Lakefront dining with sunset views",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$"],
  },
  {
    id: "lt-soule",
    destinationId: "lake-tahoe",
    name: "The Soule Domain",
    shortDescription: "Cozy cabin fine dining in the pines",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$"],
  },

  // Dining — Joshua Tree
  {
    id: "jt-lacopine",
    destinationId: "joshua-tree",
    name: "La Copine",
    shortDescription: "Desert brunch and dinner with a cult following",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$"],
  },
  {
    id: "jt-crossroads",
    destinationId: "joshua-tree",
    name: "Crossroads Café",
    shortDescription: "Laid-back spot with local beer and comfort food",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$"],
  },

  // Dining — St. George
  {
    id: "sg-painted-pony",
    destinationId: "st-george",
    name: "Painted Pony",
    shortDescription: "Southwest-inspired fine dining in Kayenta",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$"],
  },
  {
    id: "sg-xetava",
    destinationId: "st-george",
    name: "Xetava Gardens Café",
    shortDescription: "Garden patio dining with red rock views",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$"],
  },

  // Dining — Palm Springs
  {
    id: "ps-workshop",
    destinationId: "palm-springs",
    name: "Workshop Kitchen + Bar",
    shortDescription: "Industrial-chic space with seasonal craft menus",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$"],
  },
  {
    id: "ps-copleys",
    destinationId: "palm-springs",
    name: "Copley's on Palm Canyon",
    shortDescription: "Romantic garden setting in a former Cary Grant estate",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$$"],
  },

  // Dining — San Francisco
  {
    id: "sf-tartine",
    destinationId: "san-francisco",
    name: "Tartine Manufactory",
    shortDescription: "Iconic bakery-restaurant with seasonal menus",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$"],
  },
  {
    id: "sf-foreign-cinema",
    destinationId: "san-francisco",
    name: "Foreign Cinema",
    shortDescription: "Outdoor films and California-Mediterranean dishes",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$"],
  },

  // Dining — Mendocino
  {
    id: "mc-beaujolais",
    destinationId: "mendocino",
    name: "Café Beaujolais",
    shortDescription: "Mendocino's beloved farmhouse restaurant",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$"],
  },
  {
    id: "mc-ravens",
    destinationId: "mendocino",
    name: "Ravens Restaurant",
    shortDescription: "Garden-to-table vegetarian at the Stanford Inn",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$"],
  },

  // Dining — Seattle
  {
    id: "se-walrus",
    destinationId: "seattle",
    name: "The Walrus and the Carpenter",
    shortDescription: "Oyster bar and Pacific Northwest seafood",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$"],
  },
  {
    id: "se-canlis",
    destinationId: "seattle",
    name: "Canlis",
    shortDescription: "Iconic fine dining with sweeping lake views",
    price: 0,
    category: "Dining",
    tags: ["dinner", "reservation", "$$$$"],
  },
];
