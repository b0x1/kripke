import type { Example } from "./types";

export const affirmingConsequentExample: Example = {
  id: "affirming-consequent",
  title: "Affirming the consequent",
  blurb: "Formal fallacy inferring the antecedent from a conditional and its consequent.",
  statements: [
    {
      id: "P1",
      naturalLanguage: "If it rains, the street is wet",
      formula: "Rain → Wet",
      postulate: true,
    },
    {
      id: "P2",
      naturalLanguage: "The street is wet",
      formula: "Wet",
      postulate: true,
    },
    {
      id: "P3",
      naturalLanguage: "It is raining",
      formula: "Rain",
    },
  ],
};
