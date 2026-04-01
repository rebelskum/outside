import type { Destination, Lodging, Activity, AddOn } from "../types/trip";
import { destinations } from "./mock/destinations";
import { lodgings } from "./mock/lodgings";
import { activities } from "./mock/activities";
import { addOns } from "./mock/addons";

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

export function getLodging(id: string): Lodging | undefined {
  return lodgings.find((l) => l.id === id);
}

export function getActivity(id: string): Activity | undefined {
  return activities.find((a) => a.id === id);
}

export function getAddOn(id: string): AddOn | undefined {
  return addOns.find((a) => a.id === id);
}

export function getActivitiesForDestination(destinationId: string): Activity[] {
  return activities.filter((a) => a.destinationId === destinationId);
}

export function getLodgingsForDestination(destinationId: string): Lodging[] {
  return lodgings.filter((l) => l.destinationId === destinationId);
}
