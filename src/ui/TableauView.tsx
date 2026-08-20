import { useState } from "react";
import type { TableauTree } from "../engine/checkTypes";

type Props = {
  tree: TableauTree;
};

export function TableauView({ tree }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="tableau-view">
      <button
        type="button"
        className="tableau-toggle-btn"
        onClick={() => setOpen((cur) => !cur)}
        aria-expanded={open}
      >
        {open ? "Hide tableau proof ▲" : "Show tableau proof ▼"}
      </button>

      {open ? (
        <div className="tableau-tree-content">
          <TreeNode node={tree} />
        </div>
      ) : null}
    </div>
  );
}

function TreeNode({ node }: { node: TableauTree }) {
  return (
    <div className="tableau-node">
      {node.items.length > 0 ? (
        <ul className="tableau-items">
          {node.items.map((item, idx) => (
            <li key={idx} className="tableau-item">
              <code>{item}</code>
            </li>
          ))}
        </ul>
      ) : null}

      {node.closed ? (
        <div className="tableau-closed-mark">
          <span className="closed-badge">✘ Closed</span>
        </div>
      ) : null}

      {node.children.length > 0 ? (
        <div className="tableau-children">
          {node.children.map((child, idx) => (
            <div key={idx} className="tableau-branch">
              <span className="branch-label">Branch {idx + 1}</span>
              <TreeNode node={child} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
