import { Navigate, useParams } from "react-router-dom";
import { CATEGORY_META, type CategoryId } from "../types";
import { buildCategoryPractice } from "../engine/quizBuilders";
import QuizPage from "./QuizPage";

export default function CategoryQuizPage() {
  const { category } = useParams<{ category: string }>();
  if (!category || !(category in CATEGORY_META)) return <Navigate to="/learn" replace />;
  const cat = category as CategoryId;

  return (
    <QuizPage
      quizMode={`practice-${cat}`}
      title={`${CATEGORY_META[cat].short} Practice`}
      build={() => buildCategoryPractice(cat, { count: 12 })}
      emptyMessage="This category doesn't have practice questions yet — try Learn instead."
    />
  );
}
