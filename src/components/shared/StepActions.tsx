interface StepActionsProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextDisabledTooltip?: string;
}

export function StepActions({ onBack, onNext, nextLabel = "Continue", nextDisabled, nextDisabledTooltip }: StepActionsProps) {
  return (
    <div className="mt-10 flex justify-between">
      <button
        onClick={onBack}
        className="text-sm text-muted hover:text-brand transition-colors"
      >
        ← Back
      </button>
      <div className="relative group">
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
        {nextDisabled && nextDisabledTooltip && (
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-white shadow-lg">
            {nextDisabledTooltip}
          </span>
        )}
      </div>
    </div>
  );
}
