import type { StepId } from "../../types/trip";
import { STEPS, STEP_ORDER } from "../../config/steps";

interface ProgressNavProps {
  currentStep: StepId;
  onStepClick: (step: StepId) => void;
}

export function ProgressNav({ currentStep, onStepClick }: ProgressNavProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <nav className="flex items-center gap-2 px-8 py-4">
      {STEPS.map((step, index) => {
        const isClickable = index < currentIndex;

        return (
          <div key={step.id} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={`relative text-sm pb-2 transition-colors ${
                index === currentIndex
                  ? "text-brand font-medium"
                  : index < currentIndex
                    ? "text-brand font-medium cursor-pointer hover:text-highlight"
                    : "text-muted cursor-default"
              }`}
            >
              {step.label}
              {index === currentIndex && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-highlight rounded-full" />
              )}
            </button>
            {index < STEPS.length - 1 && (
              <span className="text-border">·</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
