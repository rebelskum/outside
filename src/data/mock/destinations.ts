import type { Destination } from "../../types/trip";

export const destinations: Destination[] = [
  // Mountains
  {
    id: "park-city",
    name: "Park City",
    region: "Utah",
    shortDescription: "Mountain air and alpine trails just outside Salt Lake City",
    heroLabel: "Mountain getaway",
    image: "/images/destinations/park-city.jpg",
  },
  {
    id: "aspen",
    name: "Aspen",
    region: "Colorado",
    shortDescription: "Snow-dusted peaks, cozy charm, and world-class slopes",
    heroLabel: "Alpine escape",
    image: "/images/destinations/aspen.jpg",
  },
  {
    id: "lake-tahoe",
    name: "Lake Tahoe",
    region: "California",
    shortDescription: "Crystal water and pine-lined shores in the Sierra Nevada",
    heroLabel: "Lakeside retreat",
    image: "/images/destinations/lake-tahoe.jpg",
  },

  // Desert
  {
    id: "joshua-tree",
    name: "Joshua Tree",
    region: "California",
    shortDescription: "Starry skies and wide-open desert near the national park",
    heroLabel: "Desert escape",
    image: "/images/destinations/joshua-tree.jpg",
  },
  {
    id: "st-george",
    name: "St. George",
    region: "Utah",
    shortDescription: "Red rock canyons and desert warmth near Zion",
    heroLabel: "Canyon country",
    image: "/images/destinations/st-george.jpg",
  },

  // Coast
  {
    id: "san-francisco",
    name: "San Francisco",
    region: "California",
    shortDescription: "Foggy shores, coastal trails, and iconic landmarks",
    heroLabel: "Coastal city",
    image: "/images/destinations/san-francisco.jpg",
  },
  {
    id: "mendocino",
    name: "Mendocino",
    region: "California",
    shortDescription: "Rugged bluffs and quiet seaside charm on the north coast",
    heroLabel: "Seaside village",
    image: "/images/destinations/mendocino.jpg",
  },
];
