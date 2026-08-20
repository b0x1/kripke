# FOML syntax

First-order modal language used by the workbench. The parser lives in `src/engine/parse.ts`; the AST in `src/engine/ast.ts`; display in `src/engine/pretty.ts`.

## Language (v1)

Included:

- Predicates of any arity, including 0-ary (propositional atoms)
- Individual constants and variables
- Identity `=`
- Connectives `¬ ∧ ∨ → ↔`
- Quantifiers `∀ ∃`
- Modal operators `□ ◇`

Not included: function symbols.

Constants are rigid designators. Variables are bound by quantifiers. Unbound names in term position are constants; unbound names in formula position with no argument list are 0-ary predicates.

## Concrete syntax

ASCII is the typing language. Unicode aliases are accepted. The pretty-printer emits Unicode.

### Modal operators

| Meaning | ASCII | Alias | Unicode |
| --- | --- | --- | --- |
| Necessity | `[]P` | `nec P` | `□P` |
| Possibility | `<>P` | `pos P` | `◇P` |

### Quantifiers

The bound variable is a single identifier immediately after the binder.

| Meaning | ASCII | Alias | Unicode |
| --- | --- | --- | --- |
| Universal | `Ax P` | `forall x P` | `∀x P` |
| Existential | `Ex P` | `exists x P` | `∃x P` |

`Ax` / `Ex` require a capital `A`/`E` glued to the variable (`Ax`, `Ey`). Use `forall` / `exists` when that is ambiguous.

### Connectives and identity

| Meaning | ASCII | Unicode |
| --- | --- | --- |
| Negation | `~` or `not` | `¬` |
| Conjunction | `&` or `and` | `∧` |
| Disjunction | `\|` or `or` | `∨` |
| Implication | `->` | `→` |
| Biconditional | `<->` | `↔` |
| Identity | `=` | `=` |

### Atoms and terms

- Predicate application: `Man(socrates)`, `R(x, y)`
- Propositional atom: `P`, `Mortal`
- Identity atom: `socrates = plato`
- Identifiers: `[A-Za-z_][A-Za-z0-9_]*`
- Predicate names may be capitalized; this is convention, not enforced
- Whitespace is insignificant except as a token separator
- Parentheses group; quantifiers and modals bind tighter than binary connectives
- Precedence, tightest first: `¬` `□` `◇` quantifiers; `∧`; `∨`; `→` (right-assoc); `↔` (right-assoc)

## Quantifier scope

`Ax (Man(x) -> Mortal(x))` is the intended syllogism premise. `Ax Man(x) -> Mortal(x)` parses as `(∀x Man(x)) → Mortal(x)` because implication is looser than the quantifier. The pretty-printer must add parentheses whenever pretty-text would reparse differently.

## De re vs de dicto

Both readings are formulas, not extra syntax:

- De dicto: `[] Ex P(x)` — necessarily, something is P
- De re: `Ex [] P(x)` — something is necessarily P

They are not equivalent. Engine tests must witness that.

## Worked example

The Socrates syllogism:

| Id | English | Formula |
| --- | --- | --- |
| P1 | Socrates is a man | `Man(socrates)` |
| P2 | Men are mortal | `Ax (Man(x) -> Mortal(x))` |
| P3 | Socrates is mortal | `Mortal(socrates)` |

Claimed inference `P1, P2 ⊢ P3` is **correct** in every modal system (no modal operators fire).

## Parse errors

The parser returns a location (index and span) plus a short message. Incomplete verdicts that originate in syntax must show that message on the statement card and in the inspector. Do not run the tableau on an inference that has any unparsed formula.
