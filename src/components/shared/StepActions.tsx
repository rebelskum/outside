interface StepActionsProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}

export function StepActions({ onBack, onNext, nextLabel = "Continue" }: StepActionsProps) {
  return (
    <div className="mt-10 flex justify-between">
      <button
        onClick={onBack}
        className="text-sm text-muted hover:text-brand transition-colors"
      >
        ← Back
      </button>
      <button
        onClick={onNext}
        className="rounded-lg bg-accent text-brand px-6 py-2.5 text-sm font-medium hover:bg-brand hover:text-white transition-colors"
      >
        {nextLabel}
      </button>
    </div>
  );
}
