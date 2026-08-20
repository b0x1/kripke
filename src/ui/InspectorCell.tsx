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
  const contradict =
    result.status === "false" && result.contradicts && result.contradicts.length > 0
      ? `contradicts ${result.contradicts.join(", ")}`
      : null;
  return (
    <div className={`inspector ${view.className}`}>
      <div>
        {view.emoji} {view.label}
      </div>
      {contradict ? <div className="inspector-contradicts">{contradict}</div> : null}
    </div>
  );
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
  const className = postulate
    ? "inspector inspector-postulate"
    : result
      ? `inspector ${verdictView[result.status].className}`
      : "inspector";
  const tip =
    !postulate && result && result.notes.length > 0
      ? result.notes.join("\n")
      : undefined;

  return (
    <td className={className} title={tip}>
      {postulate ? <div>postulate</div> : <InspectorView result={result} />}
      {offerPostulate ? (
        <label className="postulate-toggle">
          <input
            type="checkbox"
            checked={postulate}
            onChange={(e) => onPostulate(e.target.checked)}
            aria-label={`${id} postulate`}
          />{" "}
          Postulate
        </label>
      ) : null}
    </td>
  );
}
