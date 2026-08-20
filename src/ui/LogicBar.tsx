type Props = {
  page: "workbench" | "guide";
  onPage: (page: "workbench" | "guide") => void;
};

export function LogicBar({ page, onPage }: Props) {
  return (
    <header className="masthead">
      <div>
        <p className="wordmark">FOML</p>
        <p className="logic-meta">system D · constant domain</p>
      </div>
      {page === "workbench" ? (
        <button type="button" onClick={() => onPage("guide")}>
          How it works
        </button>
      ) : (
        <button type="button" onClick={() => onPage("workbench")}>
          Workbench
        </button>
      )}
    </header>
  );
}
