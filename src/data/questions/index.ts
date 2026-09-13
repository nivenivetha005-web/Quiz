import type { Question } from "../../types";
import { mcqArtCulture } from "./mcqArtCulture";
import { mcqCrafts } from "./mcqCrafts";
import { mcqArchitecture } from "./mcqArchitecture";
import { mcqDesignHistory } from "./mcqDesignHistory";
import { mcqInteractionTech } from "./mcqInteractionTech";
import { mcqSustainability, mcqHeritage, mcqScience } from "./mcqSustainabilityHeritageScience";
import { mcqSchemes } from "./mcqSchemes";
import { mcqCurrentAffairs } from "./mcqCurrentAffairs";
import { matchQuestions } from "./match";
import { oddOneOutQuestions } from "./oddOneOut";
import { assertionReasonQuestions } from "./assertionReason";
import { sequenceQuestions } from "./sequence";
import { scenarioQuestions } from "./scenario";

export const allQuestions: Question[] = [
  ...mcqArtCulture,
  ...mcqCrafts,
  ...mcqArchitecture,
  ...mcqDesignHistory,
  ...mcqInteractionTech,
  ...mcqSustainability,
  ...mcqHeritage,
  ...mcqScience,
  ...mcqSchemes,
  ...mcqCurrentAffairs,
  ...matchQuestions,
  ...oddOneOutQuestions,
  ...assertionReasonQuestions,
  ...sequenceQuestions,
  ...scenarioQuestions,
];
