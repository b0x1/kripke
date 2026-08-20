import type { Example } from "./types";

export const necReflexivityExample: Example = {
  id: "nec-reflexivity",
  title: "Necessity to actuality (□P ⊢ P)",
  blurb: "Reflexivity (T axiom): false in system K and D; requires system T.",
  statements: [
    {
      id: "P1",
      naturalLanguage: "Necessarily P",
      formula: "□P",
      postulate: true,
    },
    {
      id: "P2",
      naturalLanguage: "P is true",
      formula: "P",
    },
  ],
};
