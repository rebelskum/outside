import { useState, useRef, useEffect, useMemo } from "react";
import type { DateRange } from "../../types/trip";
import { useClickOutside } from "../../hooks/useClickOutside";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const monthYearFmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const displayFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const pillFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function makeDate(y: number, m: number, d: number): Date {
  return new Date(y, m, d, 12);
}

function toKey(d: Date): number {
  return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
}

function parseStored(str: string): Date {
  const m = str.match(/([A-Za-z]+)\s+(\d+)/);
  if (!m) return makeDate(new Date().getFullYear(), 0, 1);
  return makeDate(new Date().getFullYear(), new Date(`${m[1]} 1, 2000`).getMonth(), +m[2]);
}

function diffNights(a: Date, b: Date): number {
  return Math.round(
    (new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime() -
      new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime()) /
      864e5,
  );
}

function calendarDays(year: number, month: number): (Date | null)[] {
  const first = makeDate(year, month, 1);
  const total = new Date(year, month + 1, 0).getDate();
  const blanks: null[] = Array(first.getDay()).fill(null);
  return [...blanks, ...Array.from({ length: total }, (_, i) => makeDate(year, month, i + 1))];
}

interface DateRangePickerProps {
  dates: DateRange;
  onChange: (dates: DateRange) => void;
}

export function DateRangePicker({ dates, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<Date | null>(() => parseStored(dates.start));
  const [end, setEnd] = useState<Date | null>(() => parseStored(dates.end));
  const [hover, setHover] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState(() =>
    makeDate(parseStored(dates.start).getFullYear(), parseStored(dates.start).getMonth(), 1),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStart(parseStored(dates.start));
    setEnd(parseStored(dates.end));
  }, [dates.start, dates.end]);

  useClickOutside(ref, open, () => setOpen(false));

  function handleDayClick(day: Date) {
    if (!start || end) {
      // No start yet, or range complete → begin new selection
      setStart(day);
      setEnd(null);
    } else {
      // Start is set, no end → pick end
      if (toKey(day) <= toKey(start)) {
        // Clicked before/on start → restart
        setStart(day);
        setEnd(null);
      } else {
        setEnd(day);
      }
    }
  }

  function handleClose() {
    if (start && end) {
      onChange({ start: pillFmt.format(start), end: pillFmt.format(end) });
    }
    setOpen(false);
  }

  function handleClear() {
    setStart(null);
    setEnd(null);
  }

  // Derived range state for rendering
  const effectiveEnd = !end && start && hover && toKey(hover) > toKey(start) ? hover : end;
  const nights = start && effectiveEnd ? diffNights(start, effectiveEnd) : 0;

  const isStart = (d: Date) => !!start && toKey(d) === toKey(start);
  const isEnd = (d: Date) => !!effectiveEnd && toKey(d) === toKey(effectiveEnd);
  const isInRange = (d: Date) =>
    !!start && !!effectiveEnd && toKey(d) > toKey(start) && toKey(d) < toKey(effectiveEnd);

  const secondMonth = useMemo(
    () => makeDate(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
    [viewMonth],
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm hover:border-brand/30 hover:shadow-sm transition-all cursor-pointer"
      >
        <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        {dates.start} – {dates.end}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-20 rounded-2xl border border-border bg-white p-6 shadow-xl w-[min(calc(100vw-2rem),640px)]">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xl font-semibold">
                {nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "Select dates"}
              </p>
              {start && (
                <p className="text-sm text-muted mt-0.5">
                  {displayFmt.format(start)}
                  {effectiveEnd ? ` – ${displayFmt.format(effectiveEnd)}` : ""}
                </p>
              )}
            </div>

            <div className="flex border border-border rounded-lg overflow-hidden text-sm">
              <div className={`px-4 py-2 text-left ${!end ? "border-2 border-brand rounded-lg -m-px" : "border-r border-border"}`}>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Check-in</span>
                <span className="font-medium">{start ? displayFmt.format(start) : "—"}</span>
              </div>
              <div className={`px-4 py-2 text-left ${start && !end ? "" : end ? "border-2 border-brand rounded-lg -m-px" : ""}`}>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Checkout</span>
                <span className="font-medium">{end ? displayFmt.format(end) : "—"}</span>
              </div>
            </div>
          </div>

          {/* Calendar grids */}
          <div className="flex gap-6">
            <MonthGrid
              month={viewMonth}
              onDayClick={handleDayClick}
              onDayHover={setHover}
              isInRange={isInRange}
              isRangeStart={isStart}
              isRangeEnd={isEnd}
              onPrev={() => setViewMonth(makeDate(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              showPrev
            />
            <MonthGrid
              month={secondMonth}
              onDayClick={handleDayClick}
              onDayHover={setHover}
              isInRange={isInRange}
              isRangeStart={isStart}
              isRangeEnd={isEnd}
              onNext={() => setViewMonth(makeDate(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              showNext
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border">
            <button
              onClick={handleClear}
              className="text-sm font-medium underline underline-offset-2 hover:text-brand/70 transition-colors"
            >
              Clear dates
            </button>
            <button
              onClick={handleClose}
              disabled={!start || !end}
              className="rounded-lg bg-accent text-brand px-5 py-2.5 text-sm font-medium hover:bg-brand hover:text-white transition-colors disabled:opacity-40"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- MonthGrid ---- */

interface MonthGridProps {
  month: Date;
  onDayClick: (day: Date) => void;
  onDayHover: (day: Date | null) => void;
  isInRange: (day: Date) => boolean;
  isRangeStart: (day: Date) => boolean;
  isRangeEnd: (day: Date) => boolean;
  onPrev?: () => void;
  onNext?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
}

function MonthGrid({
  month,
  onDayClick,
  onDayHover,
  isInRange,
  isRangeStart,
  isRangeEnd,
  onPrev,
  onNext,
  showPrev,
  showNext,
}: MonthGridProps) {
  const days = useMemo(
    () => calendarDays(month.getFullYear(), month.getMonth()),
    [month],
  );

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        {showPrev ? (
          <button onClick={onPrev} className="p-1 hover:bg-surface rounded-full transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
        ) : <span />}
        <span className="text-sm font-semibold">{monthYearFmt.format(month)}</span>
        {showNext ? (
          <button onClick={onNext} className="p-1 hover:bg-surface rounded-full transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ) : <span />}
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label, i) => (
          <span key={i} className="text-center text-xs font-medium text-muted py-1">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          if (!day) return <span key={`empty-${i}`} />;

          const rangeStart = isRangeStart(day);
          const rangeEnd = isRangeEnd(day);
          const inRange = isInRange(day);

          return (
            <div
              key={day.getDate()}
              className={`relative flex items-center justify-center ${
                inRange ? "bg-gray-100" : ""
              } ${rangeStart ? "bg-gradient-to-r from-transparent to-gray-100 rounded-l-full" : ""} ${
                rangeEnd ? "bg-gradient-to-l from-transparent to-gray-100 rounded-r-full" : ""
              }`}
            >
              <button
                onClick={() => onDayClick(day)}
                onMouseEnter={() => onDayHover(day)}
                onMouseLeave={() => onDayHover(null)}
                className={`relative z-10 h-9 w-9 rounded-full text-sm transition-colors ${
                  rangeStart
                    ? "border-2 border-brand font-semibold"
                    : rangeEnd
                      ? "bg-brand text-white font-semibold"
                      : "hover:border hover:border-brand/40"
                }`}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
