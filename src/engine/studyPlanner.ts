import type { CategoryId, TopicProgress } from "../types";
import { topicById, topicsByCategory } from "../data";
import { CATEGORY_META } from "../types";

export interface PlanBlock {
  id: string;
  title: string;
  minutes: number;
  description: string;
  action: { type: "learn"; topicId: string } | { type: "quiz-category"; category: CategoryId } | { type: "quiz-schemes" } | { type: "quiz-current-affairs" } | { type: "quiz-mixed" } | { type: "quiz-mistakes" };
}

export const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function defaultScheduleFor(day: number): { title: string; categories: CategoryId[]; note: string } {
  switch (day) {
    case 1:
      return { title: "Design History", categories: ["design-history"], note: "Movements, designers and principles." };
    case 2:
      return { title: "Indian Culture + Craft", categories: ["art-culture", "crafts"], note: "Art, dance, festivals and craft traditions." };
    case 3:
      return { title: "Current Affairs", categories: ["current-affairs"], note: "This week's design, culture, tech and India news." };
    case 4:
      return { title: "Technology + Science", categories: ["technology", "science"], note: "AI, emerging tech and everyday science." };
    case 5:
      return { title: "Architecture", categories: ["architecture"], note: "Styles, Indian and global architects." };
    case 6:
      return { title: "Weekly Quiz", categories: [], note: "Take the NID Weekly Checkpoint." };
    default:
      return { title: "Visual GK + Revision", categories: ["heritage", "sustainability"], note: "Heritage, sustainability and mistake revision." };
  }
}

/** Builds a "Study For Me" 30–45 minute plan based on weak topics, revision due today, and syllabus coverage. */
export function buildStudyPlan(topicProgress: Record<string, TopicProgress>, mistakesCount: number): PlanBlock[] {
  const today = new Date().toISOString().slice(0, 10);
  const dueTopics = Object.values(topicProgress).filter((t) => t.nextRevision && t.nextRevision <= today && t.status !== "mastered");
  const weakTopics = Object.values(topicProgress)
    .filter((t) => t.status === "needs-revision" || (t.seenCount > 0 && t.correctCount / t.seenCount < 0.5))
    .sort((a, b) => a.correctCount / Math.max(1, a.seenCount) - b.correctCount / Math.max(1, b.seenCount));

  const blocks: PlanBlock[] = [];

  const priorityTopic = (dueTopics[0] ?? weakTopics[0])?.topicId;
  if (priorityTopic && topicById[priorityTopic]) {
    const t = topicById[priorityTopic];
    blocks.push({
      id: "block-learn-weak",
      title: `Learn: ${t.title}`,
      minutes: 10,
      description: `Revisit ${t.title} (${CATEGORY_META[t.category].short}) — it's due for revision or trending weak.`,
      action: { type: "learn", topicId: t.id },
    });
  } else {
    // Beginner fallback — surface a foundational, unseen topic.
    const unseen = Object.values(topicsByCategory).flat().find((t) => !topicProgress[t.id]);
    if (unseen) {
      blocks.push({
        id: "block-learn-new",
        title: `Learn: ${unseen.title}`,
        minutes: 10,
        description: `A fresh topic in ${CATEGORY_META[unseen.category].short} to keep expanding your coverage.`,
        action: { type: "learn", topicId: unseen.id },
      });
    }
  }

  if (mistakesCount > 0) {
    blocks.push({
      id: "block-mistakes",
      title: "Quiz My Mistakes",
      minutes: 10,
      description: `You have ${mistakesCount} unresolved mistake${mistakesCount === 1 ? "" : "s"} — clear a few before they pile up.`,
      action: { type: "quiz-mistakes" },
    });
  } else {
    blocks.push({
      id: "block-schemes",
      title: "Government Scheme Logos",
      minutes: 10,
      description: "Sharpen recognition on the 'Identify the Initiative' quiz.",
      action: { type: "quiz-schemes" },
    });
  }

  blocks.push({
    id: "block-current-affairs",
    title: "Current Affairs",
    minutes: 10,
    description: "Catch up on recent design, culture, tech and India news relevant to NID GK.",
    action: { type: "quiz-current-affairs" },
  });

  blocks.push({
    id: "block-mixed",
    title: "Mixed Quiz",
    minutes: 10,
    description: "A short mixed-category quiz to keep everything else warm.",
    action: { type: "quiz-mixed" },
  });

  return blocks;
}

export function totalPlanMinutes(blocks: PlanBlock[]): number {
  return blocks.reduce((sum, b) => sum + b.minutes, 0);
}
