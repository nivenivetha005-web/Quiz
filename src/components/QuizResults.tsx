import { Link } from "react-router-dom";
import type { QuizResult } from "./QuizRunner";
import { CATEGORY_META, type CategoryId } from "../types";
import ProgressBar from "./ProgressBar";

export default function QuizResults({ result, title, onRetry }: { result: QuizResult; title: string; onRetry?: () => void }) {
  const accuracy = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  const cats = Object.entries(result.byCategory) as [CategoryId, { correct: number; total: number }][];
  const sorted = [...cats].sort((a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 animate-rise">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-accent)]">{title}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-[var(--color-ink)]">
        {accuracy >= 80 ? "Excellent work." : accuracy >= 50 ? "Solid session." : "Good start — worth another pass."}
      </h1>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Score" value={`${result.correct}/${result.total}`} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Avg. time" value={`${result.avgSeconds.toFixed(1)}s`} />
      </div>

      <div className="mt-8 space-y-3">
        {cats.map(([cat, s]) => (
          <ProgressBar key={cat} value={s.correct} max={s.total} color={CATEGORY_META[cat].color} label={`${CATEGORY_META[cat].short} (${s.correct}/${s.total})`} />
        ))}
      </div>

      {(strongest || weakest) && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {strongest && (
            <div className="rounded-xl border border-[var(--color-teal)]/30 bg-[var(--color-teal-soft)] p-4">
              <p className="text-xs font-medium text-[var(--color-teal)]">Strongest topic today</p>
              <p className="mt-1 font-display font-semibold text-[var(--color-ink)]">{CATEGORY_META[strongest[0]].label}</p>
            </div>
          )}
          {weakest && (
            <div className="rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-4">
              <p className="text-xs font-medium text-[var(--color-accent)]">Recommended revision</p>
              <p className="mt-1 font-display font-semibold text-[var(--color-ink)]">{CATEGORY_META[weakest[0]].label}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 space-y-4">
        <h2 className="font-display text-lg font-semibold text-[var(--color-ink)]">Review</h2>
        {result.responses.map((r, i) => (
          <div key={i} className={`rounded-xl border p-4 text-sm ${r.outcome.correct ? "border-[var(--color-line)]" : "border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]/40"}`}>
            <p className="font-medium text-[var(--color-ink)]">
              {r.outcome.correct ? "✅" : "❌"} {promptOf(r.question)}
            </p>
            {!r.outcome.correct && (
              <p className="mt-1 text-[var(--color-ink-soft)]">
                Your answer: <span className="italic">{r.outcome.userAnswerLabel}</span> · Correct: <span className="font-medium">{r.outcome.correctAnswerLabel}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {onRetry && (
          <button onClick={onRetry} className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)]">
            Try again
          </button>
        )}
        <Link to="/dashboard" className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)]">
          View progress
        </Link>
        <Link to="/" className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)]">
          Back home
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-white p-4 text-center">
      <p className="font-display text-2xl font-semibold text-[var(--color-ink)] tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">{label}</p>
    </div>
  );
}

function promptOf(q: QuizResult["responses"][number]["question"]): string {
  switch (q.type) {
    case "assertion-reason":
      return q.assertion;
    case "flashcard":
      return q.front;
    default:
      return q.prompt;
  }
}
