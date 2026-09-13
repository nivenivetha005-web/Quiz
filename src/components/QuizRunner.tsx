import { useEffect, useMemo, useRef, useState } from "react";
import type { CategoryId, Question } from "../types";
import { useProgress } from "../store/progress";
import QuestionCard, { type AnswerOutcome } from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import { CATEGORY_META } from "../types";

export interface QuizResult {
  total: number;
  correct: number;
  byCategory: Record<string, { correct: number; total: number }>;
  avgSeconds: number;
  responses: { question: Question; outcome: AnswerOutcome; seconds: number }[];
}

export default function QuizRunner({
  questions,
  mode,
  immediateFeedback = true,
  timerSeconds,
  perQuestionSeconds,
  onFinish,
  title,
}: {
  questions: Question[];
  mode: string;
  immediateFeedback?: boolean;
  timerSeconds?: number;
  perQuestionSeconds?: number;
  onFinish: (result: QuizResult) => void;
  title?: string;
}) {
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const recordQuizResult = useProgress((s) => s.recordQuizResult);

  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [responses, setResponses] = useState<{ question: Question; outcome: AnswerOutcome; seconds: number }[]>([]);
  const responsesRef = useRef(responses);
  responsesRef.current = responses;
  const [questionStart, setQuestionStart] = useState(() => Date.now());
  const [remaining, setRemaining] = useState(timerSeconds ?? 0);
  const [qRemaining, setQRemaining] = useState(perQuestionSeconds ?? 0);
  const [revealed, setRevealed] = useState(false);
  const finishedRef = useRef(false);
  const answeredRef = useRef(false);

  const q = questions[index];

  useEffect(() => {
    setAnswered(false);
    setRevealed(false);
    setQuestionStart(Date.now());
  }, [index]);

  useEffect(() => {
    answeredRef.current = answered;
  }, [answered]);

  useEffect(() => {
    if (!perQuestionSeconds) return;
    setQRemaining(perQuestionSeconds);
    const t = setInterval(() => {
      setQRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          if (!answeredRef.current) handleTimeout();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, perQuestionSeconds]);

  useEffect(() => {
    if (!timerSeconds) return;
    setRemaining(timerSeconds);
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          finish();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerSeconds]);

  function handleTimeout() {
    setAnswered(true);
    setRevealed(true);
    const outcome: AnswerOutcome = { correct: false, userAnswerLabel: "(no answer — time up)", correctAnswerLabel: correctAnswerLabelOf(q) };
    recordAnswer({ question: q, correct: false, userAnswerLabel: outcome.userAnswerLabel, correctAnswerLabel: outcome.correctAnswerLabel });
    setResponses((r) => [...r, { question: q, outcome, seconds: perQuestionSeconds ?? 0 }]);
  }

  function handleAnswer(outcome: AnswerOutcome) {
    const seconds = (Date.now() - questionStart) / 1000;
    setAnswered(true);
    recordAnswer({ question: q, correct: outcome.correct, userAnswerLabel: outcome.userAnswerLabel, correctAnswerLabel: outcome.correctAnswerLabel });
    setResponses((r) => [...r, { question: q, outcome, seconds }]);
  }

  function next() {
    if (index + 1 >= questions.length) {
      finish();
    } else {
      setIndex((i) => i + 1);
    }
  }

  function finish(finalResponses = responsesRef.current) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const byCategory: Record<string, { correct: number; total: number }> = {};
    for (const r of finalResponses) {
      const c = r.question.category;
      byCategory[c] ??= { correct: 0, total: 0 };
      byCategory[c].total += 1;
      if (r.outcome.correct) byCategory[c].correct += 1;
    }
    const correct = finalResponses.filter((r) => r.outcome.correct).length;
    const avgSeconds = finalResponses.length ? finalResponses.reduce((s, r) => s + r.seconds, 0) / finalResponses.length : 0;
    recordQuizResult(mode, finalResponses.length, correct, byCategory);
    onFinish({ total: finalResponses.length, correct, byCategory, avgSeconds, responses: finalResponses });
  }

  const pct = useMemo(() => ((index + (answered ? 1 : 0)) / questions.length) * 100, [index, answered, questions.length]);

  if (!q) {
    return <div className="p-8 text-center text-[var(--color-ink-soft)]">No questions available for this quiz yet.</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          {title && <h1 className="font-display text-xl font-semibold text-[var(--color-ink)]">{title}</h1>}
          <p className="text-xs text-[var(--color-ink-faint)] mt-0.5">
            Question {index + 1} of {questions.length} · <CategoryLabel category={q.category} />
          </p>
        </div>
        {timerSeconds ? (
          <div className={`tabular-nums rounded-full px-3 py-1.5 text-sm font-semibold ${remaining <= 10 ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "bg-[var(--color-paper-dim)] text-[var(--color-ink-soft)]"}`}>
            {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
          </div>
        ) : perQuestionSeconds ? (
          <div className={`tabular-nums rounded-full px-3 py-1.5 text-sm font-semibold ${qRemaining <= 10 ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]" : "bg-[var(--color-paper-dim)] text-[var(--color-ink-soft)]"}`}>
            {qRemaining}s
          </div>
        ) : null}
      </div>

      <ProgressBar value={index + (answered ? 1 : 0)} max={questions.length} className="mb-8" />

      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5 sm:p-7 shadow-sm">
        <QuestionCard key={q.id} question={q} revealed={revealed} onAnswer={handleAnswer} showImmediateFeedback={immediateFeedback} />
      </div>

      {answered && (
        <button
          onClick={next}
          className="mt-6 w-full rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] transition-transform active:scale-[0.99] animate-fade"
        >
          {index + 1 >= questions.length ? "See results" : "Next question"}
        </button>
      )}
      <div className="mt-2 text-right text-xs text-[var(--color-ink-faint)] tabular-nums">{Math.round(pct)}% through this session</div>
    </div>
  );
}

function CategoryLabel({ category }: { category: CategoryId }) {
  return <span>{CATEGORY_META[category].label}</span>;
}

function correctAnswerLabelOf(q: Question): string {
  switch (q.type) {
    case "mcq":
    case "scenario":
    case "visual-id":
      return q.options[q.correctIndex];
    case "odd-one-out":
      return q.items[q.oddIndex];
    case "assertion-reason":
      return `Option ${q.correctIndex + 1}`;
    case "match":
      return q.pairs.map((p) => `${p.left} → ${p.right}`).join("; ");
    case "sequence":
      return q.correctOrder.join(" → ");
    case "flashcard":
      return q.back;
  }
}
