import type { Formula, Term } from "./ast";
import { collectConstants, nnf, subst } from "./ast";
import type { CheckOptions, CheckResult, TableauTree } from "./checkTypes";
import { extractCountermodel } from "./countermodel";
import {
  closeAccess,
  edgeKey,
  frameProps,
  parseEdge,
  type FrameProps,
} from "./frames";
import { pretty } from "./pretty";

type Item = {
  prefix: string;
  formula: Formula;
};

class UnionFind {
  parent = new Map<string, string>();

  clone(): UnionFind {
    const copy = new UnionFind();
    copy.parent = new Map(this.parent);
    return copy;
  }

  find(name: string): string {
    if (!this.parent.has(name)) {
      this.parent.set(name, name);
    }
    const parent = this.parent.get(name) as string;
    if (parent !== name) {
      const root = this.find(parent);
      this.parent.set(name, root);
      return root;
    }
    return parent;
  }

  union(a: string, b: string): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) {
      this.parent.set(ra, rb);
    }
  }
}

type Branch = {
  items: Item[];
  keys: Set<string>;
  R: Set<string>;
  worlds: Set<string>;
  exists: Map<string, Set<string>>;
  nextChild: Map<string, number>;
  nextParam: number;
  gammaUsed: Set<string>;
  gammaSteps: number;
  nodeCount: number;
  uf: UnionFind;
  expandedAnd: Set<string>;
  expandedOr: Set<string>;
  expandedDia: Set<string>;
  expandedEx: Set<string>;
  copiedNu: Set<string>;
  closed: boolean;
  boundHit: boolean;
  constantDomain: boolean;
  props: FrameProps;
  bounds: CheckOptions["bounds"];
};

export function runTableau(
  premises: Formula[],
  conclusion: Formula,
  options: CheckOptions,
): CheckResult {
  const props = frameProps(options.system);
  const start: Formula[] = [
    ...premises.map((f) => nnf(f)),
    nnf({ tag: "not", inner: conclusion }),
  ];
  const constants = new Set<string>();
  for (const formula of start) {
    collectConstants(formula, constants);
  }
  const branch = newBranch(options, props, constants);
  for (const formula of start) {
    addItem(branch, "1", formula);
  }
  const outcome = search(branch);
  if (outcome.kind === "closed") {
    return {
      status: "correct",
      notes: ["tableau closes"],
      proof: outcome.tree,
    };
  }
  if (outcome.kind === "open") {
    return {
      status: "false",
      notes: ["open saturated branch"],
      model: extractCountermodel(outcome.branch),
    };
  }
  return {
    status: "incomplete",
    notes: ["search bound"],
    issues: [{ kind: "bound", message: "unsaturated branch hit a bound" }],
  };
}

function newBranch(
  options: CheckOptions,
  props: FrameProps,
  constants: Set<string>,
): Branch {
  const exists = new Map<string, Set<string>>();
  exists.set("1", new Set(constants));
  return {
    items: [],
    keys: new Set(),
    R: new Set(),
    worlds: new Set(["1"]),
    exists,
    nextChild: new Map(),
    nextParam: 1,
    gammaUsed: new Set(),
    gammaSteps: 0,
    nodeCount: 0,
    uf: new UnionFind(),
    expandedAnd: new Set(),
    expandedOr: new Set(),
    expandedDia: new Set(),
    expandedEx: new Set(),
    copiedNu: new Set(),
    closed: false,
    boundHit: false,
    constantDomain: options.domain === "constant",
    props,
    bounds: options.bounds,
  };
}

function cloneBranch(branch: Branch): Branch {
  return {
    items: branch.items.map((item) => ({ ...item })),
    keys: new Set(branch.keys),
    R: new Set(branch.R),
    worlds: new Set(branch.worlds),
    exists: new Map(
      [...branch.exists].map(([world, names]) => [world, new Set(names)]),
    ),
    nextChild: new Map(branch.nextChild),
    nextParam: branch.nextParam,
    gammaUsed: new Set(branch.gammaUsed),
    gammaSteps: branch.gammaSteps,
    nodeCount: branch.nodeCount,
    uf: branch.uf.clone(),
    expandedAnd: new Set(branch.expandedAnd),
    expandedOr: new Set(branch.expandedOr),
    expandedDia: new Set(branch.expandedDia),
    expandedEx: new Set(branch.expandedEx),
    copiedNu: new Set(branch.copiedNu),
    closed: branch.closed,
    boundHit: branch.boundHit,
    constantDomain: branch.constantDomain,
    props: branch.props,
    bounds: branch.bounds,
  };
}

type Search =
  | { kind: "closed"; tree: TableauTree }
  | { kind: "open"; branch: Branch }
  | { kind: "bound" };

