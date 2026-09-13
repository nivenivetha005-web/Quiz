import { useMemo, useState, useEffect } from "react";
import type { Question } from "../types";
import { STANDARD_AR_OPTIONS } from "../types";
import { shuffle } from "../engine/quizBuilders";
import { DifficultyBadge, LevelBadge } from "./Badges";

export interface AnswerOutcome {
  correct: boolean;
  userAnswerLabel: string;
  correctAnswerLabel: string;
}

interface Props {
  question: Question;
  revealed: boolean;
  onAnswer: (outcome: AnswerOutcome) => void;
  showImmediateFeedback: boolean;
}

export default function QuestionCard({ question, revealed, onAnswer, showImmediateFeedback }: Props) {
  const q = question;

  return (
    <div className="animate-rise">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={q.difficulty} />
        <LevelBadge level={q.level} />
        {(q.type === "scenario") && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-plum-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-plum)]">
            Scenario
          </span>
        )}
        {q.type === "visual-id" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-teal-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-teal)]">
            Identify
          </span>
        )}
      </div>

      {renderBody(q, revealed, onAnswer, showImmediateFeedback)}
    </div>
  );
}

function renderBody(q: Question, revealed: boolean, onAnswer: (o: AnswerOutcome) => void, immediate: boolean) {
  switch (q.type) {
    case "mcq":
    case "scenario":
    case "visual-id":
      return <MCQBody q={q} revealed={revealed} onAnswer={onAnswer} immediate={immediate} />;
    case "odd-one-out":
      return <OddOneOutBody q={q} revealed={revealed} onAnswer={onAnswer} immediate={immediate} />;
    case "assertion-reason":
      return <AssertionReasonBody q={q} revealed={revealed} onAnswer={onAnswer} immediate={immediate} />;
    case "match":
      return <MatchBody q={q} revealed={revealed} onAnswer={onAnswer} immediate={immediate} />;
    case "sequence":
      return <SequenceBody q={q} revealed={revealed} onAnswer={onAnswer} immediate={immediate} />;
    case "flashcard":
      return null;
  }
}

function ExplanationBlock({ correct, explanation, hook }: { correct: boolean; explanation: string; hook?: string }) {
  return (
    <div className={`mt-5 rounded-xl border p-4 animate-fade ${correct ? "border-[var(--color-teal)]/30 bg-[var(--color-teal-soft)]" : "border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)]"}`}>
      <p className="font-display text-sm font-semibold" style={{ color: correct ? "var(--color-teal)" : "var(--color-accent)" }}>
        {correct ? "Correct 💗" : "Not quite."}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">{explanation}</p>
      {hook && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
          <span className="font-medium">Memory hook: </span>
          {hook}
        </p>
      )}
    </div>
  );
}

function OptionButton({
  children,
  state,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  state: "idle" | "selected" | "correct" | "incorrect" | "reveal-correct";
  onClick: () => void;
  disabled: boolean;
}) {
  const styles: Record<string, string> = {
    idle: "border-[var(--color-line)] hover:border-[var(--color-ink-faint)] bg-white",
    selected: "border-[var(--color-ink)] bg-[var(--color-paper-dim)]",
    correct: "border-[var(--color-teal)] bg-[var(--color-teal-soft)]",
    incorrect: "border-[var(--color-accent)] bg-[var(--color-accent-soft)]",
    "reveal-correct": "border-[var(--color-teal)] bg-[var(--color-teal-soft)]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium text-[var(--color-ink)] transition-colors disabled:cursor-default ${styles[state]}`}
    >
      {children}
    </button>
  );
}

