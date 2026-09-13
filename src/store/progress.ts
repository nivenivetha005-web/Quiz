import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CategoryId,
  Level,
  Mistake,
  Question,
  TopicProgress,
  TopicStatus,
} from "../types";

/** Spaced-repetition ladder in days: 1 -> 3 -> 7 -> 14 -> 30. */
export const REVISION_INTERVALS = [1, 3, 7, 14, 30];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function deriveStatus(tp: Omit<TopicProgress, "status">): TopicStatus {
  if (tp.seenCount === 0) return "new";
  const accuracy = tp.correctCount / Math.max(1, tp.seenCount);
  const recentWrong = tp.recentResults.slice(-3).filter((r) => !r).length;
  if (recentWrong >= 2) return "needs-revision";
  if (tp.stage >= 3 && accuracy >= 0.8 && tp.seenCount >= 5) return "mastered";
  if (accuracy >= 0.65 && tp.seenCount >= 3) return "strong";
  return "learning";
}

interface AnswerResult {
  question: Question;
  correct: boolean;
  userAnswerLabel: string;
  correctAnswerLabel: string;
}

interface ProgressState {
  topicProgress: Record<string, TopicProgress>;
  mistakes: Record<string, Mistake>;
  xp: number;
  streakDays: number;
  lastActiveDate?: string;
  questionsAnswered: number;
  questionsCorrect: number;
  quizHistory: {
    id: string;
    mode: string;
    date: string;
    total: number;
    correct: number;
    accuracyByCategory: Partial<Record<CategoryId, { correct: number; total: number }>>;
  }[];
  scheduleOverrides: Record<string, string[]>; // day-of-week -> category ids

  recordAnswer: (r: AnswerResult) => void;
  recordQuizResult: (mode: string, total: number, correct: number, byCategory: Record<string, { correct: number; total: number }>) => void;
  touchStreak: () => void;
  getTopic: (topicId: string) => TopicProgress;
  resolveMistake: (questionId: string) => void;
  dueForRevisionCount: () => number;
  setSchedule: (day: string, categories: string[]) => void;
  resetProgress: () => void;
}

function questionPromptText(q: Question): string {
  switch (q.type) {
    case "assertion-reason":
      return q.assertion;
    case "flashcard":
      return q.front;
    default:
      return q.prompt;
  }
}

function blankTopicProgress(topicId: string): TopicProgress {
  return {
    topicId,
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    stage: 0,
    status: "new",
    unlockedLevel: 1,
    recentResults: [],
  };
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      topicProgress: {},
      mistakes: {},
      xp: 0,
      streakDays: 0,
      lastActiveDate: undefined,
      questionsAnswered: 0,
      questionsCorrect: 0,
      quizHistory: [],
      scheduleOverrides: {},

      getTopic: (topicId: string) => {
        return get().topicProgress[topicId] ?? blankTopicProgress(topicId);
      },

      touchStreak: () => {
        const today = todayISO();
        const last = get().lastActiveDate;
        if (last === today) return;
        const yesterday = addDays(today, -1);
        set((s) => ({
          streakDays: last === yesterday ? s.streakDays + 1 : 1,
          lastActiveDate: today,
        }));
      },

      recordAnswer: (r: AnswerResult) => {
        get().touchStreak();
        const today = todayISO();
        set((s) => {
          const topicProgress = { ...s.topicProgress };
          for (const topicId of r.question.topicIds) {
            const prev = topicProgress[topicId] ?? blankTopicProgress(topicId);
            const recentResults = [...prev.recentResults, r.correct].slice(-5);
            const stage = r.correct ? Math.min(prev.stage + 1, REVISION_INTERVALS.length - 1) : 0;
            const next: TopicProgress = {
              ...prev,
              seenCount: prev.seenCount + 1,
              correctCount: prev.correctCount + (r.correct ? 1 : 0),
              wrongCount: prev.wrongCount + (r.correct ? 0 : 1),
              lastSeen: today,
              stage,
              nextRevision: addDays(today, REVISION_INTERVALS[stage]),
              recentResults,
              unlockedLevel: (r.correct && recentResults.filter(Boolean).length >= 3
                ? (Math.min(5, prev.unlockedLevel + 1) as Level)
                : prev.unlockedLevel),
            };
            next.status = deriveStatus(next);
            topicProgress[topicId] = next;
          }

          const mistakes = { ...s.mistakes };
          if (!r.correct) {
            const existing = mistakes[r.question.id];
            const prompt = questionPromptText(r.question);
            mistakes[r.question.id] = existing
              ? {
                  ...existing,
                  userAnswer: r.userAnswerLabel,
                  lastMissed: today,
                  missedCount: existing.missedCount + 1,
                  resolved: false,
                }
              : {
                  id: r.question.id,
                  topicIds: r.question.topicIds,
                  category: r.question.category,
                  question: prompt,
                  userAnswer: r.userAnswerLabel,
                  correctAnswer: r.correctAnswerLabel,
                  explanation: r.question.explanation,
                  hook: r.question.hook,
                  firstMissed: today,
                  lastMissed: today,
                  missedCount: 1,
                  resolved: false,
                };
          } else if (mistakes[r.question.id]) {
            mistakes[r.question.id] = { ...mistakes[r.question.id], resolved: true };
          }

          return {
            topicProgress,
            mistakes,
            xp: s.xp + (r.correct ? 10 : 2),
            questionsAnswered: s.questionsAnswered + 1,
            questionsCorrect: s.questionsCorrect + (r.correct ? 1 : 0),
          };
        });
      },

      recordQuizResult: (mode, total, correct, byCategory) => {
        set((s) => ({
          quizHistory: [
            ...s.quizHistory,
            { id: `${mode}-${Date.now()}`, mode, date: todayISO(), total, correct, accuracyByCategory: byCategory },
          ].slice(-50),
        }));
      },

      resolveMistake: (questionId: string) => {
        set((s) => ({
          mistakes: { ...s.mistakes, [questionId]: { ...s.mistakes[questionId], resolved: true } },
        }));
      },

      dueForRevisionCount: () => {
        const today = todayISO();
        return Object.values(get().topicProgress).filter(
          (t) => t.nextRevision && t.nextRevision <= today && t.status !== "mastered",
        ).length;
      },

      setSchedule: (day, categories) => {
        set((s) => ({ scheduleOverrides: { ...s.scheduleOverrides, [day]: categories } }));
      },

      resetProgress: () =>
        set({
          topicProgress: {},
          mistakes: {},
          xp: 0,
          streakDays: 0,
          lastActiveDate: undefined,
          questionsAnswered: 0,
          questionsCorrect: 0,
          quizHistory: [],
        }),
    }),
    { name: "nid-dat-2027-progress" },
  ),
);

export { todayISO, addDays, deriveStatus };
