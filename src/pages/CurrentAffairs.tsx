import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { currentAffairsEvents } from "../data/currentAffairs";
import type { CurrentAffairsCategory } from "../types";

const CATEGORY_LABELS: Record<CurrentAffairsCategory, string> = {
  design: "Design",
  culture: "Culture",
  technology: "Technology",
  environment: "Environment",
  india: "India",
  world: "World",
};

const RANGES = [
  { label: "This week", days: 7 },
  { label: "This month", days: 30 },
  { label: "Last 3 months", days: 90 },
  { label: "Last 6 months", days: 180 },
  { label: "All", days: 100000 },
];

export default function CurrentAffairs() {
  const [range, setRange] = useState(180);
  const [cat, setCat] = useState<CurrentAffairsCategory | "all">("all");

  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - range);
    return d;
  }, [range]);

  const events = currentAffairsEvents
    .filter((e) => new Date(e.date) >= cutoff)
    .filter((e) => cat === "all" || e.category === cat)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">Current Affairs Engine</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">Date-tagged news that matters for NID</h1>
      <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
        Every event includes why it matters, its design connection, and a possible question — not just a headline to memorise.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/quiz/current-affairs" className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)]">
          Quiz me on this
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setRange(r.days)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${range === r.days ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-line)] text-[var(--color-ink-soft)]"}`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          onClick={() => setCat("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${cat === "all" ? "bg-[var(--color-paper-dim)] text-[var(--color-ink)] border border-[var(--color-ink)]" : "border border-transparent text-[var(--color-ink-faint)]"}`}
        >
          All categories
        </button>
        {(Object.keys(CATEGORY_LABELS) as CurrentAffairsCategory[]).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${cat === c ? "bg-[var(--color-paper-dim)] text-[var(--color-ink)] border border-[var(--color-ink)]" : "border border-transparent text-[var(--color-ink-faint)]"}`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {events.length === 0 && <p className="text-sm text-[var(--color-ink-faint)]">No events in this range — try widening the filter.</p>}
        {events.map((e) => (
          <div key={e.id} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <div className="flex items-center gap-2 text-xs text-[var(--color-ink-faint)]">
              <span className="font-mono">{e.date}</span>
              <span>·</span>
              <span className="uppercase tracking-wide">{CATEGORY_LABELS[e.category]}</span>
              {e.country && <span>· {e.country}</span>}
            </div>
            <p className="mt-2 font-display text-lg font-semibold text-[var(--color-ink)]">{e.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">{e.whatHappened}</p>
            <div className="mt-3 grid gap-2 text-sm">
              <p><span className="font-medium text-[var(--color-ink)]">Why it matters: </span><span className="text-[var(--color-ink-soft)]">{e.whyItMatters}</span></p>
              <p><span className="font-medium text-[var(--color-ink)]">Design connection: </span><span className="text-[var(--color-ink-soft)]">{e.designConnection}</span></p>
              <p><span className="font-medium text-[var(--color-ink)]">Possible question: </span><span className="italic text-[var(--color-ink-soft)]">{e.possibleQuestion}</span></p>
            </div>
            {e.source && <p className="mt-3 text-xs text-[var(--color-ink-faint)]">Source: {e.source}</p>}
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-[var(--color-ink-faint)]">
        This library is seeded with verified milestones and is designed to keep growing — add new dated events to
        <code className="mx-1 rounded bg-[var(--color-paper-dim)] px-1.5 py-0.5">src/data/currentAffairs.ts</code>
        using the same structure as the exam date approaches.
      </p>
    </div>
  );
}
