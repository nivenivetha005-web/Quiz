import { useState } from "react";
import type { Topic } from "../types";
import { useProgress } from "../store/progress";
import { CategoryBadge } from "./Badges";
import ProgressBar from "./ProgressBar";

type Rating = "know" | "revise" | "dont-know";

export default function FlashcardDeck({ topics, onDone }: { topics: Topic[]; onDone: (summary: Record<Rating, number>) => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState<Record<Rating, number>>({ know: 0, revise: 0, "dont-know": 0 });
  const recordAnswer = useProgress((s) => s.recordAnswer);

  const topic = topics[index];
  if (!topic) {
    return <div className="p-8 text-center text-[var(--color-ink-soft)]">No flashcards available here yet.</div>;
  }

  function rate(r: Rating) {
    setTally((t) => ({ ...t, [r]: t[r] + 1 }));
    recordAnswer({
      question: {
        id: `flashcard-${topic.id}`,
        type: "flashcard",
        category: topic.category,
        topicIds: [topic.id],
        difficulty: "easy",
        level: 1,
        front: topic.title,
        back: topic.summary,
        explanation: topic.summary,
      },
      correct: r !== "dont-know",
      userAnswerLabel: r,
      correctAnswerLabel: "know",
    });
    if (index + 1 >= topics.length) {
      onDone({ ...tally, [r]: tally[r] + 1 });
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-8">
      <p className="mb-4 text-xs text-[var(--color-ink-faint)]">
        Card {index + 1} of {topics.length}
      </p>
      <ProgressBar value={index} max={topics.length} className="mb-6" />

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full rounded-2xl border border-[var(--color-line)] bg-white p-8 min-h-[16rem] flex flex-col items-center justify-center text-center shadow-sm transition-transform active:scale-[0.99]"
      >
        <CategoryBadge category={topic.category} className="mb-4" />
        {!flipped ? (
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[var(--color-ink)]">{topic.title}</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm sm:text-base leading-relaxed text-[var(--color-ink-soft)]">{topic.summary}</p>
            {topic.hook && (
              <p className="text-sm text-[var(--color-ink)]">
                <span className="font-medium">Hook: </span>
                {topic.hook}
              </p>
            )}
          </div>
        )}
        <p className="mt-5 text-xs text-[var(--color-ink-faint)]">{flipped ? "Tap to see the front" : "Tap to reveal"}</p>
      </button>

      {flipped && (
        <div className="mt-5 grid grid-cols-3 gap-2.5 animate-fade">
          <button onClick={() => rate("dont-know")} className="rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] px-3 py-3 text-sm font-medium text-[var(--color-accent)]">
            Don't know
          </button>
          <button onClick={() => rate("revise")} className="rounded-xl border border-[var(--color-gold)]/40 bg-[color-mix(in_srgb,var(--color-gold)_14%,white)] px-3 py-3 text-sm font-medium text-[var(--color-gold)]">
            Need revision
          </button>
          <button onClick={() => rate("know")} className="rounded-xl border border-[var(--color-teal)]/40 bg-[var(--color-teal-soft)] px-3 py-3 text-sm font-medium text-[var(--color-teal)]">
            Know it
          </button>
        </div>
      )}
    </div>
  );
}
