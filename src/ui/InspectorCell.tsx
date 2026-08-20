import type { CheckResult } from "../engine/checkTypes";
import { verdictView } from "./verdictView";

type ViewProps = {
  result: CheckResult | null;
};

export function InspectorView({ result }: ViewProps) {
  if (!result) {
    return null;
  }
  const view = verdictView[result.status];
  const extra = extraLine(result);
  return (
    <div className="inspector-mark">
      <div className="inspector-label">
        {view.emoji} {view.label}
      </div>
      {extra ? <div className={extra.className}>{extra.text}</div> : null}
    </div>
  );
}

function extraLine(
  result: CheckResult,
): { text: string; className: string } | null {
  if (
    result.status === "false" &&
    result.contradicts &&
    result.contradicts.length > 0
  ) {
    return {
      text: `contradicts ${result.contradicts.join(", ")}`,
      className: "inspector-contradicts",
    };
  }
  if (result.status === "correct" && result.bases && result.bases.length > 0) {
    return {
      text: `from ${result.bases.join(", ")}`,
      className: "inspector-bases",
    };
  }
  if (result.status === "incomplete" && result.notes.length > 0) {
    return {
      text: result.notes.join(" · "),
      className: "inspector-why",
    };
  }
  return null;
}

type CellProps = {
  result: CheckResult | null;
  postulate: boolean;
  id: string;
  onPostulate: (value: boolean) => void;
};

export function InspectorCell({
  result,
  postulate,
  id,
  onPostulate,
}: CellProps) {
  const offerPostulate = postulate || result?.status === "incomplete";
  const className = [
    "inspector",
    postulate
      ? "inspector-postulate"
      : result
        ? verdictView[result.status].className
        : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <td className={className}>
      {postulate ? (
        <div className="inspector-label">claim</div>
      ) : (
        <InspectorView result={result} />
      )}
      {offerPostulate ? (
        <label className="postulate-toggle">
          <input
            type="checkbox"
            checked={postulate}
            onChange={(e) => onPostulate(e.target.checked)}
            aria-label={`${id} claim`}
          />{" "}
          Claim
        </label>
      ) : null}
    </td>
  );
}
