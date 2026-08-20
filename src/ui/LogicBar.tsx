type Props = {
  page: "workbench" | "guide";
  onPage: (page: "workbench" | "guide") => void;
};

export function LogicBar({ page, onPage }: Props) {
  return (
    <header className="masthead">
      <div>
        <p className="wordmark">Kripke</p>
        <p className="logic-meta">reasoning tool for debate bros</p>
      </div>
      {page === "workbench" ? (
        <button type="button" onClick={() => onPage("guide")}>
          How it works
        </button>
      ) : (
        <button type="button" onClick={() => onPage("workbench")}>
          Your claims
        </button>
      )}
    </header>
  );
}
