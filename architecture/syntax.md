# FOML syntax

Concrete syntax (tables, aliases, examples) lives in one place: [`src/engine/syntaxGuide.ts`](../src/engine/syntaxGuide.ts). The How it works page and the future cheatsheet render that module. Do not copy the tables here.

Parser: `src/engine/parse.ts`. AST: `src/engine/ast.ts`. Pretty: `src/engine/pretty.ts`.

## Parser contract

- ASCII is the typing language; Unicode aliases in `syntaxGuide.ts` must parse.
- Pretty-printer emits Unicode. `parse(pretty(ast))` equals `ast`. Add parentheses when pretty-text would reparse differently (see `scopeNote` in `syntaxGuide.ts`).
- Unbound names in term position are constants. Unbound names in formula position with no argument list are 0-ary predicates. Variables are bound by quantifiers. Constants are rigid.
- Engine tests must witness de re / de dicto inequivalence (`deReDeDicto` in `syntaxGuide.ts`).

## Parse errors

The parser returns a location (index and span) plus a short message. Incomplete verdicts that originate in syntax must show that message on the statement card and in the inspector. Do not run the tableau on an inference that has any unparsed formula.
