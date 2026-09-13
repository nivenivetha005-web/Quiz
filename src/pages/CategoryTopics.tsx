import { Link, useParams, Navigate } from "react-router-dom";
import type { CategoryId } from "../types";
import { CATEGORY_META } from "../types";
import { topicsByCategory } from "../data";
import { useProgress } from "../store/progress";

const STATUS_DOT: Record<string, string> = {
  new: "bg-[var(--color-line)]",
  learning: "bg-[var(--color-gold)]",
  "needs-revision": "bg-[var(--color-accent)]",
  strong: "bg-[var(--color-teal)]",
  mastered: "bg-[var(--color-teal)]",
};

export default function CategoryTopics() {
  const { category } = useParams<{ category: string }>();
  const topicProgress = useProgress((s) => s.topicProgress);

  if (!category || !(category in CATEGORY_META)) return <Navigate to="/learn" replace />;
  const cat = category as CategoryId;
  const meta = CATEGORY_META[cat];
  const topics = topicsByCategory[cat] ?? [];

  const bySubtopic = new Map<string, typeof topics>();
  for (const t of topics) {
    const key = t.subtopic || "General";
    if (!bySubtopic.has(key)) bySubtopic.set(key, []);
    bySubtopic.get(key)!.push(t);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <Link to="/learn" className="text-sm text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]">
        ← All categories
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: meta.color }}>
        {meta.short}
      </p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">{meta.label}</h1>
      <p className="mt-2 max-w-xl text-[var(--color-ink-soft)]">{meta.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={`/quiz/category/${cat}`} className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)]">
          Practice quiz
        </Link>
        <Link to={`/flashcards/${cat}`} className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)]">
          Flashcards
        </Link>
      </div>

      <div className="mt-10 space-y-10">
        {Array.from(bySubtopic.entries()).map(([subtopic, ts]) => (
          <div key={subtopic}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-faint)] mb-3">{subtopic}</h2>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {ts.map((t) => {
                const status = topicProgress[t.id]?.status ?? "new";
                return (
                  <Link
                    key={t.id}
                    to={`/topic/${t.id}`}
                    className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 hover:border-[var(--color-ink-faint)] transition-colors"
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status]}`} aria-hidden />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-[var(--color-ink)] truncate">{t.title}</span>
                      {t.region && <span className="block text-xs text-[var(--color-ink-faint)] truncate">{t.region}</span>}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
