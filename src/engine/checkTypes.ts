export type VerdictStatus = "correct" | "false" | "incomplete";

/** Checker output. `notes` = tooltip. `contradicts` = statement ids shown when false. */
export type CheckResult = {
  status: VerdictStatus;
  notes: string[];
  contradicts?: string[];
};