function search(branch: Branch): Search {
  for (;;) {
    ensureSerial(branch);
    closeAccess(branch.R, branch.worlds, branch.props);
    if (branch.closed) {
      return { kind: "closed", tree: treeOf(branch, []) };
    }
    if (overBound(branch)) {
      return { kind: "bound" };
    }
    if (applyAlpha(branch) || applyNu(branch) || applyPi(branch) || applyDelta(branch)) {
      continue;
    }
    const orItem = findOr(branch);
    if (orItem && orItem.formula.tag === "or") {
      const key = itemKey(orItem);
      branch.expandedOr.add(key);
      const left = cloneBranch(branch);
      const right = cloneBranch(branch);
      addItem(left, orItem.prefix, orItem.formula.left);
      addItem(right, orItem.prefix, orItem.formula.right);
      const a = search(left);
      if (a.kind === "open") {
        return a;
      }
      const b = search(right);
      if (b.kind === "open") {
        return b;
      }
      if (a.kind === "closed" && b.kind === "closed") {
        return {
          kind: "closed",
          tree: treeOf(branch, [a.tree, b.tree]),
        };
      }
      return { kind: "bound" };
    }
    if (applyGamma(branch)) {
      continue;
    }
    if (branch.boundHit || pendingModal(branch)) {
      return { kind: "bound" };
    }
    return { kind: "open", branch };
  }
}

function overBound(branch: Branch): boolean {
  return (
    branch.nodeCount > branch.bounds.maxNodes ||
    branch.gammaSteps > branch.bounds.maxGammaRounds * 16
  );
}

function ensureSerial(branch: Branch): void {
  if (!branch.props.serial) {
    return;
  }
  for (const world of [...branch.worlds]) {
    if (hasSuccessor(branch, world)) {
      continue;
    }
    if (prefixDepth(world) >= branch.bounds.maxPrefixDepth) {
      branch.boundHit = true;
      continue;
    }
    addWorld(branch, childPrefix(branch, world));
  }
}

function hasSuccessor(branch: Branch, world: string): boolean {
  for (const key of branch.R) {
    const [from, to] = parseEdge(key);
    if (from === world && to !== world) {
      return true;
    }
  }
  return false;
}

function applyAlpha(branch: Branch): boolean {
  for (const item of branch.items) {
    if (item.formula.tag !== "and") {
      continue;
    }
    const key = itemKey(item);
    if (branch.expandedAnd.has(key)) {
      continue;
    }
    branch.expandedAnd.add(key);
    addItem(branch, item.prefix, item.formula.left);
    addItem(branch, item.prefix, item.formula.right);
    return true;
  }
  return false;
}

function applyNu(branch: Branch): boolean {
  let added = false;
  for (const item of branch.items) {
    if (item.formula.tag !== "box") {
      continue;
    }
    for (const key of branch.R) {
      const [from, to] = parseEdge(key);
      if (from !== item.prefix) {
        continue;
      }
      const copyKey = `${itemKey(item)}>${to}`;
      if (branch.copiedNu.has(copyKey)) {
        continue;
      }
      branch.copiedNu.add(copyKey);
      addItem(branch, to, item.formula.inner);
      added = true;
    }
  }
  return added;
}

function applyPi(branch: Branch): boolean {
  for (const item of branch.items) {
    if (item.formula.tag !== "dia") {
      continue;
    }
    const key = itemKey(item);
    if (branch.expandedDia.has(key)) {
      continue;
    }
    if (prefixDepth(item.prefix) >= branch.bounds.maxPrefixDepth) {
      branch.boundHit = true;
      continue;
    }
    branch.expandedDia.add(key);
    const next = childPrefix(branch, item.prefix);
    addWorld(branch, next);
    addItem(branch, next, item.formula.inner);
    return true;
  }
  return false;
}

function applyDelta(branch: Branch): boolean {
  for (const item of branch.items) {
    if (item.formula.tag !== "ex") {
      continue;
    }
    const key = itemKey(item);
    if (branch.expandedEx.has(key)) {
      continue;
    }
    branch.expandedEx.add(key);
    const param = freshParam(branch, item.prefix);
    addItem(
      branch,
      item.prefix,
      subst(item.formula.inner, item.formula.name, {
        tag: "param",
        name: param,
      }),
    );
    return true;
  }
  return false;
}

function applyGamma(branch: Branch): boolean {
  for (const item of branch.items) {
    if (item.formula.tag !== "all") {
      continue;
    }
    ensureInhabited(branch, item.prefix);
    const names = branch.exists.get(item.prefix);
    if (!names) {
      continue;
    }
    for (const name of names) {
      const used = `${itemKey(item)}|${name}`;
      if (branch.gammaUsed.has(used)) {
        continue;
      }
      branch.gammaUsed.add(used);
      branch.gammaSteps += 1;
      addItem(
        branch,
        item.prefix,
        subst(item.formula.inner, item.formula.name, termFor(name)),
      );
      return true;
    }
  }
  return false;
}

function findOr(branch: Branch): Item | null {
  for (const item of branch.items) {
    if (item.formula.tag === "or" && !branch.expandedOr.has(itemKey(item))) {
      return item;
    }
  }
  return null;
}

