import { Link } from "react-router-dom";

const MODES = [
  {
    to: "/quiz/visual",
    title: "Visual Identification",
    desc: "Read a visual clue — texture, colour, motif, form — and identify the craft, art, monument or logo it describes.",
    emoji: "🔍",
  },
  {
    to: "/quiz/visual-timed",
    title: "60-Second Visual GK",
    desc: "The same visual clues, but you only get a short window before you must answer. Good for exam-pace practice.",
    emoji: "⏱️",
  },
  {
    to: "/quiz/schemes",
    title: "Scheme Logo Quiz",
    desc: "Identify the Initiative — visual identity, tagline and colours of India's government schemes.",
    emoji: "🏛️",
  },
  {
    to: "/quiz/rapid",
    title: "Rapid Fire",
    desc: "30-second questions across every category — built for fast revision, not deep thought.",
    emoji: "⚡",
  },
];

export default function VisualGK() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">Recognition-first practice</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold text-[var(--color-ink)]">Visual GK</h1>
      <p className="mt-3 max-w-xl text-[var(--color-ink-soft)]">
        NID rewards recognition as much as recall. These modes train you to identify art, craft, architecture and civic symbols from their
        visual identity — texture, colour, motif and form — the way a designer actually reads an image.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        {MODES.map((m) => (
          <Link key={m.to} to={m.to} className="rounded-2xl border border-[var(--color-line)] bg-white p-5 hover:border-[var(--color-ink-faint)] hover:shadow-md transition-all">
            <span className="text-2xl" aria-hidden>
              {m.emoji}
            </span>
            <p className="mt-3 font-display text-lg font-semibold text-[var(--color-ink)]">{m.title}</p>
            <p className="mt-1 text-sm leading-snug text-[var(--color-ink-faint)]">{m.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-[var(--color-line)] bg-[var(--color-paper-dim)] p-4 text-xs text-[var(--color-ink-faint)]">
        A note on images: this build uses carefully written visual-identity descriptions rather than photographs, so recognition practice
        never depends on unverified or low-quality source images. Swap in a real image library behind the same question schema whenever
        one is available.
      </div>
    </div>
  );
}
