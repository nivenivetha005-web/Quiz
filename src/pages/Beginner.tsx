import { useState } from "react";
import { Link } from "react-router-dom";
import { topicById } from "../data";
import { CategoryBadge } from "../components/Badges";
import ProgressBar from "../components/ProgressBar";

/** A hand-picked, gentle sequence across categories — no prior knowledge assumed. */
const BEGINNER_SEQUENCE = [
  "art-madhubani",
  "id-ux",
  "movement-bauhaus",
  "craft-dhokra",
  "arch-nagara",
  "sus-circular-economy",
  "heritage-gi-tags-overview",
  "tech-generative-ai",
  "principle-affordance",
  "sci-light-colour",
].filter((id) => topicById[id]);

export default function Beginner() {
  const [index, setIndex] = useState(0);
  const topic = topicById[BEGINNER_SEQUENCE[index]];

  if (!topic) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">I'm starting from zero</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">Let's build up slowly</h1>
      <p className="mt-3 text-[var(--color-ink-soft)]">
        No prior knowledge assumed. We'll go one idea at a time, across categories, so nothing feels like a giant PDF to memorise.
      </p>

      <ProgressBar value={index} max={BEGINNER_SEQUENCE.length} className="mt-8 mb-2" />
      <p className="text-xs text-[var(--color-ink-faint)]">
        Topic {index + 1} of {BEGINNER_SEQUENCE.length}
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-white p-6 animate-rise" key={topic.id}>
        <CategoryBadge category={topic.category} />
        <h2 className="mt-3 font-display text-2xl font-semibold text-[var(--color-ink)]">{topic.title}</h2>
        <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">{topic.summary}</p>
        <ul className="mt-4 space-y-2">
          {topic.facts.slice(0, 3).map((f, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--color-ink)]">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
              {f}
            </li>
          ))}
        </ul>
        {topic.hook && (
          <p className="mt-4 rounded-lg bg-[var(--color-accent-soft)] p-3 text-sm text-[var(--color-ink)]">
            <span className="font-medium">Remember it as: </span>
            {topic.hook}
          </p>
        )}
        <Link to={`/topic/${topic.id}`} className="mt-4 inline-block text-xs font-medium text-[var(--color-accent)]">
          See the full lesson →
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] disabled:opacity-30"
        >
          ← Back
        </button>
        {index + 1 < BEGINNER_SEQUENCE.length ? (
          <button onClick={() => setIndex((i) => i + 1)} className="rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-semibold text-[var(--color-paper)]">
            Next idea →
          </button>
        ) : (
          <Link to="/quiz/daily" className="rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-semibold text-[var(--color-paper)]">
            Try a warm-up quiz →
          </Link>
        )}
      </div>
    </div>
  );
}
