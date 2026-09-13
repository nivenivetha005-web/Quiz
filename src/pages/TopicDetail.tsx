import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { topicById } from "../data";
import { allQuestions } from "../data/questions";
import { CATEGORY_META, LEVEL_META, type Level } from "../types";
import { useProgress } from "../store/progress";
import { CategoryBadge, LevelBadge } from "../components/Badges";

export default function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const topicProgress = useProgress((s) => s.topicProgress);

  if (!topicId || !topicById[topicId]) return <Navigate to="/learn" replace />;
  const topic = topicById[topicId];
  const progress = topicProgress[topic.id];
  const unlockedLevel: Level = progress?.unlockedLevel ?? 1;

  const relatedQuestions = allQuestions.filter((q) => q.topicIds.includes(topic.id));
  const meta = CATEGORY_META[topic.category];

  function practiceThis() {
    navigate(`/quiz/topic/${topic.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link to={`/learn/${topic.category}`} className="text-sm text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]">
        ← {meta.label}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <CategoryBadge category={topic.category} />
        <LevelBadge level={unlockedLevel} />
        {progress?.status && progress.status !== "new" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-paper-dim)] px-2.5 py-1 text-xs font-medium text-[var(--color-ink-soft)] capitalize">
            {progress.status.replace("-", " ")}
          </span>
        )}
      </div>

      <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">{topic.title}</h1>
      {topic.region && <p className="mt-1 text-sm text-[var(--color-ink-faint)]">{topic.region}</p>}
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">{topic.summary}</p>

      {topic.visualDescriptor && (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--color-line)] bg-[var(--color-paper-dim)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">See — visual identity</p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink)] italic">{topic.visualDescriptor}</p>
        </div>
      )}

      {topic.fields && topic.fields.length > 0 && (
        <div className="mt-6 grid sm:grid-cols-2 gap-2.5">
          {topic.fields.map((f) => (
            <div key={f.label} className="rounded-lg border border-[var(--color-line)] px-3.5 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">{f.label}</p>
              <p className="text-sm font-medium text-[var(--color-ink)]">{f.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)] mb-3">Key facts</p>
        <ul className="space-y-2.5">
          {topic.facts.map((f, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--color-ink)]">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {topic.connections && topic.connections.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-faint)] mb-3">Connections</p>
          <ul className="space-y-2">
            {topic.connections.map((c, i) => (
              <li key={i} className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                🔗 {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {topic.hook && (
        <div className="mt-6 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">Memory hook</p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]">{topic.hook}</p>
        </div>
      )}

      {topic.source && <p className="mt-4 text-xs text-[var(--color-ink-faint)]">Source: {topic.source}</p>}

      <div className="mt-10 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-dim)] p-5">
        <p className="font-display text-sm font-semibold text-[var(--color-ink)]">Level {unlockedLevel}: {LEVEL_META[unlockedLevel].label}</p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{LEVEL_META[unlockedLevel].question}</p>
        <p className="mt-3 text-xs text-[var(--color-ink-faint)]">
          {relatedQuestions.length} practice question{relatedQuestions.length === 1 ? "" : "s"} available for this topic. Answer correctly a
          few times in a row to unlock the next level.
        </p>
        <button
          onClick={practiceThis}
          disabled={relatedQuestions.length === 0}
          className="mt-4 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)] disabled:opacity-40"
        >
          Practise this topic
        </button>
      </div>
    </div>
  );
}
