import type { KripkeModel } from "../engine/checkTypes";

type Props = {
  model: KripkeModel;
};

type NodePos = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  atoms: string[];
  domain: string[];
};

export function KripkeGraph({ model }: Props) {
  const { worlds, access, domains, atoms } = model;
  if (!worlds || worlds.length === 0) {
    return null;
  }

  // Layout calculations
  const depthGroups = new Map<number, string[]>();
  for (const w of worlds) {
    const depth = w.split(".").length - 1;
    if (!depthGroups.has(depth)) {
      depthGroups.set(depth, []);
    }
    depthGroups.get(depth)!.push(w);
  }

  const sortedDepths = [...depthGroups.keys()].sort((a, b) => a - b);
  const nodeMap = new Map<string, NodePos>();

  const nodeWidth = 140;
  const nodeHeight = 70;
  const levelYGap = 110;
  const itemXGap = 170;

  let maxW = 360;

  for (let dIdx = 0; dIdx < sortedDepths.length; dIdx += 1) {
    const depth = sortedDepths[dIdx];
    const group = depthGroups.get(depth) ?? [];
    const levelY = 60 + dIdx * levelYGap;

    const rowWidth = group.length * itemXGap;
    if (rowWidth + 80 > maxW) {
      maxW = rowWidth + 80;
    }

    group.forEach((worldId, idx) => {
      const startX = Math.max(40, (maxW - rowWidth) / 2 + itemXGap / 2);
      const x = startX + idx * itemXGap;
      nodeMap.set(worldId, {
        id: worldId,
        x,
        y: levelY,
        width: nodeWidth,
        height: nodeHeight,
        atoms: atoms[worldId] ?? [],
        domain: domains[worldId] ?? [],
      });
    });
  }

  const svgHeight = Math.max(160, 80 + sortedDepths.length * levelYGap);

  return (
    <div className="kripke-graph-container">
      <div className="kripke-graph-title">Countermodel (Kripke frame)</div>
      <svg
        viewBox={`0 0 ${maxW} ${svgHeight}`}
        className="kripke-graph-svg"
        aria-label="Kripke countermodel graph"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--ink)" />
          </marker>
        </defs>

        {/* Accessibility Edges */}
        {access.map(([from, to], idx) => {
          const source = nodeMap.get(from);
          const target = nodeMap.get(to);
          if (!source || !target) {
            return null;
          }

          if (from === to) {
            // Self loop
            const rx = source.x;
            const ry = source.y - nodeHeight / 2;
            return (
              <path
                key={`edge-${from}-${to}-${idx}`}
                d={`M ${rx - 15} ${ry} C ${rx - 30} ${ry - 35}, ${rx + 30} ${ry - 35}, ${rx + 15} ${ry}`}
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
              />
            );
          }

          // Edge between source and target
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const angle = Math.atan2(dy, dx);

          const startX = source.x + (nodeWidth / 2) * Math.cos(angle);
          const startY = source.y + (nodeHeight / 2) * Math.sin(angle);
          const endX = target.x - (nodeWidth / 2) * Math.cos(angle);
          const endY = target.y - (nodeHeight / 2) * Math.sin(angle);

          return (
            <line
              key={`edge-${from}-${to}-${idx}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="var(--ink)"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {/* World Nodes */}
        {[...nodeMap.values()].map((node) => (
          <g key={node.id} transform={`translate(${node.x - node.width / 2}, ${node.y - node.height / 2})`}>
            <rect
              width={node.width}
              height={node.height}
              rx="6"
              ry="6"
              fill="var(--paper-raised)"
              stroke="var(--ink)"
              strokeWidth="1.5"
            />
            <text
              x={node.width / 2}
              y="18"
              textAnchor="middle"
              className="kripke-node-title"
            >
              World w{node.id}
            </text>
            <text
              x={node.width / 2}
              y="36"
              textAnchor="middle"
              className="kripke-node-text"
            >
              {node.domain.length > 0 ? `D: {${node.domain.join(", ")}}` : "D: ∅"}
            </text>
            <text
              x={node.width / 2}
              y="52"
              textAnchor="middle"
              className="kripke-node-text kripke-atoms"
            >
              {node.atoms.length > 0 ? node.atoms.slice(0, 3).join(", ") : "no true atoms"}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
