import { useTrip } from "../../hooks/useTrip";
import { calculateTotal } from "../../domain/services/pricing";
import { Header } from "../../components/layout/Header";
import { ProgressNav } from "../../components/layout/ProgressNav";
import { TripSummaryRail } from "../../components/trip/TripSummaryRail";
import { MobileSummaryBar } from "../../components/trip/MobileSummaryBar";
import { DestinationStep } from "./steps/DestinationStep";
import { StayStep } from "./steps/StayStep";
import { ActivitiesStep } from "./steps/ActivitiesStep";
import { ExtrasStep } from "./steps/ExtrasStep";
import { ReviewStep } from "./steps/ReviewStep";

export function TripBuilderPage() {
  const {
    trip,
    setDestination,
    needsDestinationChangeConfirmation,
    setLodging,
    setTravelers,
    setDates,
    toggleActivity,
    toggleAddOn,
    nextStep,
    prevStep,
  } = useTrip();

  const total = calculateTotal(trip);
  const showSummary = trip.currentStep !== "destination";

  const stepContent = () => {
    switch (trip.currentStep) {
      case "destination":
        return (
          <DestinationStep
            onSelect={setDestination}
            needsConfirmation={needsDestinationChangeConfirmation}
          />
        );
      case "stay":
        return (
          <StayStep
            destinationId={trip.selectedDestinationId!}
            travelers={trip.travelers}
            dates={trip.dateRange}
            onSelectLodging={setLodging}
            onUpdateTravelers={setTravelers}
            onUpdateDates={setDates}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case "activities":
        return (
          <ActivitiesStep
            trip={trip}
            onToggleActivity={toggleActivity}
            onToggleAddOn={toggleAddOn}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case "extras":
        return (
          <ExtrasStep
            selectedAddOnIds={trip.selectedAddOnIds}
            onToggleAddOn={toggleAddOn}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case "review":
        return <ReviewStep trip={trip} onBack={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      {showSummary && <ProgressNav currentStep={trip.currentStep} />}

      <div className="mx-auto max-w-6xl px-6 pb-28 lg:pb-8">
        <div className="flex gap-12">
          <main className="flex-1 min-w-0">{stepContent()}</main>

          {showSummary && (
            <TripSummaryRail trip={trip} onContinue={nextStep} />
          )}
        </div>
      </div>

      {showSummary && (
        <MobileSummaryBar total={total} onViewTrip={() => {}} />
      )}
    </div>
  );
}
