interface StepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Stepper({ label, value, onChange, min, max }: StepperProps) {
  const atMin = min !== undefined && value <= min;
  const atMax = max !== undefined && value >= max;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(value - 1)}
          disabled={atMin}
          className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors disabled:opacity-30 disabled:hover:border-border"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-medium">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          disabled={atMax}
          className="h-7 w-7 rounded-full border border-border text-sm hover:border-brand/30 transition-colors disabled:opacity-30 disabled:hover:border-border"
        >
          +
        </button>
      </div>
    </div>
  );
}
