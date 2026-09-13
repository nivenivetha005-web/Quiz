import { useMemo, useState } from "react";
import type { Question, TopicProgress } from "../types";
import { useProgress } from "../store/progress";
import QuizRunner, { type QuizResult } from "../components/QuizRunner";
import QuizResults from "../components/QuizResults";

export default function QuizPage({
  quizMode,
  title,
  build,
  immediateFeedback = true,
  timerSeconds,
  perQuestionSeconds,
  emptyMessage,
}: {
  quizMode: string;
  title: string;
  build: (topicProgress: Record<string, TopicProgress>) => Question[];
  immediateFeedback?: boolean;
  timerSeconds?: number;
  perQuestionSeconds?: number;
  emptyMessage?: string;
}) {
  const topicProgress = useProgress((s) => s.topicProgress);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  const questions = useMemo(() => build(topicProgress), [attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (result) {
    return (
      <QuizResults
        result={result}
        title={title}
        onRetry={() => {
          setResult(null);
          setAttempt((a) => a + 1);
        }}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-16 text-center">
        <p className="font-display text-xl font-semibold text-[var(--color-ink)]">Nothing to show yet</p>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{emptyMessage ?? "There aren't enough questions in this set yet."}</p>
      </div>
    );
  }

  return (
    <QuizRunner
      key={attempt}
      questions={questions}
      mode={quizMode}
      title={title}
      immediateFeedback={immediateFeedback}
      timerSeconds={timerSeconds}
      perQuestionSeconds={perQuestionSeconds}
      onFinish={setResult}
    />
  );
}
