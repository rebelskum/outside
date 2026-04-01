import type { StepId } from "../../types/trip";

const STEPS: { id: StepId; label: string }[] = [
  { id: "destination", label: "Destination" },
  { id: "stay", label: "Stay" },
  { id: "activities", label: "Activities" },
  { id: "extras", label: "Extras" },
  { id: "review", label: "Review" },
];

const STEP_ORDER: StepId[] = STEPS.map((s) => s.id);

interface ProgressNavProps {
  currentStep: StepId;
}

export function ProgressNav({ currentStep }: ProgressNavProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <nav className="flex items-center gap-2 px-8 py-4">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <span
            className={`text-sm ${
              index <= currentIndex ? "text-brand font-medium" : "text-muted"
            }`}
          >
            {step.label}
          </span>
          {index < STEPS.length - 1 && (
            <span className="text-border">·</span>
          )}
        </div>
      ))}
    </nav>
  );
}
