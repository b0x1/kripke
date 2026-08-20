export type System = "K" | "T" | "D" | "B" | "S4" | "S5";

export type Domain = "constant" | "varying";

export type FrameProps = {
  reflexive: boolean;
  serial: boolean;
  symmetric: boolean;
  transitive: boolean;
  euclidean: boolean;
};

export function frameProps(system: System): FrameProps {
  switch (system) {
    case "K":
      return {
        reflexive: false,
        serial: false,
        symmetric: false,
        transitive: false,
        euclidean: false,
      };
    case "T":
      return {
        reflexive: true,
        serial: false,
        symmetric: false,
        transitive: false,
        euclidean: false,
      };
    case "D":
      return {
        reflexive: false,
        serial: true,
        symmetric: false,
        transitive: false,
        euclidean: false,
      };
    case "B":
      return {
        reflexive: false,
        serial: false,
        symmetric: true,
        transitive: false,
        euclidean: false,
      };
    case "S4":
      return {
        reflexive: true,
        serial: false,
        symmetric: false,
        transitive: true,
        euclidean: false,
      };
    case "S5":
      return {
        reflexive: true,
        serial: false,
        symmetric: false,
        transitive: false,
        euclidean: true,
      };
  }
}

export function edgeKey(from: string, to: string): string {
  return `${from}>${to}`;
}

export function parseEdge(key: string): [string, string] {
  const i = key.indexOf(">");
  return [key.slice(0, i), key.slice(i + 1)];
}

export function closeAccess(edges: Set<string>, worlds: Iterable<string>, props: FrameProps): void {
  let changed = true;
  while (changed) {
    changed = false;
    if (props.reflexive) {
      for (const world of worlds) {
        if (addEdge(edges, world, world)) {
          changed = true;
        }
      }
    }
    if (props.symmetric) {
      for (const key of [...edges]) {
        const [from, to] = parseEdge(key);
        if (addEdge(edges, to, from)) {
          changed = true;
        }
      }
    }
    if (props.transitive) {
      for (const a of [...edges]) {
        const [from, mid] = parseEdge(a);
        for (const b of [...edges]) {
          const [mid2, to] = parseEdge(b);
          if (mid === mid2 && addEdge(edges, from, to)) {
            changed = true;
          }
        }
      }
    }
    if (props.euclidean) {
      for (const a of [...edges]) {
        const [src, to] = parseEdge(a);
        for (const b of [...edges]) {
          const [src2, other] = parseEdge(b);
          if (src === src2 && addEdge(edges, to, other)) {
            changed = true;
          }
        }
      }
    }
  }
}

function addEdge(edges: Set<string>, from: string, to: string): boolean {
  const key = edgeKey(from, to);
  if (edges.has(key)) {
    return false;
  }
  edges.add(key);
  return true;
}
