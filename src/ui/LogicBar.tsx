type Props = {
  page: "workbench" | "guide";
  onPage: (page: "workbench" | "guide") => void;
};

export function LogicBar({ page, onPage }: Props) {
  return (
    <header>
      <strong>FOML</strong>
      {" — "}
      system D, constant domain
      {" — "}
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
