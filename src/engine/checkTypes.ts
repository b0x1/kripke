export type VerdictStatus = "correct" | "false" | "incomplete";

/** Checker output. Push strings onto `notes` for extra inspector text. */
export type CheckResult = {
  status: VerdictStatus;
  notes: string[];
};
