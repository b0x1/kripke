export type Term =
  | { tag: "const"; name: string }
  | { tag: "var"; name: string }
  | { tag: "param"; name: string };

export type Formula =
  | { tag: "pred"; name: string; args: Term[] }
  | { tag: "eq"; left: Term; right: Term }
  | { tag: "not"; inner: Formula }
  | { tag: "and"; left: Formula; right: Formula }
  | { tag: "or"; left: Formula; right: Formula }
  | { tag: "imp"; left: Formula; right: Formula }
  | { tag: "iff"; left: Formula; right: Formula }
  | { tag: "box"; inner: Formula }
  | { tag: "dia"; inner: Formula }
  | { tag: "all"; name: string; inner: Formula }
  | { tag: "ex"; name: string; inner: Formula };

export function not(inner: Formula): Formula {
  return { tag: "not", inner };
}

export function termsEqual(a: Term, b: Term): boolean {
  return a.tag === b.tag && a.name === b.name;
}

export function formulasEqual(a: Formula, b: Formula): boolean {
  if (a.tag !== b.tag) {
    return false;
  }
  switch (a.tag) {
    case "pred":
      return (
        b.tag === "pred" &&
        a.name === b.name &&
        a.args.length === b.args.length &&
        a.args.every((t, i) => termsEqual(t, b.args[i] as Term))
      );
    case "eq":
      return (
        b.tag === "eq" &&
        termsEqual(a.left, b.left) &&
        termsEqual(a.right, b.right)
      );
    case "not":
    case "box":
    case "dia":
      return b.tag === a.tag && formulasEqual(a.inner, b.inner);
    case "and":
    case "or":
    case "imp":
    case "iff":
      return (
        b.tag === a.tag &&
        formulasEqual(a.left, b.left) &&
        formulasEqual(a.right, b.right)
      );
    case "all":
    case "ex":
      return (
        b.tag === a.tag && a.name === b.name && formulasEqual(a.inner, b.inner)
      );
  }
}

export function termName(term: Term): string {
  return term.name;
}

export function collectConstants(formula: Formula, into: Set<string> = new Set()): Set<string> {
  walkFormula(formula, (term) => {
    if (term.tag === "const") {
      into.add(term.name);
    }
  });
  return into;
}

export function substTerm(term: Term, name: string, replacement: Term): Term {
  if ((term.tag === "var" || term.tag === "const") && term.name === name) {
    return replacement;
  }
  return term;
}

export function subst(formula: Formula, name: string, replacement: Term): Formula {
  switch (formula.tag) {
    case "pred":
      return {
        tag: "pred",
        name: formula.name,
        args: formula.args.map((t) => substTerm(t, name, replacement)),
      };
    case "eq":
      return {
        tag: "eq",
        left: substTerm(formula.left, name, replacement),
        right: substTerm(formula.right, name, replacement),
      };
    case "not":
    case "box":
    case "dia":
      return { tag: formula.tag, inner: subst(formula.inner, name, replacement) };
    case "and":
    case "or":
    case "imp":
    case "iff":
      return {
        tag: formula.tag,
        left: subst(formula.left, name, replacement),
        right: subst(formula.right, name, replacement),
      };
    case "all":
    case "ex":
      if (formula.name === name) {
        return formula;
      }
      return {
        tag: formula.tag,
        name: formula.name,
        inner: subst(formula.inner, name, replacement),
      };
  }
}

export function nnf(formula: Formula, negate = false): Formula {
  switch (formula.tag) {
    case "pred":
    case "eq":
      return negate ? { tag: "not", inner: formula } : formula;
    case "not":
      return nnf(formula.inner, !negate);
    case "and":
      return negate
        ? {
            tag: "or",
            left: nnf(formula.left, true),
            right: nnf(formula.right, true),
          }
        : {
            tag: "and",
            left: nnf(formula.left),
            right: nnf(formula.right),
          };
    case "or":
      return negate
        ? {
            tag: "and",
            left: nnf(formula.left, true),
            right: nnf(formula.right, true),
          }
        : {
            tag: "or",
            left: nnf(formula.left),
            right: nnf(formula.right),
          };
    case "imp":
      return nnf(
        { tag: "or", left: { tag: "not", inner: formula.left }, right: formula.right },
        negate,
      );
    case "iff":
      return nnf(
        {
          tag: "and",
          left: { tag: "imp", left: formula.left, right: formula.right },
          right: { tag: "imp", left: formula.right, right: formula.left },
        },
        negate,
      );
    case "box":
      return negate
        ? { tag: "dia", inner: nnf(formula.inner, true) }
        : { tag: "box", inner: nnf(formula.inner) };
    case "dia":
      return negate
        ? { tag: "box", inner: nnf(formula.inner, true) }
        : { tag: "dia", inner: nnf(formula.inner) };
    case "all":
      return negate
        ? { tag: "ex", name: formula.name, inner: nnf(formula.inner, true) }
        : { tag: "all", name: formula.name, inner: nnf(formula.inner) };
    case "ex":
      return negate
        ? { tag: "all", name: formula.name, inner: nnf(formula.inner, true) }
        : { tag: "ex", name: formula.name, inner: nnf(formula.inner) };
  }
}

function walkFormula(formula: Formula, onTerm: (term: Term) => void): void {
  switch (formula.tag) {
    case "pred":
      for (const term of formula.args) {
        onTerm(term);
      }
      return;
    case "eq":
      onTerm(formula.left);
      onTerm(formula.right);
      return;
    case "not":
    case "box":
    case "dia":
      walkFormula(formula.inner, onTerm);
      return;
    case "and":
    case "or":
    case "imp":
    case "iff":
      walkFormula(formula.left, onTerm);
      walkFormula(formula.right, onTerm);
      return;
    case "all":
    case "ex":
      walkFormula(formula.inner, onTerm);
  }
}
