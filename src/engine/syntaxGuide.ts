export type SyntaxRow = {
  meaning: string;
  ascii: string;
  alias: string;
  unicode: string;
};

export const languageIncludes: string[] = [
  "Predicates of any arity, including 0-ary (propositional atoms)",
  "Individual constants and variables",
  "Identity =",
  "Connectives ¬ ∧ ∨ → ↔",
  "Quantifiers ∀ ∃",
  "Modal operators □ ◇",
];

export const languageExcludes: string[] = ["Function symbols"];

export const modalOps: SyntaxRow[] = [
  { meaning: "Necessity", ascii: "[]P", alias: "nec P", unicode: "□P" },
  { meaning: "Possibility", ascii: "<>P", alias: "pos P", unicode: "◇P" },
];

export const quantifiers: SyntaxRow[] = [
  { meaning: "Universal", ascii: "Ax P", alias: "forall x P", unicode: "∀x P" },
  {
    meaning: "Existential",
    ascii: "Ex P",
    alias: "exists x P",
    unicode: "∃x P",
  },
];

export const connectives: SyntaxRow[] = [
  { meaning: "Negation", ascii: "~ or not", alias: "", unicode: "¬" },
  { meaning: "Conjunction", ascii: "& or and", alias: "", unicode: "∧" },
  { meaning: "Disjunction", ascii: "| or or", alias: "", unicode: "∨" },
  { meaning: "Implication", ascii: "->", alias: "", unicode: "→" },
  { meaning: "Biconditional", ascii: "<->", alias: "", unicode: "↔" },
  { meaning: "Identity", ascii: "=", alias: "", unicode: "=" },
];

/** Case-insensitive word spellings → Unicode. */
export const keywordWords: Record<string, string> = {
  not: "¬",
  and: "∧",
  or: "∨",
  forall: "∀",
  exists: "∃",
  nec: "□",
  pos: "◇",
};

/** Symbol spellings → Unicode. Longer keys first. */
export const keywordSymbols: [string, string][] = [
  ["<->", "↔"],
  ["->", "→"],
  ["[]", "□"],
  ["<>", "◇"],
  ["~", "¬"],
  ["&", "∧"],
  ["|", "∨"],
  ["¬", "¬"],
  ["∧", "∧"],
  ["∨", "∨"],
  ["→", "→"],
  ["↔", "↔"],
  ["□", "□"],
  ["◇", "◇"],
  ["∀", "∀"],
  ["∃", "∃"],
  ["=", "="],
];

export const typingNotes: string[] = [
  "ASCII is the typing language. Unicode aliases are accepted. Display uses Unicode.",
  "Ax / Ex need a capital A/E glued to the variable (Ax, Ey). Use forall / exists when that is ambiguous.",
  "Whitespace separates tokens. Parentheses group.",
  "Quantifiers and modals bind tighter than binary connectives.",
  "Precedence, tightest first: ¬ □ ◇ quantifiers; ∧; ∨; → (right-assoc); ↔ (right-assoc).",
];

export const atomExamples: string[] = [
  "Man(socrates), R(x, y)",
  "Propositional atom: P, Mortal",
  "Identity: socrates = plato",
  "Identifiers: letter or _ then letters, digits, _",
];

export const scopeNote =
  "∀x (Man(x) → Mortal(x)) is the syllogism premise. ∀x Man(x) → Mortal(x) parses as (∀x Man(x)) → Mortal(x).";

export const deReDeDicto = {
  dicto: "□∃x P(x)",
  dictoGloss: "necessarily, something is P",
  re: "∃x □P(x)",
  reGloss: "something is necessarily P",
};

export const syllogism = [
  { id: "P1", naturalLanguage: "Socrates is a man", formula: "Man(socrates)" },
  {
    id: "P2",
    naturalLanguage: "Men are mortal",
    formula: "∀x (Man(x) → Mortal(x))",
  },
  { id: "P3", naturalLanguage: "Socrates is mortal", formula: "Mortal(socrates)" },
];

export const mockFalseRows = [
  {
    id: "P4",
    naturalLanguage: "Socrates is not mortal",
    formula: "¬Mortal(socrates)",
  },
];

export const mockPropositions = [...syllogism, ...mockFalseRows];
