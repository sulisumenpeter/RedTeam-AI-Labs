export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3"
    >
      <div className="w-8 h-8 border-3 border-teal-500/20 border-t-teal-600 rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500">Loading workspace data...</span>
    </div>
  );
}

