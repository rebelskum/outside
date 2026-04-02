import { useMemo } from "react";
import { useTrip } from "../../hooks/useTrip";
import { calculateTotal } from "../../domain/services/pricing";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
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
    updateActivityParticipation,
    toggleAddOn,
    updateAddOnParticipation,
    markRecommendationSeen,
    goToStep,
    nextStep,
    prevStep,
  } = useTrip();

  const isDestinationStep = trip.currentStep === "destination";
  const isReviewStep = trip.currentStep === "review";
  const total = calculateTotal(trip);
  const showProgressNav = !isDestinationStep;
  const showSummaryRail = !isDestinationStep && !isReviewStep;

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
            selectedLodgingId={trip.selectedLodgingId}
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
            onUpdateActivityParticipation={updateActivityParticipation}
            onToggleAddOn={toggleAddOn}
            onUpdateAddOnParticipation={updateAddOnParticipation}
            onMarkRecommendationSeen={markRecommendationSeen}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case "extras":
        return (
          <ExtrasStep
            trip={trip}
            onToggleAddOn={toggleAddOn}
            onUpdateAddOnParticipation={updateAddOnParticipation}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case "review":
        return (
          <ReviewStep
            trip={trip}
            onBack={prevStep}
            onUpdateDates={setDates}
            onUpdateTravelers={setTravelers}
            onRemoveActivity={toggleActivity}
            onUpdateActivityParticipation={updateActivityParticipation}
            onRemoveAddOn={toggleAddOn}
            onUpdateAddOnParticipation={updateAddOnParticipation}
            onGoToStep={goToStep}
          />
        );
      default:
        return null;
    }
  };

  const heroImage = useMemo(() => {
    const heroes = [
      "/hero-destination.jpg",
      "/hero-coast.jpg",
      "/hero-desert.jpg",
    ];
    return heroes[Math.floor(Math.random() * heroes.length)];
  }, []);

  return (
    <div className="relative min-h-screen bg-surface">
      {/* Full-width hero image behind destination card */}
      {isDestinationStep && (
        <div className="absolute inset-0 -z-0 overflow-hidden">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent via-80% to-surface" />
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
      <Header />
      {showProgressNav && <ProgressNav currentStep={trip.currentStep} onStepClick={goToStep} />}

      <div className="flex-1 mx-auto max-w-6xl w-full px-6 pb-28 lg:pb-8">
        <div className="flex gap-12">
          <main className="flex-1 min-w-0">{stepContent()}</main>

          {showSummaryRail && (
            <TripSummaryRail trip={trip} onReserve={() => goToStep("review")} />
          )}
        </div>
      </div>

      {showSummaryRail && (
        <MobileSummaryBar
          total={total}
          onViewTrip={() => goToStep("review")}
          disabled={!trip.selectedLodgingId}
        />
      )}

      <Footer />
      </div>
    </div>
  );
}
