import { Link } from "react-router-dom";
import { CATEGORY_META, type CategoryId } from "../types";
import { topicsByCategory } from "../data";
import { useProgress } from "../store/progress";
import { categoryMasteryList } from "../engine/stats";
import ProgressBar from "../components/ProgressBar";

const ORDER: CategoryId[] = [
  "art-culture",
  "crafts",
  "architecture",
  "design-history",
  "interaction-design",
  "technology",
  "sustainability",
  "heritage",
  "science",
  "schemes",
  "current-affairs",
];

export default function Learn() {
  const topicProgress = useProgress((s) => s.topicProgress);
  const mastery = Object.fromEntries(categoryMasteryList(topicProgress).map((m) => [m.category, m]));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">Learn</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">Pick a category</h1>
      <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
        Every topic follows the same cycle — learn the idea, see it, practise recognising it, then get quizzed. Difficulty rises only as you
        show mastery.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          const topics = topicsByCategory[cat] ?? [];
          const m = mastery[cat];
          return (
            <Link
              key={cat}
              to={`/learn/${cat}`}
              className="rounded-2xl border border-[var(--color-line)] bg-white p-5 transition-all hover:border-[var(--color-ink-faint)] hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${meta.color} 16%, white)` }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                </span>
                <span className="text-xs text-[var(--color-ink-faint)]">{topics.length} topics</span>
              </div>
              <p className="mt-3 font-display text-lg font-semibold text-[var(--color-ink)]">{meta.label}</p>
              <p className="mt-1 text-sm text-[var(--color-ink-faint)] leading-snug">{meta.description}</p>
              {m && <ProgressBar value={m.pct} max={100} color={meta.color} className="mt-4" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
