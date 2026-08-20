import type { Formula } from "./ast";
import { pretty } from "./pretty";
import { parseEdge } from "./frames";
import type { KripkeModel } from "./checkTypes";

export type SaturatedBranch = {
  worlds: Set<string>;
  R: Set<string>;
  exists: Map<string, Set<string>>;
  items: { prefix: string; formula: Formula }[];
};

export function extractCountermodel(branch: SaturatedBranch): KripkeModel {
  const worlds = [...branch.worlds].sort();
  const access: [string, string][] = [...branch.R]
    .map(parseEdge)
    .sort(([a, b], [c, d]) => a.localeCompare(c) || b.localeCompare(d));
  const domains: Record<string, string[]> = {};
  const atoms: Record<string, string[]> = {};
  for (const world of worlds) {
    domains[world] = [...(branch.exists.get(world) ?? [])].sort();
    atoms[world] = branch.items
      .filter(
        (item) =>
          item.prefix === world &&
          (item.formula.tag === "pred" || item.formula.tag === "eq"),
      )
      .map((item) => pretty(item.formula))
      .sort();
  }
  return { worlds, access, domains, atoms };
}
