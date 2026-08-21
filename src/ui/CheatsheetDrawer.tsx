import { SyntaxSection } from "./SyntaxSection";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CheatsheetDrawer({ open, onClose }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="cheatsheet-backdrop" onClick={onClose}>
      <aside
        className="cheatsheet-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Syntax Cheatsheet"
      >
        <div className="cheatsheet-header">
          <h2>Syntax Cheatsheet</h2>
          <button
            type="button"
            className="cheatsheet-close-btn"
            onClick={onClose}
            aria-label="Close cheatsheet"
          >
            ✕
          </button>
        </div>
        <div className="cheatsheet-body">
          <SyntaxSection />
        </div>
      </aside>
    </div>
  );
}
