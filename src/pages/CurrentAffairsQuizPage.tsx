import { buildCurrentAffairsQuiz } from "../engine/quizBuilders";
import QuizPage from "./QuizPage";

export default function CurrentAffairsQuizPage() {
  return (
    <QuizPage
      quizMode="current-affairs"
      title="Current Affairs Quiz"
      build={() => buildCurrentAffairsQuiz(365, 12)}
      emptyMessage="No current affairs questions available yet."
    />
  );
}
