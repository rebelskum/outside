# travelr — Booking Prototype

A high-fidelity interactive prototype for a guided travel booking experience where lodging, activities, and add-ons can be bundled together.


## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Tests

```bash
npm test            # single run
npm run test:watch  # watch mode
```

Tests use Vitest + React Testing Library and cover core domain logic (pricing, recommendations, trip state management) plus one integration test for the main booking flow.

## Project Structure

```
src/
├── App.tsx          # Root app shell
├── main.tsx         # Entry point
├── index.css        # Tailwind config + theme tokens
├── components/      # Shared UI components
├── features/        # Step-specific feature modules
├── data/            # Mock data
├── hooks/           # Custom hooks
└── types/           # Shared TypeScript types
```

## Prototype Scope

This is a guided booking flow prototype — not a production application. It uses mock data only with no backend, authentication, or real booking logic.

**Flow:** Destination → Stay → Activities → Extras → Review
