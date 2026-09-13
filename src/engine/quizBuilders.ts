import type { CategoryId, Difficulty, Question, TopicProgress } from "../types";
import { allQuestions } from "../data/questions";
import { currentAffairsEvents } from "../data/currentAffairs";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

const difficultyRank: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2, nid: 3 };

function byCategory(cat: CategoryId): Question[] {
  return allQuestions.filter((q) => q.category === cat);
}

/**
 * Picks `n` questions for a category, preferring ones linked to the caller's
 * weak topics when available, falling back to a random pick.
 */
function pickForCategory(cat: CategoryId, n: number, weakTopicIds: Set<string>): Question[] {
  const pool = byCategory(cat);
  if (pool.length === 0) return [];
  const weak = pool.filter((q) => q.topicIds.some((t) => weakTopicIds.has(t)));
  const rest = pool.filter((q) => !weak.includes(q));
  const chosenWeak = pick(weak, Math.min(n, weak.length));
  const remaining = n - chosenWeak.length;
  return shuffle([...chosenWeak, ...pick(rest, remaining)]);
}

export function weakTopicIdSet(topicProgress: Record<string, TopicProgress>): Set<string> {
  return new Set(
    Object.values(topicProgress)
      .filter((t) => t.status === "needs-revision" || (t.seenCount > 0 && t.correctCount / t.seenCount < 0.5))
      .map((t) => t.topicId),
  );
}

const DAILY_DISTRIBUTION: [CategoryId, number][] = [
  ["art-culture", 3],
  ["crafts", 2],
  ["architecture", 2],
  ["design-history", 2],
  ["interaction-design", 2],
  ["technology", 2],
  ["sustainability", 2],
  ["heritage", 2],
  ["current-affairs", 2],
  ["schemes", 1],
];

export function buildDailyQuiz(topicProgress: Record<string, TopicProgress>): Question[] {
  const weak = weakTopicIdSet(topicProgress);
  const qs = DAILY_DISTRIBUTION.flatMap(([cat, n]) => pickForCategory(cat, n, weak));
  return shuffle(qs);
}

const ALL_CATEGORIES: CategoryId[] = [
  "art-culture",
  "crafts",
  "architecture",
  "design-history",
  "interaction-design",
  "technology",
  "sustainability",
  "heritage",
  "current-affairs",
  "schemes",
  "science",
];

export function buildWeeklyQuiz(topicProgress: Record<string, TopicProgress>, count = 36): Question[] {
  const weak = weakTopicIdSet(topicProgress);
  const perCat = Math.max(1, Math.floor(count / ALL_CATEGORIES.length));
  const qs = ALL_CATEGORIES.flatMap((cat) => pickForCategory(cat, perCat, weak));
  const short = count - qs.length;
  const extra = short > 0 ? pick(shuffle(allQuestions).filter((q) => !qs.includes(q)), short) : [];
  return shuffle([...qs, ...extra]).slice(0, count);
}

export function buildMonthlyMock(topicProgress: Record<string, TopicProgress>, count = 100): Question[] {
  const weak = weakTopicIdSet(topicProgress);
  const perCat = Math.max(1, Math.round(count / ALL_CATEGORIES.length));
  const qs = ALL_CATEGORIES.flatMap((cat) => pickForCategory(cat, perCat, weak));
  const deduped = Array.from(new Set(qs));
  const short = count - deduped.length;
  const extra = short > 0 ? pick(allQuestions.filter((q) => !deduped.includes(q)), short) : [];
  const full = [...deduped, ...extra].slice(0, count);
  // Mixed difficulty, but gently ramping: shuffle within difficulty bands, then concatenate bands.
  return (["easy", "medium", "hard", "nid"] as Difficulty[]).flatMap((d) => shuffle(full.filter((q) => q.difficulty === d)));
}

export function buildExamSimulation(count = 40): Question[] {
  const qs = pick(allQuestions, count);
  // Gradually increasing difficulty across the exam.
  return qs.sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty] || Math.random() - 0.5);
}

export function buildRapidFire(count = 15): Question[] {
  const quick = allQuestions.filter((q) => q.type === "mcq" || q.type === "scenario" || q.type === "visual-id" || q.type === "odd-one-out");
  return pick(quick, count);
}

export function buildMistakesQuiz(mistakeQuestionIds: string[]): Question[] {
  const set = new Set(mistakeQuestionIds);
  return shuffle(allQuestions.filter((q) => set.has(q.id)));
}

export function buildSchemeQuiz(count = 15): Question[] {
  return pick(byCategory("schemes"), count);
}

export function buildCategoryPractice(
  cat: CategoryId,
  opts?: { difficulty?: Difficulty; count?: number },
): Question[] {
  let pool = byCategory(cat);
  if (opts?.difficulty) pool = pool.filter((q) => q.difficulty === opts.difficulty);
  return pick(pool, opts?.count ?? 12);
}

export function buildVisualQuiz(count = 15): Question[] {
  const pool = allQuestions.filter(
    (q) => q.type === "visual-id" || ((q.type === "mcq" || q.type === "scenario") && !!q.visualDescriptor),
  );
  return pick(pool, count);
}

export function buildCurrentAffairsQuiz(rangeDays: number, count = 15): Question[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - rangeDays);
  const validIds = new Set(
    currentAffairsEvents.filter((e) => new Date(e.date) >= cutoff).map((e) => e.id),
  );
  const pool = byCategory("current-affairs").filter((q) => q.topicIds.some((t) => validIds.has(t)));
  const fallback = pool.length > 0 ? pool : byCategory("current-affairs");
  return pick(fallback, count);
}

export { allQuestions };
