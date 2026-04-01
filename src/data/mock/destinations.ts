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
    image: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80",
  },
  {
    id: "aspen",
    name: "Aspen",
    region: "Colorado",
    vibe: "mountains",
    shortDescription: "Snow-dusted peaks, cozy charm, and world-class slopes",
    heroLabel: "Alpine escape",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    id: "lake-tahoe",
    name: "Lake Tahoe",
    region: "California",
    vibe: "mountains",
    shortDescription: "Crystal water and pine-lined shores in the Sierra Nevada",
    heroLabel: "Lakeside retreat",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
  },

  // Desert
  {
    id: "joshua-tree",
    name: "Joshua Tree",
    region: "California",
    vibe: "desert",
    shortDescription: "Starry skies and wide-open desert near the national park",
    heroLabel: "Desert escape",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    id: "st-george",
    name: "St. George",
    region: "Utah",
    vibe: "desert",
    shortDescription: "Red rock canyons and desert warmth near Zion",
    heroLabel: "Canyon country",
    image: "https://images.unsplash.com/photo-1527549993586-dff825b37782?w=800&q=80",
  },

  {
    id: "palm-springs",
    name: "Palm Springs",
    region: "California",
    vibe: "desert",
    shortDescription: "Mid-century cool and sun-soaked desert vibes",
    heroLabel: "Desert oasis",
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80",
  },

  // Coast
  {
    id: "san-francisco",
    name: "San Francisco",
    region: "California",
    vibe: "coast",
    shortDescription: "Foggy shores, coastal trails, and iconic landmarks",
    heroLabel: "Coastal city",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
  },
  {
    id: "mendocino",
    name: "Mendocino",
    region: "California",
    vibe: "coast",
    shortDescription: "Rugged bluffs and quiet seaside charm on the north coast",
    heroLabel: "Seaside village",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    id: "seattle",
    name: "Seattle",
    region: "Washington",
    vibe: "coast",
    shortDescription: "Evergreen shores, coffee culture, and Pacific Northwest charm",
    heroLabel: "Pacific Northwest",
    image: "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=800&q=80",
  },
];
