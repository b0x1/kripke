import type { Example } from "./types";

export const deDictoDeReExample: Example = {
  id: "de-dicto-de-re",
  title: "De dicto vs de re",
  blurb: "De dicto modal proposition does not entail de re modality.",
  statements: [
    {
      id: "P1",
      naturalLanguage: "Necessarily someone wins",
      formula: "□∃x Winner(x)",
      postulate: true,
    },
    {
      id: "P2",
      naturalLanguage: "Someone is a necessary winner",
      formula: "∃x □Winner(x)",
    },
  ],
};