function MCQBody({
  q,
  revealed,
  onAnswer,
  immediate,
}: {
  q: Extract<Question, { type: "mcq" | "scenario" | "visual-id" }>;
  revealed: boolean;
  onAnswer: (o: AnswerOutcome) => void;
  immediate: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => setSelected(null), [q.id]);

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    onAnswer({
      correct: i === q.correctIndex,
      userAnswerLabel: q.options[i],
      correctAnswerLabel: q.options[q.correctIndex],
    });
  }

  return (
    <div>
      {q.visualDescriptor && (
        <div className="mb-4 rounded-xl border border-dashed border-[var(--color-line)] bg-[var(--color-paper-dim)] p-4 text-sm italic text-[var(--color-ink-soft)]">
          <span className="not-italic font-medium text-[var(--color-ink)]">Visual clue: </span>
          {q.visualDescriptor}
        </div>
      )}
      <p className="font-display text-lg sm:text-xl leading-snug text-[var(--color-ink)]">{q.prompt}</p>
      <div className="mt-5 grid gap-2.5">
        {q.options.map((opt, i) => {
          let state: "idle" | "selected" | "correct" | "incorrect" | "reveal-correct" = "idle";
          if (selected !== null || revealed) {
            if (i === q.correctIndex) state = "correct";
            else if (i === selected) state = "incorrect";
          }
          return (
            <OptionButton key={i} state={state} disabled={selected !== null || revealed} onClick={() => choose(i)}>
              {opt}
            </OptionButton>
          );
        })}
      </div>
      {immediate && selected !== null && <ExplanationBlock correct={selected === q.correctIndex} explanation={q.explanation} hook={q.hook} />}
    </div>
  );
}

function OddOneOutBody({
  q,
  revealed,
  onAnswer,
  immediate,
}: {
  q: Extract<Question, { type: "odd-one-out" }>;
  revealed: boolean;
  onAnswer: (o: AnswerOutcome) => void;
  immediate: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => setSelected(null), [q.id]);

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    onAnswer({ correct: i === q.oddIndex, userAnswerLabel: q.items[i], correctAnswerLabel: q.items[q.oddIndex] });
  }

  return (
    <div>
      <p className="font-display text-lg sm:text-xl leading-snug text-[var(--color-ink)]">{q.prompt}</p>
      <div className="mt-5 grid gap-2.5">
        {q.items.map((item, i) => {
          let state: "idle" | "selected" | "correct" | "incorrect" = "idle";
          if (selected !== null || revealed) {
            if (i === q.oddIndex) state = "correct";
            else if (i === selected) state = "incorrect";
          }
          return (
            <OptionButton key={i} state={state} disabled={selected !== null || revealed} onClick={() => choose(i)}>
              {item}
            </OptionButton>
          );
        })}
      </div>
      {immediate && selected !== null && <ExplanationBlock correct={selected === q.oddIndex} explanation={q.explanation} hook={q.hook} />}
    </div>
  );
}

function AssertionReasonBody({
  q,
  revealed,
  onAnswer,
  immediate,
}: {
  q: Extract<Question, { type: "assertion-reason" }>;
  revealed: boolean;
  onAnswer: (o: AnswerOutcome) => void;
  immediate: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => setSelected(null), [q.id]);

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    onAnswer({ correct: i === q.correctIndex, userAnswerLabel: STANDARD_AR_OPTIONS[i], correctAnswerLabel: STANDARD_AR_OPTIONS[q.correctIndex] });
  }

  return (
    <div>
      <div className="space-y-2 rounded-xl bg-[var(--color-paper-dim)] p-4 text-sm">
        <p><span className="font-semibold">Assertion (A): </span>{q.assertion}</p>
        <p><span className="font-semibold">Reason (R): </span>{q.reason}</p>
      </div>
      <div className="mt-5 grid gap-2.5">
        {STANDARD_AR_OPTIONS.map((opt, i) => {
          let state: "idle" | "selected" | "correct" | "incorrect" = "idle";
          if (selected !== null || revealed) {
            if (i === q.correctIndex) state = "correct";
            else if (i === selected) state = "incorrect";
          }
          return (
            <OptionButton key={i} state={state} disabled={selected !== null || revealed} onClick={() => choose(i)}>
              {opt}
            </OptionButton>
          );
        })}
      </div>
      {immediate && selected !== null && <ExplanationBlock correct={selected === q.correctIndex} explanation={q.explanation} hook={q.hook} />}
    </div>
  );
}

