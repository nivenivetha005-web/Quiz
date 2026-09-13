import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import CategoryTopics from "./pages/CategoryTopics";
import TopicDetail from "./pages/TopicDetail";
import VisualGK from "./pages/VisualGK";
import CurrentAffairs from "./pages/CurrentAffairs";
import Schemes from "./pages/Schemes";
import Mistakes from "./pages/Mistakes";
import Dashboard from "./pages/Dashboard";
import StudyPlan from "./pages/StudyPlan";
import Beginner from "./pages/Beginner";
import Flashcards from "./pages/Flashcards";
import QuizPage from "./pages/QuizPage";
import CategoryQuizPage from "./pages/CategoryQuizPage";
import TopicQuizPage from "./pages/TopicQuizPage";
import MistakesQuizPage from "./pages/MistakesQuizPage";
import SchemesQuizPage from "./pages/SchemesQuizPage";
import CurrentAffairsQuizPage from "./pages/CurrentAffairsQuizPage";
import {
  buildDailyQuiz,
  buildWeeklyQuiz,
  buildMonthlyMock,
  buildExamSimulation,
  buildRapidFire,
  buildVisualQuiz,
} from "./engine/quizBuilders";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:category" element={<CategoryTopics />} />
          <Route path="/topic/:topicId" element={<TopicDetail />} />
          <Route path="/flashcards/:category" element={<Flashcards />} />

          <Route path="/visual" element={<VisualGK />} />
          <Route path="/current-affairs" element={<CurrentAffairs />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/beginner" element={<Beginner />} />

          <Route
            path="/quiz/daily"
            element={<QuizPage quizMode="daily" title="Today's NID GK — 20 Questions" build={buildDailyQuiz} />}
          />
          <Route
            path="/quiz/weekly"
            element={<QuizPage quizMode="weekly" title="NID Weekly Checkpoint" build={(tp) => buildWeeklyQuiz(tp, 36)} />}
          />
          <Route
            path="/quiz/monthly"
            element={<QuizPage quizMode="monthly" title="NID Monthly GK Mock" build={(tp) => buildMonthlyMock(tp, 100)} />}
          />
          <Route
            path="/quiz/exam"
            element={
              <QuizPage
                quizMode="exam"
                title="NID DAT GK Simulation"
                build={() => buildExamSimulation(40)}
                immediateFeedback={false}
                timerSeconds={35 * 60}
              />
            }
          />
          <Route
            path="/quiz/rapid"
            element={
              <QuizPage quizMode="rapid" title="Rapid Fire" build={() => buildRapidFire(15)} perQuestionSeconds={30} />
            }
          />
          <Route
            path="/quiz/visual"
            element={<QuizPage quizMode="visual" title="Visual Identification" build={() => buildVisualQuiz(15)} />}
          />
          <Route
            path="/quiz/visual-timed"
            element={
              <QuizPage quizMode="visual-timed" title="60-Second Visual GK" build={() => buildVisualQuiz(12)} perQuestionSeconds={60} />
            }
          />
          <Route path="/quiz/schemes" element={<SchemesQuizPage />} />
          <Route path="/quiz/current-affairs" element={<CurrentAffairsQuizPage />} />
          <Route path="/quiz/mistakes" element={<MistakesQuizPage />} />
          <Route path="/quiz/category/:category" element={<CategoryQuizPage />} />
          <Route path="/quiz/topic/:topicId" element={<TopicQuizPage />} />

          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
