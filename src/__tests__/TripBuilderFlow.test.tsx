import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";

describe("Trip builder happy path", () => {
  it("walks through destination → lodging → activity and updates the summary", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Step 1: Destination — search and select Park City
    expect(screen.getByText("Where are you going?")).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText("Search destinations..."), "Park");
    await user.click(screen.getByRole("button", { name: /Park City/i }));

    // Step 2: Stay — verify we landed, then select lodging
    expect(screen.getByText("Choose your stay")).toBeInTheDocument();

    // Summary rail now shows destination
    const summaryRail = screen.getByRole("complementary");
    expect(within(summaryRail).getByText(/Park City, Utah/)).toBeInTheDocument();

    // Select lodging via the card button (disambiguated from map pin by aria-label)
    await user.click(screen.getByRole("button", { name: /Select Mountain View Cabin/ }));

    // Summary rail reflects selected lodging
    expect(within(summaryRail).getByText("Mountain View Cabin")).toBeInTheDocument();

    // Step 3: Advance to activities
    await user.click(screen.getByRole("button", { name: /Continue/i }));
    expect(screen.getByText("Things to do")).toBeInTheDocument();

    // Select an activity
    await user.click(screen.getByRole("button", { name: /Ski Lift Tickets/i }));
    expect(screen.getByText("✓ Added")).toBeInTheDocument();

    // Summary rail lists the selected activity
    expect(within(summaryRail).getByText("Ski Lift Tickets")).toBeInTheDocument();
  });
});
