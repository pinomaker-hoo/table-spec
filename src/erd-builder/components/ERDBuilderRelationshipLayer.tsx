import { useMemo } from 'react';
import { useERDBuilder } from '../context';
import ERDBuilderRelationshipLine from './ERDBuilderRelationshipLine';
import { HEADER_HEIGHT, ROW_HEIGHT, ROW_HEIGHT_WITH_DETAIL, NODE_WIDTH, computeNodeWidth } from './ERDBuilderTableNode';
import type { BuilderTable, NodeDisplayOptions } from '../types';

interface Props {
  mousePos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function getColumnAnchor(
  table: BuilderTable,
  columnId: string,
  side: 'left' | 'right',
  displayOptions?: NodeDisplayOptions
): { x: number; y: number } {
  const colIndex = table.columns.findIndex((c) => c.id === columnId);
  const nodeWidth = displayOptions ? computeNodeWidth(displayOptions) : NODE_WIDTH;
  const xPos = side === 'left' ? table.x : table.x + nodeWidth;

  if (colIndex === -1) {
    return { x: xPos, y: table.y + HEADER_HEIGHT + 10 };
  }

  // Calculate Y offset accounting for variable row heights
  let yOffset = 0;
  const hasDetailOptions = displayOptions && (displayOptions.showNullable || displayOptions.showDefault || displayOptions.showComment);
  for (let i = 0; i < colIndex; i++) {
    const col = table.columns[i];
    let showDetail = false;
    if (hasDetailOptions) {
      if (displayOptions.showNullable) showDetail = true;
      if (displayOptions.showDefault && col.defaultValue) showDetail = true;
      if (displayOptions.showComment && col.comment) showDetail = true;
    }
    yOffset += showDetail ? ROW_HEIGHT_WITH_DETAIL : ROW_HEIGHT;
  }

  return {
    x: xPos,
    y: table.y + HEADER_HEIGHT + yOffset + ROW_HEIGHT / 2,
  };
}

export default function ERDBuilderRelationshipLayer({ mousePos, containerRef }: Props) {
  const { state } = useERDBuilder();

  const tableMap = useMemo(() => {
    const map = new Map<string, BuilderTable>();
    for (const t of state.tables) map.set(t.id, t);
    return map;
  }, [state.tables]);

  // Canvas-space mouse position for pending line
  const canvasMousePos = useMemo(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (mousePos.x - rect.left - state.panX) / state.zoom,
      y: (mousePos.y - rect.top - state.panY) / state.zoom,
    };
  }, [mousePos, state.panX, state.panY, state.zoom, containerRef]);

  // Compute bounding box for SVG
  const nodeWidth = useMemo(() => computeNodeWidth(state.displayOptions), [state.displayOptions]);

  const svgBounds = useMemo(() => {
    if (state.tables.length === 0) return { width: 5000, height: 5000 };
    let maxX = 0;
    let maxY = 0;
    for (const t of state.tables) {
      maxX = Math.max(maxX, t.x + nodeWidth + 200);
      maxY = Math.max(maxY, t.y + HEADER_HEIGHT + t.columns.length * ROW_HEIGHT_WITH_DETAIL + 200);
    }
    return { width: Math.max(maxX, 5000), height: Math.max(maxY, 5000) };
  }, [state.tables, nodeWidth]);

  // Pending relationship line
  let pendingLine = null;
  if (state.pendingRelationship) {
    const fromTable = tableMap.get(state.pendingRelationship.fromTableId);
    if (fromTable) {
      const from = getColumnAnchor(fromTable, state.pendingRelationship.fromColumnId, 'right', state.displayOptions);
      const to = canvasMousePos;
      const cpOffset = Math.abs(to.x - from.x) * 0.4;
      const d = `M ${from.x} ${from.y} C ${from.x + cpOffset} ${from.y}, ${to.x - cpOffset} ${to.y}, ${to.x} ${to.y}`;
      pendingLine = (
        <path
          d={d}
          fill="none"
          stroke="#4DB8B0"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          opacity={0.7}
        />
      );
    }
  }

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: svgBounds.width, height: svgBounds.height }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" opacity="0.7" />
        </marker>
        <marker
          id="arrowhead-selected"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#4DB8B0" />
        </marker>
      </defs>

      {state.relationships.map((rel) => {
        const fromTable = tableMap.get(rel.fromTableId);
        const toTable = tableMap.get(rel.toTableId);
        if (!fromTable || !toTable) return null;

        return (
          <ERDBuilderRelationshipLine
            key={rel.id}
            relationship={rel}
            fromTable={fromTable}
            toTable={toTable}
            isSelected={state.selectedRelationshipId === rel.id}
            displayOptions={state.displayOptions}
          />
        );
      })}

      {pendingLine}
    </svg>
  );
}
