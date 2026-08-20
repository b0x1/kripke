import type { Formula, Term } from "./ast";
import { keywordSymbols, keywordWords } from "./syntaxGuide";

export type ParseError = {
  message: string;
  index: number;
  length: number;
};

export type ParseResult =
  | { ok: true; formula: Formula }
  | { ok: false; error: ParseError };

type TokKind = "ident" | "op" | "lparen" | "rparen" | "comma" | "eof";

type Tok = {
  kind: TokKind;
  value: string;
  index: number;
  length: number;
};

const identStart = /[A-Za-z_]/;
const identChar = /[A-Za-z0-9_]/;
const axForm = /^[AE][a-z_][A-Za-z0-9_]*$/;

export function parse(src: string): ParseResult {
  const tokens = scan(src);
  const parser = new Parser(tokens);
  try {
    const formula = parser.parseIff();
    parser.expectEof();
    return { ok: true, formula: bind(formula, new Set()) };
  } catch (err) {
    if (err instanceof ParseFail) {
      return { ok: false, error: err.error };
    }
    throw err;
  }
}

class ParseFail {
  error: ParseError;
  constructor(error: ParseError) {
    this.error = error;
  }
}

class Parser {
  private i = 0;
  private tokens: Tok[];

  constructor(tokens: Tok[]) {
    this.tokens = tokens;
  }

  parseIff(): Formula {
    const left = this.parseImp();
    if (this.eatOp("↔")) {
      return { tag: "iff", left, right: this.parseIff() };
    }
    return left;
  }

  parseImp(): Formula {
    const left = this.parseOr();
    if (this.eatOp("→")) {
      return { tag: "imp", left, right: this.parseImp() };
    }
    return left;
  }

  parseOr(): Formula {
    let left = this.parseAnd();
    while (this.eatOp("∨")) {
      left = { tag: "or", left, right: this.parseAnd() };
    }
    return left;
  }

  parseAnd(): Formula {
    let left = this.parseUnary();
    while (this.eatOp("∧")) {
      left = { tag: "and", left, right: this.parseUnary() };
    }
    return left;
  }

