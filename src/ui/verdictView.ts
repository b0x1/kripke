import type { VerdictStatus } from "../engine/checkTypes";

export const verdictView: Record<
  VerdictStatus,
  { emoji: string; label: string; className: string }
> = {
  correct: { emoji: "✅", label: "valid", className: "inspector-correct" },
  false: { emoji: "❌", label: "false", className: "inspector-false" },
  incomplete: { emoji: "❓", label: "incomplete", className: "inspector-incomplete" },
};
