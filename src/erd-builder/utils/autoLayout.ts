import type { BuilderTable } from '../types';

const HEADER_HEIGHT = 28;
const ROW_HEIGHT = 20;
const CELL_WIDTH = 300;
const VERTICAL_GAP = 40;
const MARGIN = 60;

function computeBoxHeight(table: BuilderTable): number {
  return HEADER_HEIGHT + Math.max(table.columns.length, 1) * ROW_HEIGHT + 8;
}

export function computeAutoLayout(tables: BuilderTable[]): BuilderTable[] {
  if (tables.length === 0) return tables;

  const sorted = [...tables].sort((a, b) => a.name.localeCompare(b.name));
  const gridCols = Math.max(1, Math.ceil(Math.sqrt(sorted.length * 1.2)));

  const rows: BuilderTable[][] = [];
  for (let i = 0; i < sorted.length; i++) {
    const rowIdx = Math.floor(i / gridCols);
    if (!rows[rowIdx]) rows[rowIdx] = [];
    rows[rowIdx].push(sorted[i]);
  }

  const result: BuilderTable[] = [];
  let yOffset = MARGIN;

  for (const row of rows) {
    let maxHeight = 0;
    for (let c = 0; c < row.length; c++) {
      const table = row[c];
      const height = computeBoxHeight(table);
      maxHeight = Math.max(maxHeight, height);
      result.push({
        ...table,
        x: MARGIN + c * CELL_WIDTH,
        y: yOffset,
      });
    }
    yOffset += maxHeight + VERTICAL_GAP;
  }

  return result;
}
