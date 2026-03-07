import type { ParsedTable, ParsedColumn } from '../../types/ddl';
import type { BuilderTable, BuilderRelationship } from '../types';

export function builderToParsedTables(
  tables: BuilderTable[],
  relationships: BuilderRelationship[]
): ParsedTable[] {
  const tableIdToName = new Map<string, string>();
  const columnIdToName = new Map<string, string>();

  for (const t of tables) {
    tableIdToName.set(t.id, t.name);
    for (const c of t.columns) {
      columnIdToName.set(c.id, c.name);
    }
  }

  return tables.map((table) => {
    const columns: ParsedColumn[] = table.columns.map((col) => {
      // Find if this column is a FK source
      const fkRel = relationships.find(
        (r) => r.fromTableId === table.id && r.fromColumnId === col.id
      );

      let foreignKeyRef: { table: string; column: string } | undefined;
      let isForeignKey = false;

      if (fkRel) {
        const refTableName = tableIdToName.get(fkRel.toTableId);
        const refColName = columnIdToName.get(fkRel.toColumnId);
        if (refTableName && refColName) {
          isForeignKey = true;
          foreignKeyRef = { table: refTableName, column: refColName };
        }
      }

      return {
        name: col.name,
        dataType: col.dataType,
        nullable: col.nullable,
        defaultValue: col.defaultValue,
        comment: col.comment,
        isPrimaryKey: col.isPrimaryKey,
        isForeignKey,
        isUnique: col.isUnique,
        isAutoIncrement: col.isAutoIncrement,
        foreignKeyRef,
      };
    });

    return {
      name: table.name,
      comment: table.comment,
      columns,
    };
  });
}
