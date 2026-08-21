type PaletteProps = {
  onInsert: (symbol: string) => void;
  className?: string;
};

export const PALETTE_SYMBOLS = [
  { symbol: "□", label: "necessity (box)", key: "nec" },
  { symbol: "◇", label: "possibility (diamond)", key: "pos" },
  { symbol: "∀", label: "universal quantifier (for all)", key: "forall" },
  { symbol: "∃", label: "existential quantifier (there exists)", key: "exists" },
  { symbol: "→", label: "implication (if then)", key: "implies" },
  { symbol: "∧", label: "conjunction (and)", key: "and" },
  { symbol: "∨", label: "disjunction (or)", key: "or" },
  { symbol: "¬", label: "negation (not)", key: "not" },
  { symbol: "=", label: "identity (equals)", key: "eq" },
] as const;

export function FormulaPalette({ onInsert, className = "formula-palette" }: PaletteProps) {
  return (
    <div className={className} aria-label="Formula palette">
      <span className="palette-label">Palette:</span>
      {PALETTE_SYMBOLS.map(({ symbol, label }) => (
        <button
          key={symbol}
          type="button"
          className="palette-btn"
          aria-label={`Insert ${label}`}
          title={`Insert ${symbol} (${label})`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(symbol)}
        >
          {symbol}
        </button>
      ))}
    </div>
  );
}
