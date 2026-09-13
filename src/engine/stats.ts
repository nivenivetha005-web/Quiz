import type { CategoryId, TopicProgress } from "../types";
import { topicsByCategory, allTopics } from "../data";

export interface CategoryMastery {
  category: CategoryId;
  totalTopics: number;
  touched: number;
  mastered: number;
  strong: number;
  needsRevision: number;
  pct: number; // 0-100, weighted mastery score
}

const STATUS_WEIGHT: Record<TopicProgress["status"], number> = {
  new: 0,
  learning: 0.35,
  "needs-revision": 0.25,
  strong: 0.7,
  mastered: 1,
};

export function categoryMasteryList(topicProgress: Record<string, TopicProgress>): CategoryMastery[] {
  return (Object.keys(topicsByCategory) as CategoryId[]).map((category) => {
    const topics = topicsByCategory[category] ?? [];
    let touched = 0,
      mastered = 0,
      strong = 0,
      needsRevision = 0,
      weightSum = 0;
    for (const t of topics) {
      const p = topicProgress[t.id];
      if (p && p.seenCount > 0) {
        touched++;
        weightSum += STATUS_WEIGHT[p.status];
        if (p.status === "mastered") mastered++;
        if (p.status === "strong") strong++;
        if (p.status === "needs-revision") needsRevision++;
      }
    }
    const pct = topics.length ? Math.round((weightSum / topics.length) * 100) : 0;
    return { category, totalTopics: topics.length, touched, mastered, strong, needsRevision, pct };
  });
}

export function overallProgressPct(topicProgress: Record<string, TopicProgress>): number {
  const list = categoryMasteryList(topicProgress);
  const totalTopics = allTopics.length;
  if (!totalTopics) return 0;
  const weightedSum = list.reduce((sum, c) => sum + (c.pct / 100) * c.totalTopics, 0);
  return Math.round((weightedSum / totalTopics) * 100);
}

export function dueTodayCount(topicProgress: Record<string, TopicProgress>): number {
  const today = new Date().toISOString().slice(0, 10);
  return Object.values(topicProgress).filter((t) => t.nextRevision && t.nextRevision <= today && t.status !== "mastered").length;
}

export function topicsByStatus(topicProgress: Record<string, TopicProgress>, status: TopicProgress["status"]) {
  const ids = Object.values(topicProgress)
    .filter((t) => t.status === status)
    .map((t) => t.topicId);
  const set = new Set(ids);
  return allTopics.filter((t) => set.has(t.id));
}
