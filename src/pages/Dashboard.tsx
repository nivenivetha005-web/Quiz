import { Link } from "react-router-dom";
import { useProgress } from "../store/progress";
import { categoryMasteryList, overallProgressPct, dueTodayCount, topicsByStatus } from "../engine/stats";
import { CATEGORY_META } from "../types";
import ProgressBar from "../components/ProgressBar";

export default function Dashboard() {
  const topicProgress = useProgress((s) => s.topicProgress);
  const mistakes = useProgress((s) => s.mistakes);
  const questionsAnswered = useProgress((s) => s.questionsAnswered);
  const questionsCorrect = useProgress((s) => s.questionsCorrect);
  const streak = useProgress((s) => s.streakDays);
  const quizHistory = useProgress((s) => s.quizHistory);

  const overall = overallProgressPct(topicProgress);
  const due = dueTodayCount(topicProgress);
  const accuracy = questionsAnswered ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0;
  const mastery = categoryMasteryList(topicProgress);
  const mastered = topicsByStatus(topicProgress, "mastered");
  const weak = topicsByStatus(topicProgress, "needs-revision");
  const openMistakes = Object.values(mistakes).filter((m) => !m.resolved).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">Progress Dashboard</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">How you're doing</h1>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Overall progress" value={`${overall}%`} />
        <Stat label="Questions answered" value={`${questionsAnswered}`} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Current streak" value={`${streak}d`} />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-[var(--color-ink)] mb-4">Category mastery</h2>
        <div className="space-y-4">
          {mastery.map((m) => (
            <div key={m.category}>
              <ProgressBar value={m.pct} max={100} color={CATEGORY_META[m.category].color} label={CATEGORY_META[m.category].label} />
              <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
                {m.touched}/{m.totalTopics} topics touched · {m.mastered} mastered · {m.needsRevision} need revision
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Revision due today</p>
          <p className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] tabular-nums">{due}</p>
          <Link to="/study-plan" className="mt-3 inline-block text-xs font-medium text-[var(--color-accent)]">
            Build today's plan →
          </Link>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Open mistakes</p>
          <p className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] tabular-nums">{openMistakes}</p>
          <Link to="/mistakes" className="mt-3 inline-block text-xs font-medium text-[var(--color-accent)]">
            Review mistakes →
          </Link>
        </div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">Topics mastered</p>
          <p className="mt-2 font-display text-3xl font-semibold text-[var(--color-ink)] tabular-nums">{mastered.length}</p>
        </div>
      </div>

      {weak.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-[var(--color-ink)] mb-3">Needs revision</h2>
          <div className="flex flex-wrap gap-2">
            {weak.slice(0, 12).map((t) => (
              <Link key={t.id} to={`/topic/${t.id}`} className="rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent)]">
                {t.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {quizHistory.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold text-[var(--color-ink)] mb-3">Recent sessions</h2>
          <div className="space-y-2">
            {[...quizHistory]
              .slice(-8)
              .reverse()
              .map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-sm">
                  <span className="capitalize text-[var(--color-ink)]">{h.mode.replace(/-/g, " ")}</span>
                  <span className="text-[var(--color-ink-faint)]">{h.date}</span>
                  <span className="tabular-nums font-medium text-[var(--color-ink)]">
                    {h.correct}/{h.total}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-white p-4 text-center">
      <p className="font-display text-xl font-semibold text-[var(--color-ink)] tabular-nums">{value}</p>
      <p className="mt-0.5 text-[11px] text-[var(--color-ink-faint)]">{label}</p>
    </div>
  );
}
