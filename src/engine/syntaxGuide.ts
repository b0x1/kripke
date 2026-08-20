export type SyntaxRow = {
  meaning: string;
  ascii: string;
  alias: string;
  unicode: string;
};

export const languageIncludes: string[] = [
  "Predicates of any arity, including 0-ary (bare P, Mortal)",
  "Individual constants and variables (socrates, x)",
  "Identity =",
  "Connectives ¬ ∧ ∨ → ↔ (not, and, or, if, iff)",
  "Quantifiers ∀ ∃ (for all, there is)",
  "Modal operators □ ◇ (necessity, possibility)",
];

export const languageExcludes: string[] = ["Function symbols (no father-of(x))"];

export const modalOps: SyntaxRow[] = [
  { meaning: "Necessity (must)", ascii: "[]P", alias: "nec P", unicode: "□P" },
  { meaning: "Possibility (might)", ascii: "<>P", alias: "pos P", unicode: "◇P" },
];

export const quantifiers: SyntaxRow[] = [
  {
    meaning: "Universal (for every)",
    ascii: "Ax P",
    alias: "forall x P",
    unicode: "∀x P",
  },
  {
    meaning: "Existential (for some)",
    ascii: "Ex P",
    alias: "exists x P",
    unicode: "∃x P",
  },
];

export const connectives: SyntaxRow[] = [
  { meaning: "Negation (not)", ascii: "~ or not", alias: "", unicode: "¬" },
  { meaning: "Conjunction (and)", ascii: "& or and", alias: "", unicode: "∧" },
  { meaning: "Disjunction (or)", ascii: "| or or", alias: "", unicode: "∨" },
  { meaning: "Implication (if-then)", ascii: "->", alias: "", unicode: "→" },
  { meaning: "Biconditional (iff)", ascii: "<->", alias: "", unicode: "↔" },
  { meaning: "Identity (is the same as)", ascii: "=", alias: "", unicode: "=" },
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
  "∀x (Man(x) → Mortal(x)) is the syllogism premise. Without parentheses, ∀x Man(x) → Mortal(x) parses as (∀x Man(x)) → Mortal(x).";

export const deReDeDicto = {
  dicto: "□∃x P(x)",
  dictoGloss: "necessity of an existence claim: it must be that someone is P",
  re: "∃x □P(x)",
  reGloss: "existence of a necessary property: someone must be P",
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
