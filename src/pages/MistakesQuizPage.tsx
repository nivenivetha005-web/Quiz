import { useProgress } from "../store/progress";
import { buildMistakesQuiz } from "../engine/quizBuilders";
import QuizPage from "./QuizPage";

export default function MistakesQuizPage() {
  const mistakes = useProgress((s) => s.mistakes);
  const ids = Object.values(mistakes)
    .filter((m) => !m.resolved)
    .map((m) => m.id);

  return (
    <QuizPage
      quizMode="mistakes"
      title="Quiz My Mistakes"
      build={() => buildMistakesQuiz(ids)}
      emptyMessage="No open mistakes right now — nicely done. Keep quizzing to build this list, or revisit later."
    />
  );
}
