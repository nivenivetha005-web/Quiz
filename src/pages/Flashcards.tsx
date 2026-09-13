import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CATEGORY_META, type CategoryId } from "../types";
import { topicsByCategory } from "../data";
import { shuffle } from "../engine/quizBuilders";
import FlashcardDeck from "../components/FlashcardDeck";

export default function Flashcards() {
  const { category } = useParams<{ category: string }>();
  const [done, setDone] = useState<{ know: number; revise: number; "dont-know": number } | null>(null);
  const [deck] = useState(() => (category && CATEGORY_META[category as CategoryId] ? shuffle(topicsByCategory[category as CategoryId] ?? []).slice(0, 15) : []));

  if (!category || !(category in CATEGORY_META)) return <Navigate to="/learn" replace />;
  const meta = CATEGORY_META[category as CategoryId];

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-16 text-center animate-rise">
        <p className="font-display text-2xl font-semibold text-[var(--color-ink)]">Deck complete</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <SummaryTile label="Know it" value={done.know} color="var(--color-teal)" />
          <SummaryTile label="Revise" value={done.revise} color="var(--color-gold)" />
          <SummaryTile label="Don't know" value={done["dont-know"]} color="var(--color-accent)" />
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={`/learn/${category}`} className="rounded-full border border-[var(--color-line)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)]">
            Back to {meta.short}
          </Link>
          <Link to={`/quiz/category/${category}`} className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-paper)]">
            Take a quiz →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-xl px-4 sm:px-6 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">{meta.short} Flashcards</p>
      </div>
      <FlashcardDeck topics={deck} onDone={setDone} />
    </div>
  );
}

function SummaryTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] p-4">
      <p className="font-display text-2xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-[var(--color-ink-faint)]">{label}</p>
    </div>
  );
}
