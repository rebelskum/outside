import { useState } from "react";
import type { Vibe } from "../../../types/trip";
import { destinations } from "../../../data/mock/destinations";

const VIBES: { id: Vibe; label: string; emoji: string }[] = [
  { id: "mountains", label: "Mountains", emoji: "🏔" },
  { id: "desert", label: "Desert", emoji: "🏜" },
  { id: "coast", label: "Coast", emoji: "🌊" },
];

interface DestinationStepProps {
  onSelect: (destinationId: string) => void;
  needsConfirmation: (destinationId: string) => boolean;
}

export function DestinationStep({ onSelect, needsConfirmation }: DestinationStepProps) {
  const [query, setQuery] = useState("");
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
  const [pendingDestinationId, setPendingDestinationId] = useState<string | null>(null);

  const searchResults = query.length >= 2
    ? destinations.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.region.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const vibeResults = selectedVibe
    ? destinations.filter((d) => d.vibe === selectedVibe)
    : [];

  const showSearchResults = query.length >= 2;
  const showVibeResults = !showSearchResults && selectedVibe !== null;

  const handleSelect = (id: string) => {
    if (needsConfirmation(id)) {
      setPendingDestinationId(id);
    } else {
      onSelect(id);
    }
  };

  return (
    <div className="flex flex-col items-center px-8 pt-24 pb-16">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center">
        Where are you going?
      </h1>

      {/* Search input */}
      <div className="mt-8 w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 2) setSelectedVibe(null);
          }}
          placeholder="Search destinations..."
          className="w-full rounded-full border border-border bg-white px-6 py-4 text-base outline-none placeholder:text-muted/60 focus:border-brand/30 focus:shadow-sm transition-all"
        />
      </div>

      {/* Search results dropdown */}
      {showSearchResults && (
        <div className="mt-2 w-full max-w-lg rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          {searchResults.length > 0 ? (
            searchResults.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleSelect(dest.id)}
                className="w-full px-6 py-4 text-left hover:bg-surface transition-colors border-b border-border last:border-b-0"
              >
                <p className="font-medium text-sm">{dest.name}</p>
                <p className="text-xs text-muted mt-0.5">{dest.region} · {dest.shortDescription}</p>
              </button>
            ))
          ) : (
            <div className="px-6 py-4 text-sm text-muted">No destinations found</div>
          )}
        </div>
      )}

      {/* Divider */}
      {!showSearchResults && (
        <>
          <p className="mt-8 text-md text-muted">or pick your vibe</p>

          {/* Vibe cards */}
          <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-lg">
            {VIBES.map((vibe) => {
              const active = selectedVibe === vibe.id;
              return (
                <button
                  key={vibe.id}
                  onClick={() => setSelectedVibe(active ? null : vibe.id)}
                  className={`rounded-2xl border p-6 text-center transition-all ${
                    active
                      ? "border-brand bg-brand/[0.03] shadow-sm"
                      : "border-border bg-white hover:border-brand/20 hover:shadow-sm"
                  }`}
                >
                  <span className="text-2xl">{vibe.emoji}</span>
                  <p className="mt-2 text-sm font-medium">{vibe.label}</p>
                </button>
              );
            })}
          </div>

          {/* Vibe destination list */}
          {showVibeResults && (
            <div className="mt-8 w-full max-w-lg space-y-3">
              {vibeResults.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => handleSelect(dest.id)}
                  className="w-full rounded-xl border border-border bg-white p-5 text-left hover:border-brand/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-muted">
                      {dest.heroLabel}
                    </div>
                    <div>
                      <p className="font-medium">{dest.name}</p>
                      <p className="text-sm text-muted mt-0.5">{dest.region} · {dest.shortDescription}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Confirmation modal */}
      {pendingDestinationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <p className="text-base font-semibold">Change destination?</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              This will reset your stay, activities, and extras.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setPendingDestinationId(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-brand transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSelect(pendingDestinationId);
                  setPendingDestinationId(null);
                }}
                className="rounded-lg bg-accent text-brand px-4 py-2 text-sm font-medium hover:bg-brand hover:text-white transition-colors"
              >
                Change destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
