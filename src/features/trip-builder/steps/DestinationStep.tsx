interface DestinationStepProps {
  onSelect: (destinationId: string) => void;
}

export function DestinationStep({ onSelect: _onSelect }: DestinationStepProps) {
  return (
    <div className="px-8 py-12">
      <p className="text-muted text-sm">DestinationStep placeholder</p>
    </div>
  );
}
