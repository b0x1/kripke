import type { Example } from "./types";

export const necIdentityExample: Example = {
  id: "nec-identity",
  title: "Necessity of identity",
  blurb: "Rigid designators make identity necessary across possible worlds.",
  statements: [
    {
      id: "P1",
      naturalLanguage: "a is identical to b",
      formula: "a = b",
      postulate: true,
    },
    {
      id: "P2",
      naturalLanguage: "Necessarily a is identical to b",
      formula: "□(a = b)",
    },
  ],
};
