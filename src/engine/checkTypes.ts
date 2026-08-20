export type VerdictStatus = "correct" | "false" | "incomplete";

export type CheckOptions = {
  system: "K" | "T" | "D" | "B" | "S4" | "S5";
  domain: "constant" | "varying";
  bounds: { maxPrefixDepth: number; maxGammaRounds: number; maxNodes: number };
};

export const defaultCheckOptions: CheckOptions = {
  system: "D",
  domain: "constant",
  bounds: { maxPrefixDepth: 6, maxGammaRounds: 8, maxNodes: 400 },
};

export type TableauTree = {
  closed: boolean;
  items: string[];
  children: TableauTree[];
};

export type KripkeModel = {
  worlds: string[];
  access: [string, string][];
  domains: Record<string, string[]>;
  atoms: Record<string, string[]>;
};

export type Issue = {
  kind: "bound";
  message: string;
};

/** Checker output. `notes` = short why when incomplete. `bases` / `contradicts` = statement ids in the cell. */
export type CheckResult = {
  status: VerdictStatus;
  notes: string[];
  bases?: string[];
  contradicts?: string[];
  proof?: TableauTree;
  model?: KripkeModel;
  issues?: Issue[];
};
