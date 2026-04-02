# travelr

A high-fidelity functional prototype for a guided outdoor trip booking experience — built as a UX Engineer take-home for Outside Interactive.

**[Live demo →](https://jette-travelr.vercel.app/)**

---

## Overview

travelr explores how a guided, step-by-step booking flow can make trip planning feel calm and curated instead of overwhelming. Rather than presenting a marketplace of options all at once, it walks the user through building an itinerary — selecting a destination, choosing lodging, adding activities, and bundling extras — with contextual recommendations that respond to their choices along the way.

This is a prototype. There is no backend, no authentication, no payment processing. The focus is on interaction design, information hierarchy, and the quality of the guided experience itself.

## Core user flow

1. **Destination** — Search by name of *Supported Destination* or browse by vibe (Mountains, Desert, Coast). A full-bleed hero image sets the tone.
2. **Stay** — Pick dates and travelers, then choose lodging from a curated list. An area map with interactive price pins highlights each option and links to the card list below.
3. **Activities** — Browse destination-specific activities. Contextual bundle recommendations surface based on what's been selected (e.g., ski tickets trigger a Ski Day Bundle suggestion). Each activity supports per-person participation — you can send only some of the group.
4. **Extras** — Add optional extras like breakfast, equipment rental, grocery delivery, or Kids Club. Destination-specific dinner reservations appear as complimentary add-ons. Equipment rental and Kids Club are conditionally shown based on destination vibe and traveler composition.
5. **Review** — A full trip summary with inline editing: adjust dates, travelers, and participation directly. Remove items, see bundle discount breakdowns, and review the final total.

A persistent summary rail (desktop) or sticky bottom bar (mobile) tracks selections and running total throughout the flow.

## How to use the prototype

Destination search uses mock data with a curated set of supported destinations. Type at least two characters to search, or pick a vibe to browse.

**Supported destinations:**
- Park City, Utah
- Aspen, Colorado
- Lake Tahoe, California
- Joshua Tree, California
- St. George, Utah
- Palm Springs, California
- San Francisco, California
- Mendocino, California
- Seattle, Washington

**Vibe-based browsing:**
- 🏔 Mountains
- 🏜 Desert
- 🌊 Coast

## Key UX decisions

**Guided flow over marketplace.** Each step focuses the user on one decision at a time. The progress nav shows where you are and lets you jump back to completed steps, but forward movement is gated — you must select lodging before continuing, for example.

**Contextual recommendations.** Bundles surface in the activities step based on real triggers: selecting a ski activity shows the Ski Day Bundle; traveling with children shows a Family Adventure Pack; adding equipment rental suggests a guided tour. Recommendations include per-person savings and can be added or removed with a single click. Ski-related bundles are automatically hidden at non-mountain destinations.

**Partial-group participation.** Activities and extras support "Everyone" or "Custom" participation. A guided hike can be for just the adults. Kids Club defaults to kids-only. Participation counts stay clamped when the traveler group changes — if you reduce the group from 3 adults to 1, partial selections adjust automatically. Removing all children also removes Kids Club.

**Destination-dependent state reset.** Changing your destination clears lodging, activities, extras, and seen recommendations — because those selections are destination-specific. But dates and traveler counts persist, since those belong to the trip, not the place. Re-selecting the same destination keeps everything intact. A confirmation modal warns before resetting if you already have selections.

**Lightweight map.** The stay step includes a stylized area map with interactive price pins. Hovering a pin highlights the corresponding card, and vice versa. It communicates spatial context without the weight of a real map integration.

**Responsive layout.** On desktop, the main content area sits alongside a sticky summary rail on the right. On mobile, the layout stacks vertically and the summary rail is replaced by a fixed bottom bar showing the running total and a "View trip" button. The destination step uses a full-bleed hero image that scales naturally across breakpoints.

**Calm, spacious visual design.** Outside-inspired UI with generous whitespace, soft borders, subtle hover states, rounded cards, and restrained color. The accent yellow and dark brand palette keep the interface warm but professional. Tailwind v4 with a custom `@theme` defines the reoccuring color system.

**Review step as a real editing surface.** The review isn't just a static receipt. Dates, guests, and participation can all be adjusted inline. Items can be removed. Bundle discounts show clearly. Empty sections link back to the relevant step.

## Architecture

```
src/
├── components/
│   ├── layout/          # Header, Footer, ProgressNav
│   ├── shared/          # Reusable primitives (SelectableCard, ParticipationPicker,
│   │                      DateRangePicker, GuestPicker, Stepper, StepHeader, StepActions,
│   │                      OptimizedImage)
│   └── trip/            # Trip-specific UI (TripSummaryRail, MobileSummaryBar, StayMap)
├── config/              # Step definitions and ordering
├── data/
│   ├── mock/            # All mock data (destinations, lodgings, activities, add-ons,
│   │                      recommendations)
│   └── selectors.ts     # Typed lookup functions over mock data
├── domain/
│   ├── services/        # Pure business logic (pricing, recommendations, bundles)
│   └── constants.ts
├── features/
│   └── trip-builder/    # Page-level component and step views
├── hooks/               # useTrip (state management), useClickOutside
├── test/                # Shared test setup and helpers
├── types/               # TypeScript type definitions (TripState, Participation, etc.)
└── utils/               # Formatting helpers (currency, pluralization, participation labels)
```

**State management** lives in a single `useTrip` hook that owns the full `TripState` and exposes granular updater functions. State persists to `localStorage` so refreshes don't lose progress. No external state library — React's `useState` is sufficient for a single-page flow.

**Domain logic is separated from UI.** Pricing, recommendations, and bundle detection are pure functions in `domain/services/`. They take `TripState` in and return computed values out — no React dependency, easy to test.

**Shared components are composable.** `SelectableCard` handles the toggle-select pattern used across activities, extras, and recommendation bundles. `ParticipationPicker` supports both inline and trigger-based rendering (used differently in the activities step vs. the review step). `Stepper` is reused inside `GuestPicker`, `ParticipationPicker`, and `DateRangePicker`.

**Image loading** is handled by `OptimizedImage`, which manages loading/error states, shows a shimmer placeholder, and caches loaded URLs in a module-level `Set`. Images are preloaded in batches when entering the destination and stay steps.

## Testing

The test suite is intentionally lightweight but targets the areas where bugs would actually matter:

- **Pricing** — 11 tests covering lodging × nights, per-person activity pricing, flat-rate vs. per-person add-ons, partial participation scaling, full trip totals, and bundle discount calculations.
- **Recommendations** — 8 tests verifying each trigger type (activity tags, children, add-on selection, destination vibe), vibe-based filtering, determinism, and empty-state behavior.
- **State management** — 10 tests on `useTrip` covering destination change resets, date/traveler persistence across changes, default participation, partial participation clamping, Kids Club auto-removal, and same-destination re-selection.
- **Integration** — One happy-path flow test that walks through destination → lodging → activity selection using Testing Library user events, verifying the summary rail updates at each step.

**Tools:** Vitest, React Testing Library, jsdom, `@testing-library/user-event`. Test setup includes a `localStorage` stub and shared helpers (`makeTripState`, `selectedItem`, `findItem`, `hasRecommendation`) to keep tests concise.

## Tech stack

- **React 19** with TypeScript (strict mode)
- **Vite 8** for dev server and build
- **Tailwind CSS v4** with `@theme` custom properties
- **Vitest** + React Testing Library for tests
- No routing library, state management library, or component library — zero added dependencies beyond React and its dev tooling

## Running locally

```bash
npm install
npm run dev          # Start dev server
npm run build        # Type-check and build for production
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
```

## Tradeoffs and scope boundaries

This is a prototype scoped to demonstrate UX thinking and frontend craft, not production readiness.

- **No real search or filtering.** Destination search matches against a fixed list. There's no fuzzy matching, no autocomplete ranking, no recent searches.
- **No routing.** The entire flow is a single-page state machine. Browser back/forward doesn't work — acceptable for a prototype, not for a shipped product.
- **No responsive calendar.** The `DateRangePicker` shows a two-month calendar grid that works well on desktop but isn't optimized for narrow mobile viewports.
- **No animations or transitions between steps.** Step changes are instant. Crossfade or slide transitions would improve the feel.
- **No accessibility audit.** Basic semantics are in place (buttons, labels, landmarks), but the prototype hasn't been tested with a screen reader or against WCAG.
- **Mock data only.** All destinations, lodgings, activities, and pricing are hardcoded. No API layer, no loading states for data fetching.

## Future improvements

- **Step transitions** — Animated crossfades between steps to smooth the flow
- **Mobile date picker** — A bottom-sheet calendar or native date input on small screens
- **Accessibility pass** — ARIA roles for the recommendation cards, focus management between steps, keyboard navigation for the map
- **URL-based routing** — Each step as a route so the browser back button works naturally
- **Persisted trip sharing** — Generate a shareable URL for a configured trip
- **Image gallery** — Expandable photos on lodging cards with a lightbox
