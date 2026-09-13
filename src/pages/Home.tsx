import { Link, useNavigate } from "react-router-dom";
import { useProgress } from "../store/progress";
import { overallProgressPct, dueTodayCount } from "../engine/stats";
import ProgressBar from "../components/ProgressBar";

const ACTIONS = [
  { to: "/quiz/daily", title: "Today's Quiz", desc: "20 questions, distributed across the full syllabus.", emoji: "☀️" },
  { to: "/learn", title: "Learn", desc: "Work through topics, one learning cycle at a time.", emoji: "📖" },
  { to: "/visual", title: "Visual GK", desc: "Recognition-first practice — crafts, art, architecture, logos.", emoji: "🖼️" },
  { to: "/current-affairs", title: "Current Affairs", desc: "Design, culture, tech, environment and India — date tagged.", emoji: "🗞️" },
  { to: "/schemes", title: "Government Schemes", desc: "Identify the Initiative — logos, purpose, ministry.", emoji: "🏛️" },
  { to: "/mistakes", title: "My Mistakes", desc: "Turn every wrong answer into a revision target.", emoji: "📝" },
  { to: "/quiz/weekly", title: "Weekly Checkpoint", desc: "30–50 mixed questions with a full performance report.", emoji: "📊" },
  { to: "/quiz/exam", title: "Mock Exam", desc: "Timed, randomised, gradually harder — no answers until the end.", emoji: "⏱️" },
];

export default function Home() {
  const navigate = useNavigate();
  const topicProgress = useProgress((s) => s.topicProgress);
  const questionsAnswered = useProgress((s) => s.questionsAnswered);
  const questionsCorrect = useProgress((s) => s.questionsCorrect);
  const streak = useProgress((s) => s.streakDays);

  const overall = overallProgressPct(topicProgress);
  const due = dueTodayCount(topicProgress);
  const started = questionsAnswered > 0;
  const accuracy = questionsAnswered ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-2xl animate-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">NID DAT 2027</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl font-semibold leading-[1.08] text-[var(--color-ink)]">Your Design GK Lab</h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--color-ink-soft)]">
          Learn → See → Practice → Quiz → Review → Repeat. Built for Interaction, New Media and Information Design candidates — recognise,
          connect and reason like a designer, rather than memorise a syllabus PDF.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => navigate(started ? "/study-plan" : "/beginner")}
            className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] shadow-sm transition-transform active:scale-[0.98]"
          >
            {started ? "Study for me →" : "I'm starting from zero →"}
          </button>
          <Link to="/quiz/daily" className="rounded-full border border-[var(--color-line)] bg-white px-6 py-3 text-sm font-medium text-[var(--color-ink)]">
            Today's Quiz
          </Link>
        </div>
      </div>

      {started && (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl animate-rise">
          <StatTile label="Overall progress" value={`${overall}%`} />
          <StatTile label="Accuracy" value={`${accuracy}%`} />
          <StatTile label="Streak" value={`${streak}d 🔥`} />
          <StatTile label="Revision due" value={`${due}`} accent={due > 0} />
        </div>
      )}

      <section className="mt-16">
        <h2 className="font-display text-xl font-semibold text-[var(--color-ink)] mb-5">Continue learning</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACTIONS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group rounded-2xl border border-[var(--color-line)] bg-white p-5 transition-all hover:border-[var(--color-ink-faint)] hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {a.emoji}
              </span>
              <p className="mt-3 font-display text-base font-semibold text-[var(--color-ink)]">{a.title}</p>
              <p className="mt-1 text-sm leading-snug text-[var(--color-ink-faint)]">{a.desc}</p>
              <span className="mt-3 inline-block text-xs font-medium text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-dim)] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--color-ink)]">September 2026 → Exam Learning Path</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)] max-w-xl">
              A syllabus-paced timeline from foundations through to your final mock — see what's due this month.
            </p>
          </div>
          <Link to="/study-plan" className="shrink-0 rounded-full bg-white border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)]">
            View my plan
          </Link>
        </div>
        <ProgressBar value={overall} max={100} className="mt-6" label="Overall syllabus coverage" />
      </section>
    </div>
  );
}

function StatTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 text-center ${accent ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]" : "border-[var(--color-line)] bg-white"}`}>
      <p className="font-display text-xl font-semibold text-[var(--color-ink)] tabular-nums">{value}</p>
      <p className="mt-0.5 text-[11px] text-[var(--color-ink-faint)]">{label}</p>
    </div>
  );
}
