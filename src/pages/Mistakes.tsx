import { Link } from "react-router-dom";
import { useProgress } from "../store/progress";
import { CATEGORY_META } from "../types";

export default function Mistakes() {
  const mistakes = useProgress((s) => s.mistakes);
  const resolveMistake = useProgress((s) => s.resolveMistake);

  const list = Object.values(mistakes).sort((a, b) => (a.lastMissed < b.lastMissed ? 1 : -1));
  const open = list.filter((m) => !m.resolved);
  const resolved = list.filter((m) => m.resolved);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">Mistake Notebook</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">My Mistakes</h1>
      <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
        Every wrong answer lands here automatically, with your answer, the correct one, and why. Clear it out with a focused revision
        round whenever you're ready.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/quiz/mistakes" className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)]">
          Quiz my mistakes ({open.length})
        </Link>
      </div>

      {list.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-[var(--color-line)] p-10 text-center">
          <p className="text-[var(--color-ink-soft)]">No mistakes logged yet — take a quiz and this page will start filling in.</p>
        </div>
      )}

      {open.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-faint)] mb-3">Open ({open.length})</h2>
          <div className="space-y-3">
            {open.map((m) => (
              <div key={m.id} className="rounded-2xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[var(--color-ink-faint)]">
                    {CATEGORY_META[m.category].short} · missed {m.missedCount}×
                  </span>
                  <button onClick={() => resolveMistake(m.id)} className="text-xs font-medium text-[var(--color-teal)] hover:underline">
                    Mark resolved
                  </button>
                </div>
                <p className="mt-2 text-sm font-medium text-[var(--color-ink)]">{m.question}</p>
                <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                  Your answer: <span className="italic">{m.userAnswer}</span>
                </p>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  Correct answer: <span className="font-medium text-[var(--color-ink)]">{m.correctAnswer}</span>
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{m.explanation}</p>
                {m.hook && (
                  <p className="mt-1.5 text-sm text-[var(--color-ink)]">
                    <span className="font-medium">Hook: </span>
                    {m.hook}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-faint)] mb-3">Resolved ({resolved.length})</h2>
          <div className="space-y-2">
            {resolved.map((m) => (
              <div key={m.id} className="rounded-xl border border-[var(--color-line)] p-3 text-sm text-[var(--color-ink-faint)] flex items-center justify-between gap-2">
                <span className="truncate">{m.question}</span>
                <span className="shrink-0 text-[var(--color-teal)]">✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