  parseUnary(): Formula {
    if (this.eatOp("¬")) {
      return { tag: "not", inner: this.parseUnary() };
    }
    if (this.eatOp("□")) {
      return { tag: "box", inner: this.parseUnary() };
    }
    if (this.eatOp("◇")) {
      return { tag: "dia", inner: this.parseUnary() };
    }
    if (this.eatOp("∀")) {
      const name = this.expectIdent("variable");
      return { tag: "all", name, inner: this.parseUnary() };
    }
    if (this.eatOp("∃")) {
      const name = this.expectIdent("variable");
      return { tag: "ex", name, inner: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  parsePrimary(): Formula {
    if (this.eat("lparen")) {
      const inner = this.parseIff();
      this.expect("rparen", "expected )");
      return inner;
    }
    const ident = this.peek();
    if (ident.kind === "ident") {
      this.i += 1;
      if (this.eat("lparen")) {
        const args: Term[] = [];
        if (!this.check("rparen")) {
          args.push(this.parseTerm());
          while (this.eat("comma")) {
            args.push(this.parseTerm());
          }
        }
        this.expect("rparen", "expected )");
        return { tag: "pred", name: ident.value, args };
      }
      if (this.eatOp("=")) {
        return {
          tag: "eq",
          left: { tag: "const", name: ident.value },
          right: this.parseTerm(),
        };
      }
      return { tag: "pred", name: ident.value, args: [] };
    }
    throw this.fail("expected formula", ident);
  }

  parseTerm(): Term {
    const name = this.expectIdent("term");
    return { tag: "const", name };
  }

  eatOp(unicode: string): boolean {
    const tok = this.peek();
    if (tok.kind === "op" && tok.value === unicode) {
      this.i += 1;
      return true;
    }
    return false;
  }

  eat(kind: TokKind): boolean {
    if (this.peek().kind === kind) {
      this.i += 1;
      return true;
    }
    return false;
  }

  check(kind: TokKind): boolean {
    return this.peek().kind === kind;
  }

  expect(kind: TokKind, message: string): Tok {
    const tok = this.peek();
    if (tok.kind !== kind) {
      throw this.fail(message, tok);
    }
    this.i += 1;
    return tok;
  }

  expectIdent(what: string): string {
    const tok = this.peek();
    if (tok.kind !== "ident") {
      throw this.fail(`expected ${what}`, tok);
    }
    this.i += 1;
    return tok.value;
  }

  expectEof(): void {
    const tok = this.peek();
    if (tok.kind !== "eof") {
      throw this.fail("unexpected input", tok);
    }
  }

  peek(): Tok {
    return this.tokens[this.i] as Tok;
  }

  fail(message: string, tok: Tok): ParseFail {
    return new ParseFail({
      message,
      index: tok.index,
      length: Math.max(1, tok.length),
    });
  }
}

function scan(src: string): Tok[] {
  const tokens: Tok[] = [];
  let i = 0;
  while (i < src.length) {
    if (/\s/.test(src[i] ?? "")) {
      i += 1;
      continue;
    }
    const symbol = matchSymbol(src, i);
    if (symbol) {
      tokens.push({
        kind: "op",
        value: symbol.unicode,
        index: i,
        length: symbol.raw.length,
      });
      i += symbol.raw.length;
      continue;
    }
    if (src[i] === "(") {
      tokens.push({ kind: "lparen", value: "(", index: i, length: 1 });
      i += 1;
      continue;
    }
    if (src[i] === ")") {
      tokens.push({ kind: "rparen", value: ")", index: i, length: 1 });
      i += 1;
      continue;
    }
    if (src[i] === ",") {
      tokens.push({ kind: "comma", value: ",", index: i, length: 1 });
      i += 1;
      continue;
    }
    if (identStart.test(src[i] ?? "")) {
      let j = i + 1;
      while (j < src.length && identChar.test(src[j] ?? "")) {
        j += 1;
      }
      const raw = src.slice(i, j);
      const word = keywordWords[raw.toLowerCase()];
      if (word) {
        tokens.push({ kind: "op", value: word, index: i, length: raw.length });
      } else if (axForm.test(raw)) {
        tokens.push({
          kind: "op",
          value: raw[0] === "A" ? "∀" : "∃",
          index: i,
          length: 1,
        });
        tokens.push({
          kind: "ident",
          value: raw.slice(1),
          index: i + 1,
          length: raw.length - 1,
        });
      } else {
        tokens.push({ kind: "ident", value: raw, index: i, length: raw.length });
      }
      i = j;
      continue;
    }
    tokens.push({ kind: "op", value: src[i] ?? "", index: i, length: 1 });
    i += 1;
  }
  tokens.push({ kind: "eof", value: "", index: src.length, length: 0 });
  return tokens;
}

function matchSymbol(
  src: string,
  i: number,
): { raw: string; unicode: string } | null {
  for (const [raw, unicode] of keywordSymbols) {
    if (raw === "=") {
      continue;
    }
    if (src.startsWith(raw, i)) {
      return { raw, unicode };
    }
  }
  if (src[i] === "=") {
    return { raw: "=", unicode: "=" };
  }
  return null;
}

function bind(formula: Formula, bound: Set<string>): Formula {
  switch (formula.tag) {
    case "pred":
      return {
        tag: "pred",
        name: formula.name,
        args: formula.args.map((t) => bindTerm(t, bound)),
      };
    case "eq":
      return {
        tag: "eq",
        left: bindTerm(formula.left, bound),
        right: bindTerm(formula.right, bound),
      };
    case "not":
    case "box":
    case "dia":
      return { tag: formula.tag, inner: bind(formula.inner, bound) };
    case "and":
    case "or":
    case "imp":
    case "iff":
      return {
        tag: formula.tag,
        left: bind(formula.left, bound),
        right: bind(formula.right, bound),
      };
    case "all":
    case "ex": {
      const next = new Set(bound);
      next.add(formula.name);
      return {
        tag: formula.tag,
        name: formula.name,
        inner: bind(formula.inner, next),
      };
    }
  }
}

function bindTerm(term: Term, bound: Set<string>): Term {
  if (bound.has(term.name)) {
    return { tag: "var", name: term.name };
  }
  return { tag: "const", name: term.name };
}
