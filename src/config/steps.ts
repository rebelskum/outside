import type { StepId } from "../types/trip";

export const STEPS: { id: StepId; label: string }[] = [
  { id: "destination", label: "Destination" },
  { id: "stay", label: "Stay" },
  { id: "activities", label: "Activities" },
  { id: "extras", label: "Extras" },
  { id: "review", label: "Review" },
];

export const STEP_ORDER = STEPS.map((step) => step.id);
