// Core data model for the NID DAT 2027 GK Lab.
// Content lives in src/data/**; this file defines the shapes that content,
// the learning engine, and the UI all share.

export type CategoryId =
  | "art-culture"
  | "crafts"
  | "architecture"
  | "design-history"
  | "interaction-design"
  | "technology"
  | "sustainability"
  | "heritage"
  | "science"
  | "schemes"
  | "current-affairs";

export const CATEGORY_META: Record<
  CategoryId,
  { label: string; short: string; color: string; description: string }
> = {
  "art-culture": {
    label: "Indian Art & Culture",
    short: "Art & Culture",
    color: "var(--color-accent)",
    description: "Painting, dance, music, theatre and festivals across India.",
  },
  crafts: {
    label: "Indian Crafts & Materials",
    short: "Crafts",
    color: "var(--color-gold)",
    description: "Craft, region, material, technique and cultural context.",
  },
  architecture: {
    label: "Architecture",
    short: "Architecture",
    color: "var(--color-teal)",
    description: "Indian & global architectural styles, and the architects behind them.",
  },
  "design-history": {
    label: "Design History",
    short: "Design History",
    color: "var(--color-plum)",
    description: "Movements, designers and the principles that shape visual thinking.",
  },
  "interaction-design": {
    label: "Interaction & Digital Design",
    short: "Interaction Design",
    color: "#2f5d8a",
    description: "UX, HCI, service design and the emerging interfaces of design practice.",
  },
  technology: {
    label: "AI & Technology",
    short: "Technology",
    color: "#3a7d5c",
    description: "AI, robotics, spatial computing and their social + design implications.",
  },
  sustainability: {
    label: "Sustainability",
    short: "Sustainability",
    color: "#2f6f63",
    description: "Climate, circular economy and sustainable design practice.",
  },
  heritage: {
    label: "Indian Heritage",
    short: "Heritage",
    color: "#b1342f",
    description: "UNESCO sites, GI tags, monuments and living heritage.",
  },
  science: {
    label: "Science & Everyday Knowledge",
    short: "Science",
    color: "#5a6b8c",
    description: "Light, colour, materials and the everyday science designers rely on.",
  },
  schemes: {
    label: "Government Schemes & Initiatives",
    short: "Schemes",
    color: "#a15c1f",
    description: "India's missions, schemes and their visual & civic identity.",
  },
  "current-affairs": {
    label: "Current Affairs",
    short: "Current Affairs",
    color: "#4a4438",
    description: "Design, culture, technology, environment, India & world — date tagged.",
  },
};

export type Difficulty = "easy" | "medium" | "hard" | "nid";

export const DIFFICULTY_META: Record<Difficulty, { label: string; emoji: string; color: string }> = {
  easy: { label: "Easy", emoji: "🟢", color: "var(--color-easy)" },
  medium: { label: "Medium", emoji: "🔵", color: "var(--color-medium)" },
  hard: { label: "Hard", emoji: "🟣", color: "var(--color-hard)" },
  nid: { label: "NID Challenge", emoji: "🔴", color: "var(--color-nid)" },
};

/** The five mastery levels every topic progresses through. */
export type Level = 1 | 2 | 3 | 4 | 5;

export const LEVEL_META: Record<Level, { label: string; question: string }> = {
  1: { label: "Recognition", question: "Have you seen this before?" },
  2: { label: "Basic Knowledge", question: "What is it?" },
  3: { label: "Connection", question: "Which designer / movement / state is associated with it?" },
  4: { label: "Application", question: "Where would this concept be used?" },
  5: { label: "NID Challenge", question: "Visual + analytical + contextual reasoning." },
};

/** A single teachable unit — a craft, a movement, a scheme's concept, etc. */
export interface Topic {
  id: string;
  category: CategoryId;
  subtopic: string;
  title: string;
  region?: string;
  /** Words that describe the visual identity, used for recognition-style prompts. */
  visualDescriptor?: string;
  /** One-line hook shown on list cards. */
  summary: string;
  /** The core teachable facts, in the order they should be read. */
  facts: string[];
  /** How this topic connects to other ideas — the "why it matters" thread. */
  connections?: string[];
  /** Structured fields, e.g. Material / Technique / Region for a craft. */
  fields?: { label: string; value: string }[];
  /** A short, ideally natural, memory hook. */
  hook?: string;
  source?: string;
  tags?: string[];
}

