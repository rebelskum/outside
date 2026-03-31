# AGENTS.md

## Project

UX Engineer take-home interview assignment — a high-fidelity functional prototype for a guided travel booking experience. This is a prototype, not a production application.

## Goal

Demonstrate strong UX thinking, clean information hierarchy, thoughtful interaction design, and a calm/airy visual aesthetic through a guided booking flow for a weekend outdoor trip where lodging, activities, and add-ons can be bundled together.

## Contextual Recommendations

As the user builds their itinerary, the system should surface recommended bundles or add-ons based on selections:

- Adding ski tickets → suggest Ski Package (tickets + rentals + lesson)
- Adding children to booking → suggest Kids Club or Family Package
- Adding equipment rental → suggest guided tour or lesson
- Support per-activity traveler counts (e.g., guided hike with only 1 of 2 kids)

## Deployment

- Deploy to Vercel for live demo viewing

## Visual Direction

Airbnb-inspired: minimal, spacious, curated, premium. Not cluttered or overly transactional.

## Guided Flow

1. Destination entry
2. Lodging selection with traveler count
3. Activity selection with contextual recommendations
4. Extras / add-ons
5. Trip review summary

## Layout

- **Desktop**: left content area + right sticky summary panel
- **Mobile**: stacked content with sticky footer or bottom drawer for summary

## Constraints

- Mock data only — no backend, no auth, no maps
- No checkout, payment, or real booking flow
- No production-grade search or complex filtering
- No overengineered architecture
- Do not expand beyond prototype scope unless explicitly asked

## Conventions

- Keep code simple and readable
- Follow existing patterns and conventions when adding new code
- Write tests for new functionality