function MatchBody({
  q,
  revealed,
  onAnswer,
  immediate,
}: {
  q: Extract<Question, { type: "match" }>;
  revealed: boolean;
  onAnswer: (o: AnswerOutcome) => void;
  immediate: boolean;
}) {
  const rightOptions = useMemo(() => shuffle(q.pairs.map((p) => p.right)), [q.id]);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setSelections({});
    setChecked(false);
  }, [q.id]);

  function submit() {
    if (checked) return;
    const allCorrect = q.pairs.every((p, i) => selections[i] === p.right);
    setChecked(true);
    onAnswer({
      correct: allCorrect,
      userAnswerLabel: q.pairs.map((p, i) => `${p.left} → ${selections[i] ?? "—"}`).join("; "),
      correctAnswerLabel: q.pairs.map((p) => `${p.left} → ${p.right}`).join("; "),
    });
  }

  const complete = q.pairs.every((_, i) => selections[i]);

  return (
    <div>
      <p className="font-display text-lg sm:text-xl leading-snug text-[var(--color-ink)]">{q.prompt}</p>
      <div className="mt-5 space-y-2.5">
        {q.pairs.map((p, i) => {
          const isCorrect = selections[i] === p.right;
          return (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-[var(--color-line)] p-3">
              <div className="sm:w-1/2 text-sm font-medium text-[var(--color-ink)]">{p.left}</div>
              <select
                disabled={checked || revealed}
                value={selections[i] ?? ""}
                onChange={(e) => setSelections((s) => ({ ...s, [i]: e.target.value }))}
                className={`sm:w-1/2 rounded-lg border px-3 py-2 text-sm bg-white disabled:opacity-80 ${
                  (checked || revealed) ? (isCorrect ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)]" : "border-[var(--color-accent)] bg-[var(--color-accent-soft)]") : "border-[var(--color-line)]"
                }`}
              >
                <option value="" disabled>
                  Choose a match…
                </option>
                {rightOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {!checked && !revealed && (
        <button
          onClick={submit}
          disabled={!complete}
          className="mt-4 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] disabled:opacity-40"
        >
          Check matches
        </button>
      )}
      {immediate && checked && (
        <ExplanationBlock correct={q.pairs.every((p, i) => selections[i] === p.right)} explanation={q.explanation} hook={q.hook} />
      )}
    </div>
  );
}

function SequenceBody({
  q,
  revealed,
  onAnswer,
  immediate,
}: {
  q: Extract<Question, { type: "sequence" }>;
  revealed: boolean;
  onAnswer: (o: AnswerOutcome) => void;
  immediate: boolean;
}) {
  const shuffled = useMemo(() => shuffle(q.correctOrder), [q.id]);
  const [built, setBuilt] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setBuilt([]);
    setChecked(false);
  }, [q.id]);

  function addItem(item: string) {
    if (checked || built.includes(item)) return;
    setBuilt((b) => [...b, item]);
  }
  function removeLast() {
    if (checked) return;
    setBuilt((b) => b.slice(0, -1));
  }
  function submit() {
    if (checked || built.length !== q.correctOrder.length) return;
    const correct = built.every((item, i) => item === q.correctOrder[i]);
    setChecked(true);
    onAnswer({ correct, userAnswerLabel: built.join(" → "), correctAnswerLabel: q.correctOrder.join(" → ") });
  }

  return (
    <div>
      <p className="font-display text-lg sm:text-xl leading-snug text-[var(--color-ink)]">{q.prompt}</p>

      <div className="mt-5 min-h-[3rem] rounded-xl border-2 border-dashed border-[var(--color-line)] p-3 flex flex-wrap gap-2">
        {built.length === 0 && <span className="text-sm text-[var(--color-ink-faint)]">Tap items below to build your sequence…</span>}
        {built.map((item, i) => (
          <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-ink)] px-3 py-1.5 text-xs font-medium text-[var(--color-paper)]">
            <span className="opacity-60">{i + 1}.</span>
            {item}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {shuffled
          .filter((item) => !built.includes(item))
          .map((item) => (
            <button
              key={item}
              disabled={checked || revealed}
              onClick={() => addItem(item)}
              className="rounded-full border border-[var(--color-line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:border-[var(--color-ink-faint)] disabled:opacity-50"
            >
              {item}
            </button>
          ))}
      </div>

      <div className="mt-4 flex gap-2">
        {!checked && !revealed && built.length > 0 && (
          <button onClick={removeLast} className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)]">
            Undo last
          </button>
        )}
        {!checked && !revealed && (
          <button
            onClick={submit}
            disabled={built.length !== q.correctOrder.length}
            className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] disabled:opacity-40"
          >
            Check order
          </button>
        )}
      </div>

      {checked && (
        <div className="mt-3 text-sm text-[var(--color-ink-soft)]">
          <span className="font-medium">Correct order: </span>
          {q.correctOrder.join(" → ")}
        </div>
      )}

      {immediate && checked && (
        <ExplanationBlock correct={built.every((item, i) => item === q.correctOrder[i])} explanation={q.explanation} hook={q.hook} />
      )}
    </div>
  );
}
