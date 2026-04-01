interface ActivitiesStepProps {
  destinationId: string;
  selectedActivityIds: string[];
  onToggleActivity: (activityId: string) => void;
}

export function ActivitiesStep({
  destinationId: _destinationId,
  selectedActivityIds: _selectedActivityIds,
  onToggleActivity: _onToggleActivity,
}: ActivitiesStepProps) {
  return (
    <div className="px-8 py-12">
      <p className="text-muted text-sm">ActivitiesStep placeholder</p>
    </div>
  );
}
