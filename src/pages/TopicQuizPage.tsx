import { Navigate, useParams } from "react-router-dom";
import { topicById } from "../data";
import { allQuestions } from "../data/questions";
import { shuffle } from "../engine/quizBuilders";
import QuizPage from "./QuizPage";

export default function TopicQuizPage() {
  const { topicId } = useParams<{ topicId: string }>();
  if (!topicId || !topicById[topicId]) return <Navigate to="/learn" replace />;
  const topic = topicById[topicId];

  return (
    <QuizPage
      quizMode={`topic-${topicId}`}
      title={`Practising: ${topic.title}`}
      build={() => shuffle(allQuestions.filter((q) => q.topicIds.includes(topicId)))}
      emptyMessage="No practice questions for this topic yet — check back soon."
    />
  );
}
