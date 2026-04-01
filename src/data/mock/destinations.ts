import type { Destination } from "../../types/trip";

export const destinations: Destination[] = [
  // Mountains
  {
    id: "park-city",
    name: "Park City",
    region: "Utah",
    vibe: "mountains",
    shortDescription: "Mountain air and alpine trails just outside Salt Lake City",
    heroLabel: "Mountain getaway",
    image: "/images/destinations/park-city.jpg",
  },
  {
    id: "aspen",
    name: "Aspen",
    region: "Colorado",
    vibe: "mountains",
    shortDescription: "Snow-dusted peaks, cozy charm, and world-class slopes",
    heroLabel: "Alpine escape",
    image: "/images/destinations/aspen.jpg",
  },
  {
    id: "lake-tahoe",
    name: "Lake Tahoe",
    region: "California",
    vibe: "mountains",
    shortDescription: "Crystal water and pine-lined shores in the Sierra Nevada",
    heroLabel: "Lakeside retreat",
    image: "/images/destinations/lake-tahoe.jpg",
  },

  // Desert
  {
    id: "joshua-tree",
    name: "Joshua Tree",
    region: "California",
    vibe: "desert",
    shortDescription: "Starry skies and wide-open desert near the national park",
    heroLabel: "Desert escape",
    image: "/images/destinations/joshua-tree.jpg",
  },
  {
    id: "st-george",
    name: "St. George",
    region: "Utah",
    vibe: "desert",
    shortDescription: "Red rock canyons and desert warmth near Zion",
    heroLabel: "Canyon country",
    image: "/images/destinations/st-george.jpg",
  },

  {
    id: "palm-springs",
    name: "Palm Springs",
    region: "California",
    vibe: "desert",
    shortDescription: "Mid-century cool and sun-soaked desert vibes",
    heroLabel: "Desert oasis",
    image: "/images/destinations/palm-springs.jpg",
  },

  // Coast
  {
    id: "san-francisco",
    name: "San Francisco",
    region: "California",
    vibe: "coast",
    shortDescription: "Foggy shores, coastal trails, and iconic landmarks",
    heroLabel: "Coastal city",
    image: "/images/destinations/san-francisco.jpg",
  },
  {
    id: "mendocino",
    name: "Mendocino",
    region: "California",
    vibe: "coast",
    shortDescription: "Rugged bluffs and quiet seaside charm on the north coast",
    heroLabel: "Seaside village",
    image: "/images/destinations/mendocino.jpg",
  },
  {
    id: "seattle",
    name: "Seattle",
    region: "Washington",
    vibe: "coast",
    shortDescription: "Evergreen shores, coffee culture, and Pacific Northwest charm",
    heroLabel: "Pacific Northwest",
    image: "/images/destinations/seattle.jpg",
  },
];
