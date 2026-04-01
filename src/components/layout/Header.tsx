export function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-border">
      <div className="flex items-center gap-2">
        <img src="/suitcase.svg" alt="" className="h-10 w-10" />
        <div className="flex flex-col items-start leading-none">
          <span className="text-3xl font-semibold tracking-tight">travelr</span>
          <img src="/powered-by-outside.svg" alt="Powered by Outside" className="h-3 mt-0.5" />
        </div>
      </div>
    </header>
  );
}
