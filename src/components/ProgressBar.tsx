export default function ProgressBar({
  value,
  max = 100,
  color = "var(--color-accent)",
  height = 8,
  className = "",
  label,
}: {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  className?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className={className}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-ink-soft)]">
          <span>{label}</span>
          <span className="tabular-nums">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full rounded-full bg-[var(--color-paper-dim)]" style={{ height }}>
        <div
          className="rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, height, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
