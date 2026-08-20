import type { Formula, Term } from "./ast";

const PREC = {
  iff: 0,
  imp: 1,
  or: 2,
  and: 3,
  unary: 4,
  atom: 5,
} as const;

export function pretty(formula: Formula): string {
  return prettyPrec(formula, PREC.iff);
}

export function prettyTerm(term: Term): string {
  return term.name;
}

function prettyPrec(formula: Formula, parent: number): string {
  switch (formula.tag) {
    case "pred": {
      const args =
        formula.args.length === 0
          ? ""
          : `(${formula.args.map(prettyTerm).join(", ")})`;
      return wrap(parent, PREC.atom, `${formula.name}${args}`);
    }
    case "eq":
      return wrap(
        parent,
        PREC.atom,
        `${prettyTerm(formula.left)} = ${prettyTerm(formula.right)}`,
      );
    case "not":
      return wrap(parent, PREC.unary, `¬${prettyPrec(formula.inner, PREC.unary)}`);
    case "box":
      return wrap(parent, PREC.unary, `□${prettyPrec(formula.inner, PREC.unary)}`);
    case "dia":
      return wrap(parent, PREC.unary, `◇${prettyPrec(formula.inner, PREC.unary)}`);
    case "all":
      return wrap(
        parent,
        PREC.unary,
        `∀${formula.name} ${prettyPrec(formula.inner, PREC.unary)}`,
      );
    case "ex":
      return wrap(
        parent,
        PREC.unary,
        `∃${formula.name} ${prettyPrec(formula.inner, PREC.unary)}`,
      );
    case "and":
      return wrap(
        parent,
        PREC.and,
        `${prettyPrec(formula.left, PREC.and)} ∧ ${prettyPrec(formula.right, PREC.and)}`,
      );
    case "or":
      return wrap(
        parent,
        PREC.or,
        `${prettyPrec(formula.left, PREC.or)} ∨ ${prettyPrec(formula.right, PREC.or)}`,
      );
    case "imp":
      return wrap(
        parent,
        PREC.imp,
        `${prettyPrec(formula.left, PREC.imp + 1)} → ${prettyPrec(formula.right, PREC.imp)}`,
      );
    case "iff":
      return wrap(
        parent,
        PREC.iff,
        `${prettyPrec(formula.left, PREC.iff + 1)} ↔ ${prettyPrec(formula.right, PREC.iff)}`,
      );
  }
}

function wrap(parent: number, self: number, text: string): string {
  return self < parent ? `(${text})` : text;
}
