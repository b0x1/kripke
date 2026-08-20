import type { Formula } from "./ast";
import type { CheckOptions, CheckResult } from "./checkTypes";
import { defaultCheckOptions } from "./checkTypes";
import { runTableau } from "./tableau";

export function checkInference(
  premises: Formula[],
  conclusion: Formula,
  options: CheckOptions = defaultCheckOptions,
): CheckResult {
  return runTableau(premises, conclusion, options);
}
