import type { Lodging } from "../../types/trip";

interface StayMapProps {
  lodgings: Lodging[];
  highlightedId: string | null;
  onPinClick: (lodgingId: string) => void;
  onPinHover?: (lodgingId: string | null) => void;
}

export function StayMap({ lodgings, highlightedId, onPinClick, onPinHover }: StayMapProps) {
  return (
    <div className="relative w-full h-48 rounded-xl bg-[#f0eeeb] border border-border overflow-hidden select-none">
      {/* Stylized terrain lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 70 Q20 60 40 68 T80 62 T100 66"
          fill="none"
          stroke="#ddd8d0"
          strokeWidth="0.4"
        />
        <path
          d="M0 50 Q30 42 50 48 T90 44 T100 46"
          fill="none"
          stroke="#ddd8d0"
          strokeWidth="0.3"
        />
        <path
          d="M0 30 Q25 24 45 28 T75 22 T100 26"
          fill="none"
          stroke="#e4e0da"
          strokeWidth="0.25"
        />
        <path
          d="M0 85 Q35 78 55 82 T85 76 T100 80"
          fill="none"
          stroke="#e4e0da"
          strokeWidth="0.25"
        />
      </svg>

      {/* Pins */}
      {lodgings.map((lodge) => {
        const isHighlighted = highlightedId === lodge.id;
        return (
          <button
            key={lodge.id}
            onClick={() => onPinClick(lodge.id)}
            onMouseEnter={() => onPinHover?.(lodge.id)}
            onMouseLeave={() => onPinHover?.(null)}
            className="absolute -translate-x-1/2 -translate-y-full group focus:outline-none"
            style={{
              left: `${lodge.mapPosition.x}%`,
              top: `${lodge.mapPosition.y}%`,
            }}
            aria-label={`${lodge.name} — ${lodge.locationLabel}`}
          >
            {/* Pin shape */}
            <div
              className={`
                relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
                shadow-sm transition-all duration-200 cursor-pointer whitespace-nowrap
                ${
                  isHighlighted
                    ? "bg-accent text-brand scale-105 shadow-md"
                    : "bg-white text-brand/80 hover:bg-accent hover:text-brand hover:shadow-md"
                }
              `}
            >
              <span className="text-[10px]">${lodge.nightlyRate}</span>
            </div>
            {/* Pin tail */}
            <div
              className={`
                mx-auto w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px]
                border-l-transparent border-r-transparent transition-colors duration-200
                ${isHighlighted ? "border-t-brand" : "border-t-white group-hover:border-t-brand"}
              `}
            />
          </button>
        );
      })}

      {/* Subtle label */}
      <span className="absolute bottom-2 right-3 text-[10px] text-muted/40 tracking-wide uppercase">
        Area map
      </span>
    </div>
  );
}
