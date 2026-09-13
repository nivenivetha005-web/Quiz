import type { CategoryId, Difficulty, Level } from "../types";
import { CATEGORY_META, DIFFICULTY_META, LEVEL_META } from "../types";

export function CategoryBadge({ category, className = "" }: { category: CategoryId; className?: string }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
      style={{ backgroundColor: "color-mix(in srgb, " + meta.color + " 14%, white)", color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.short}
    </span>
  );
}

export function DifficultyBadge({ difficulty, className = "" }: { difficulty: Difficulty; className?: string }) {
  const meta = DIFFICULTY_META[difficulty];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-[var(--color-paper-dim)] px-2.5 py-1 text-xs font-medium text-[var(--color-ink-soft)] ${className}`}>
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}

export function LevelBadge({ level, className = "" }: { level: Level; className?: string }) {
  const meta = LEVEL_META[level];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-2.5 py-1 text-xs font-medium text-[var(--color-ink-soft)] ${className}`}>
      <span className="font-display italic text-[var(--color-accent)]">L{level}</span>
      {meta.label}
    </span>
  );
}
