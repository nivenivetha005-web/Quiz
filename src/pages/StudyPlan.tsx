import { Link } from "react-router-dom";
import { useProgress } from "../store/progress";
import { buildStudyPlan, totalPlanMinutes, WEEKDAY_LABELS, defaultScheduleFor } from "../engine/studyPlanner";

const ACTION_LINK: Record<string, string> = {
  "quiz-mistakes": "/quiz/mistakes",
  "quiz-schemes": "/quiz/schemes",
  "quiz-current-affairs": "/quiz/current-affairs",
  "quiz-mixed": "/quiz/daily",
};

export default function StudyPlan() {
  const topicProgress = useProgress((s) => s.topicProgress);
  const mistakes = useProgress((s) => s.mistakes);
  const openMistakes = Object.values(mistakes).filter((m) => !m.resolved).length;

  const plan = buildStudyPlan(topicProgress, openMistakes);
  const minutes = totalPlanMinutes(plan);
  const today = new Date().getDay();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">Study For Me</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">Today's {minutes}-minute plan</h1>
      <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
        Built from your revision schedule, weak topics, recent mistakes and overall syllabus coverage — not a random pick.
      </p>

      <div className="mt-8 space-y-3">
        {plan.map((block, i) => (
          <div key={block.id} className="flex items-start gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-paper-dim)] font-display text-sm font-semibold text-[var(--color-ink)]">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-[var(--color-ink)]">
                {block.title} <span className="text-xs font-normal text-[var(--color-ink-faint)]">· {block.minutes} min</span>
              </p>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{block.description}</p>
              <Link
                to={block.action.type === "learn" ? `/topic/${block.action.topicId}` : ACTION_LINK[block.action.type] ?? "/"}
                className="mt-2 inline-block text-xs font-medium text-[var(--color-accent)]"
              >
                Start this block →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg font-semibold text-[var(--color-ink)] mb-3">Weekly study structure</h2>
        <p className="text-sm text-[var(--color-ink-soft)] mb-4">A default rhythm — treat it as a suggestion, not a rulebook.</p>
        <div className="grid gap-2">
          {WEEKDAY_LABELS.map((label, idx) => {
            const info = defaultScheduleFor(idx);
            const isToday = idx === today;
            return (
              <div
                key={label}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${isToday ? "border-[var(--color-ink)] bg-[var(--color-paper-dim)]" : "border-[var(--color-line)]"}`}
              >
                <span className="font-medium text-[var(--color-ink)] w-24 shrink-0">{label}</span>
                <span className="flex-1 text-[var(--color-ink-soft)]">{info.title}</span>
                {isToday && <span className="shrink-0 text-xs font-medium text-[var(--color-accent)]">Today</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