export type QuestionType =
  | "mcq"
  | "scenario"
  | "visual-id"
  | "match"
  | "odd-one-out"
  | "assertion-reason"
  | "sequence"
  | "flashcard";

interface BaseQuestion {
  id: string;
  type: QuestionType;
  category: CategoryId;
  topicIds: string[];
  difficulty: Difficulty;
  level: Level;
  explanation: string;
  hook?: string;
  source?: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq" | "scenario" | "visual-id";
  prompt: string;
  visualDescriptor?: string;
  options: string[];
  correctIndex: number;
}

export interface AssertionReasonQuestion extends BaseQuestion {
  type: "assertion-reason";
  assertion: string;
  reason: string;
  correctIndex: number; // index into STANDARD_AR_OPTIONS
}

export const STANDARD_AR_OPTIONS = [
  "Both Assertion and Reason are true, and Reason correctly explains the Assertion.",
  "Both Assertion and Reason are true, but Reason does not correctly explain the Assertion.",
  "Assertion is true, but Reason is false.",
  "Assertion is false, but Reason is true.",
];

export interface OddOneOutQuestion extends BaseQuestion {
  type: "odd-one-out";
  prompt: string;
  items: string[];
  oddIndex: number;
}

export interface SequenceQuestion extends BaseQuestion {
  type: "sequence";
  prompt: string;
  /** Canonical correct order, earliest/first step first. */
  correctOrder: string[];
}

export interface MatchQuestion extends BaseQuestion {
  type: "match";
  prompt: string;
  pairs: { left: string; right: string }[];
}

export interface FlashcardQuestion extends BaseQuestion {
  type: "flashcard";
  front: string;
  back: string;
}

export type Question =
  | MCQQuestion
  | AssertionReasonQuestion
  | OddOneOutQuestion
  | SequenceQuestion
  | MatchQuestion
  | FlashcardQuestion;

export type SchemeSector =
  | "digital"
  | "infrastructure"
  | "sustainability"
  | "education"
  | "healthcare"
  | "social"
  | "rural"
  | "housing"
  | "financial"
  | "space-science";

export const SCHEME_SECTOR_META: Record<SchemeSector, string> = {
  digital: "Digital India / Technology",
  infrastructure: "Infrastructure / Smart Cities",
  sustainability: "Sustainability / Environment",
  education: "Education / Skills",
  healthcare: "Healthcare",
  social: "Women / Children / Social Development",
  rural: "Rural / Agriculture",
  housing: "Housing / Urban Development",
  financial: "Financial Inclusion",
  "space-science": "Space / Science",
};

export interface Scheme {
  id: string;
  fullName: string;
  shortName: string;
  launchYear: number;
  ministry: string;
  purpose: string;
  beneficiaries: string;
  keyFeature: string;
  whyItMatters: string;
  status: string;
  /** Described, not fabricated as an image — colours/symbol/typography of the identity. */
  visualIdentity: string;
  tagline?: string;
  sector: SchemeSector;
  source?: string;
}

export type CurrentAffairsCategory = "design" | "culture" | "technology" | "environment" | "india" | "world";

export interface CurrentAffairsEvent {
  id: string;
  date: string; // ISO yyyy-mm-dd
  headline: string;
  category: CurrentAffairsCategory;
  org?: string;
  country?: string;
  whatHappened: string;
  whyItMatters: string;
  designConnection: string;
  nidRelevance: string;
  possibleQuestion: string;
  source?: string;
}

export type TopicStatus = "new" | "learning" | "needs-revision" | "strong" | "mastered";

export interface TopicProgress {
  topicId: string;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  lastSeen?: string;
  nextRevision?: string;
  stage: number;
  status: TopicStatus;
  unlockedLevel: Level;
  recentResults: boolean[]; // last up to 5 results, most recent last
}

export interface Mistake {
  id: string; // questionId
  topicIds: string[];
  category: CategoryId;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  hook?: string;
  firstMissed: string;
  lastMissed: string;
  missedCount: number;
  resolved: boolean;
}
