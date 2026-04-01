interface ExtrasStepProps {
  selectedAddOnIds: string[];
  onToggleAddOn: (addOnId: string) => void;
}

export function ExtrasStep({
  selectedAddOnIds: _selectedAddOnIds,
  onToggleAddOn: _onToggleAddOn,
}: ExtrasStepProps) {
  return (
    <div className="px-8 py-12">
      <p className="text-muted text-sm">ExtrasStep placeholder</p>
    </div>
  );
}
