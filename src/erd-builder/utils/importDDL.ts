import { parseDDL } from '../../parser/ddlParser';
import type { BuilderTable, BuilderRelationship } from '../types';
import { generateId } from './idGenerator';
import { computeAutoLayout } from './autoLayout';

export function importFromDDL(sql: string): { tables: BuilderTable[]; relationships: BuilderRelationship[] } {
  const parsed = parseDDL(sql);

  // Create a map of table name -> table id, and table.column name -> column id
  const tableIdMap = new Map<string, string>();
  const columnIdMap = new Map<string, Map<string, string>>(); // tableName -> (colName -> colId)

  const tables: BuilderTable[] = parsed.map((pt) => {
    const tableId = generateId();
    tableIdMap.set(pt.name, tableId);
    const colMap = new Map<string, string>();
    columnIdMap.set(pt.name, colMap);

    const columns = pt.columns.map((pc) => {
      const colId = generateId();
      colMap.set(pc.name, colId);
      return {
        id: colId,
        name: pc.name,
        dataType: pc.dataType,
        nullable: pc.nullable,
        defaultValue: pc.defaultValue,
        comment: pc.comment,
        isPrimaryKey: pc.isPrimaryKey,
        isUnique: pc.isUnique,
        isAutoIncrement: pc.isAutoIncrement,
      };
    });

    return {
      id: tableId,
      name: pt.name,
      comment: pt.comment,
      columns,
      x: 0,
      y: 0,
    };
  });

  // Extract FK relationships
  const relationships: BuilderRelationship[] = [];
  for (const pt of parsed) {
    for (const pc of pt.columns) {
      if (pc.isForeignKey && pc.foreignKeyRef) {
        const fromTableId = tableIdMap.get(pt.name);
        const toTableId = tableIdMap.get(pc.foreignKeyRef.table);
        const fromColMap = columnIdMap.get(pt.name);
        const toColMap = columnIdMap.get(pc.foreignKeyRef.table);

        if (fromTableId && toTableId && fromColMap && toColMap) {
          const fromColumnId = fromColMap.get(pc.name);
          const toColumnId = toColMap.get(pc.foreignKeyRef.column);

          if (fromColumnId && toColumnId) {
            relationships.push({
              id: generateId(),
              fromTableId,
              fromColumnId,
              toTableId,
              toColumnId,
            });
          }
        }
      }
    }
  }

  // Auto-layout
  const laid = computeAutoLayout(tables);
  return { tables: laid, relationships };
}
