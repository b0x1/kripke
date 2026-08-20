import type { Example } from "./types";

export const barcanExample: Example = {
  id: "barcan",
  title: "Barcan formula",
  blurb: "Valid on constant domain; fails on varying domain.",
  statements: [
    {
      id: "P1",
      naturalLanguage: "Everyone is necessarily mortal",
      formula: "∀x □Mortal(x)",
      postulate: true,
    },
    {
      id: "P2",
      naturalLanguage: "Necessarily everyone is mortal",
      formula: "□∀x Mortal(x)",
    },
  ],
};
