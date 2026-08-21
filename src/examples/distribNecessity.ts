import type { Example } from "./types";

export const distribNecessityExample: Example = {
  id: "distrib-necessity",
  title: "Distribution of necessity",
  blurb: "Distribution axiom (K axiom) valid in all normal modal logics.",
  statements: [
    {
      id: "P1",
      naturalLanguage: "Necessarily if P then Q",
      formula: "□(P → Q)",
      postulate: true,
    },
    {
      id: "P2",
      naturalLanguage: "Necessarily P",
      formula: "□P",
      postulate: true,
    },
    {
      id: "P3",
      naturalLanguage: "Necessarily Q",
      formula: "□Q",
    },
  ],
};
