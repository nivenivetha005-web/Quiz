import type { CategoryId, Topic } from "../types";
import { artCultureTopics } from "./topics/artCulture";
import { craftsTopics } from "./topics/crafts";
import { architectureTopics } from "./topics/architecture";
import { designHistoryTopics } from "./topics/designHistory";
import { interactionDesignTopics } from "./topics/interactionDesign";
import { technologyTopics } from "./topics/technology";
import { sustainabilityTopics } from "./topics/sustainability";
import { heritageTopics } from "./topics/heritage";
import { scienceTopics } from "./topics/science";
import { schemes } from "./schemes";
import { currentAffairsEvents } from "./currentAffairs";
import { allQuestions } from "./questions";

export const allTopics: Topic[] = [
  ...artCultureTopics,
  ...craftsTopics,
  ...architectureTopics,
  ...designHistoryTopics,
  ...interactionDesignTopics,
  ...technologyTopics,
  ...sustainabilityTopics,
  ...heritageTopics,
  ...scienceTopics,
];

export const topicById: Record<string, Topic> = Object.fromEntries(allTopics.map((t) => [t.id, t]));

export const topicsByCategory: Record<CategoryId, Topic[]> = allTopics.reduce(
  (acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  },
  {} as Record<CategoryId, Topic[]>,
);

export { schemes, currentAffairsEvents, allQuestions };
export * from "../types";
