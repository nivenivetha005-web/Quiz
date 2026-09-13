import { buildSchemeQuiz } from "../engine/quizBuilders";
import QuizPage from "./QuizPage";

export default function SchemesQuizPage() {
  return (
    <QuizPage
      quizMode="schemes"
      title="Identify the Initiative"
      build={() => buildSchemeQuiz(15)}
      emptyMessage="No scheme questions available yet."
    />
  );
}
