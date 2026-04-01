interface IntroStripProps {
  title: string;
  subtitle?: string;
}

export function IntroStrip({ title, subtitle }: IntroStripProps) {
  return (
    <div className="px-8 py-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </div>
  );
}
