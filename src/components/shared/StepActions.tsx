interface StepActionsProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export function StepActions({ onBack, onNext, nextLabel = "Continue", nextDisabled }: StepActionsProps) {
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
        disabled={nextDisabled}
        className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
          nextDisabled
            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
            : "bg-accent text-brand hover:bg-brand hover:text-white"
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
}
