import type { ERDLayout, TableBox, ColumnEntry, FKRelationship } from '../../types/erd';
import type { BuilderTable, BuilderRelationship } from '../types';

const NODE_WIDTH = 220;
const HEADER_HEIGHT = 28;
const COLUMN_ROW_HEIGHT = 18;
const MAX_COLUMNS_SHOWN = 15;
const TABLE_PADDING = 4;

export function builderToLayout(
  tables: BuilderTable[],
  relationships: BuilderRelationship[]
): ERDLayout {
  const tableBoxes = new Map<string, TableBox>();

  // We need name-based lookups for the existing ERDLayout format
  const tableIdToName = new Map<string, string>();
  const columnIdToName = new Map<string, string>();

  for (const t of tables) {
    tableIdToName.set(t.id, t.name);
    for (const c of t.columns) {
      columnIdToName.set(c.id, c.name);
    }
  }

  let maxX = 0;
  let maxY = 0;

  for (const table of tables) {
    const columns: ColumnEntry[] = table.columns.slice(0, MAX_COLUMNS_SHOWN).map((col) => {
      const isFK = relationships.some(
        (r) =>
          (r.fromTableId === table.id && r.fromColumnId === col.id) ||
          (r.toTableId === table.id && r.toColumnId === col.id)
      );
      return {
        name: col.name,
        dataType: col.dataType,
        isPrimaryKey: col.isPrimaryKey,
        isForeignKey: isFK,
        foreignKeyRef: undefined,
      };
    });

    const totalColumns = table.columns.length;
    const visible = Math.min(totalColumns, MAX_COLUMNS_SHOWN);
    const hasOverflow = totalColumns > MAX_COLUMNS_SHOWN;
    const height = HEADER_HEIGHT + (visible + (hasOverflow ? 1 : 0)) * COLUMN_ROW_HEIGHT + TABLE_PADDING * 2;

    const box: TableBox = {
      tableName: table.name,
      x: table.x,
      y: table.y,
      width: NODE_WIDTH,
      height,
      headerHeight: HEADER_HEIGHT,
      rowHeight: COLUMN_ROW_HEIGHT,
      columns,
      totalColumns,
    };

    tableBoxes.set(table.name, box);
    maxX = Math.max(maxX, table.x + NODE_WIDTH);
    maxY = Math.max(maxY, table.y + height);
  }

  const fkRelationships: FKRelationship[] = relationships
    .map((r) => {
      const fromTable = tableIdToName.get(r.fromTableId);
      const toTable = tableIdToName.get(r.toTableId);
      const fromColumn = columnIdToName.get(r.fromColumnId);
      const toColumn = columnIdToName.get(r.toColumnId);
      if (!fromTable || !toTable || !fromColumn || !toColumn) return null;
      return { fromTable, fromColumn, toTable, toColumn };
    })
    .filter((r): r is FKRelationship => r !== null);

  return {
    canvasWidth: maxX + 160,
    canvasHeight: maxY + 160,
    tableBoxes,
    relationships: fkRelationships,
  };
}
