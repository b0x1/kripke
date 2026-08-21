import type { Example } from "./types";

export const socratesExample: Example = {
  id: "socrates",
  title: "Socrates syllogism",
  blurb: "Classic categorical syllogism in first-order logic.",
  statements: [
    {
      id: "P1",
      naturalLanguage: "Socrates is a man",
      formula: "Man(socrates)",
      postulate: true,
    },
    {
      id: "P2",
      naturalLanguage: "Men are mortal",
      formula: "∀x (Man(x) → Mortal(x))",
      postulate: true,
    },
    {
      id: "P3",
      naturalLanguage: "Socrates is mortal",
      formula: "Mortal(socrates)",
    },
  ],
};