function pendingModal(branch: Branch): boolean {
  return branch.items.some(
    (item) =>
      (item.formula.tag === "dia" && !branch.expandedDia.has(itemKey(item))) ||
      (item.formula.tag === "box" && branch.props.serial && !hasSuccessor(branch, item.prefix)),
  );
}

function addItem(branch: Branch, prefix: string, formula: Formula): void {
  addWorld(branch, prefix);
  const key = `${prefix}|${pretty(formula)}`;
  if (branch.keys.has(key)) {
    return;
  }
  branch.keys.add(key);
  branch.items.push({ prefix, formula });
  branch.nodeCount += 1;
  if (formula.tag === "eq") {
    branch.uf.union(formula.left.name, formula.right.name);
  }
  recheckClosed(branch);
}

function addWorld(branch: Branch, prefix: string): void {
  if (branch.worlds.has(prefix)) {
    return;
  }
  branch.worlds.add(prefix);
  const names = new Set<string>();
  if (branch.constantDomain) {
    for (const set of branch.exists.values()) {
      for (const name of set) {
        names.add(name);
      }
    }
  }
  branch.exists.set(prefix, names);
  if (prefix.includes(".")) {
    const parent = prefix.slice(0, prefix.lastIndexOf("."));
    branch.R.add(edgeKey(parent, prefix));
  }
  if (branch.constantDomain) {
    for (const world of branch.worlds) {
      const set = branch.exists.get(world);
      if (!set) {
        continue;
      }
      for (const name of names) {
        set.add(name);
      }
    }
  }
  closeAccess(branch.R, branch.worlds, branch.props);
}

function freshParam(branch: Branch, prefix: string): string {
  const name = `_${branch.nextParam}`;
  branch.nextParam += 1;
  inhabit(branch, prefix, name);
  return name;
}

function inhabit(branch: Branch, prefix: string, name: string): void {
  if (branch.constantDomain) {
    for (const world of branch.worlds) {
      const set = branch.exists.get(world) ?? new Set();
      set.add(name);
      branch.exists.set(world, set);
    }
    return;
  }
  const set = branch.exists.get(prefix) ?? new Set();
  set.add(name);
  branch.exists.set(prefix, set);
}

function ensureInhabited(branch: Branch, prefix: string): void {
  const set = branch.exists.get(prefix);
  if (set && set.size > 0) {
    return;
  }
  freshParam(branch, prefix);
}

function termFor(name: string): Term {
  if (name.startsWith("_")) {
    return { tag: "param", name };
  }
  return { tag: "const", name };
}

function childPrefix(branch: Branch, prefix: string): string {
  const n = (branch.nextChild.get(prefix) ?? 0) + 1;
  branch.nextChild.set(prefix, n);
  return `${prefix}.${n}`;
}

function prefixDepth(prefix: string): number {
  return prefix.split(".").length;
}

function itemKey(item: Item): string {
  return `${item.prefix}|${pretty(item.formula)}`;
}

function recheckClosed(branch: Branch): void {
  const pos = new Set<string>();
  const neg = new Set<string>();
  for (const item of branch.items) {
    const lit = literalKey(branch, item);
    if (!lit) {
      continue;
    }
    if (lit.neg) {
      if (pos.has(lit.key)) {
        branch.closed = true;
        return;
      }
      if (lit.refl) {
        branch.closed = true;
        return;
      }
      neg.add(lit.key);
    } else {
      if (neg.has(lit.key)) {
        branch.closed = true;
        return;
      }
      pos.add(lit.key);
    }
  }
}

function literalKey(
  branch: Branch,
  item: Item,
): { key: string; neg: boolean; refl: boolean } | null {
  const formula = item.formula;
  if (formula.tag === "pred") {
    return {
      key: `${item.prefix}|P|${formula.name}|${formula.args.map((t) => branch.uf.find(t.name)).join(",")}`,
      neg: false,
      refl: false,
    };
  }
  if (formula.tag === "eq") {
    const a = branch.uf.find(formula.left.name);
    const b = branch.uf.find(formula.right.name);
    const [x, y] = a < b ? [a, b] : [b, a];
    return { key: `${item.prefix}|=|${x}|${y}`, neg: false, refl: false };
  }
  if (formula.tag === "not" && formula.inner.tag === "pred") {
    const inner = formula.inner;
    return {
      key: `${item.prefix}|P|${inner.name}|${inner.args.map((t) => branch.uf.find(t.name)).join(",")}`,
      neg: true,
      refl: false,
    };
  }
  if (formula.tag === "not" && formula.inner.tag === "eq") {
    const inner = formula.inner;
    const a = branch.uf.find(inner.left.name);
    const b = branch.uf.find(inner.right.name);
    const [x, y] = a < b ? [a, b] : [b, a];
    return { key: `${item.prefix}|=|${x}|${y}`, neg: true, refl: a === b };
  }
  return null;
}

function treeOf(branch: Branch, children: TableauTree[]): TableauTree {
  return {
    closed: children.length === 0 ? branch.closed : children.every((c) => c.closed),
    items: branch.items.map((item) => `${item.prefix}: ${pretty(item.formula)}`),
    children,
  };
}
