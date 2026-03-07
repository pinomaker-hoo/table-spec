import type { BuilderTable, BuilderRelationship } from '../types';

export function generateDDL(tables: BuilderTable[], relationships: BuilderRelationship[]): string {
  const lines: string[] = [];

  for (const table of tables) {
    lines.push(`CREATE TABLE \`${table.name}\` (`);

    const colDefs: string[] = [];
    const pkCols: string[] = [];
    const uniqueCols: string[] = [];

    for (const col of table.columns) {
      let def = `  \`${col.name}\` ${col.dataType}`;
      if (!col.nullable) def += ' NOT NULL';
      if (col.isAutoIncrement) def += ' AUTO_INCREMENT';
      if (col.defaultValue !== null && col.defaultValue !== '') {
        const val = col.defaultValue;
        if (['CURRENT_TIMESTAMP', 'NULL', 'TRUE', 'FALSE'].includes(val.toUpperCase()) || /^\d+$/.test(val)) {
          def += ` DEFAULT ${val}`;
        } else {
          def += ` DEFAULT '${val.replace(/'/g, "''")}'`;
        }
      }
      if (col.comment) {
        def += ` COMMENT '${col.comment.replace(/'/g, "''")}'`;
      }
      colDefs.push(def);

      if (col.isPrimaryKey) pkCols.push(`\`${col.name}\``);
      if (col.isUnique) uniqueCols.push(col.name);
    }

    // Primary key constraint
    if (pkCols.length > 0) {
      colDefs.push(`  PRIMARY KEY (${pkCols.join(', ')})`);
    }

    // Unique constraints
    for (const uCol of uniqueCols) {
      colDefs.push(`  UNIQUE KEY \`uk_${table.name}_${uCol}\` (\`${uCol}\`)`);
    }

    // Foreign key constraints
    const fks = relationships.filter((r) => r.fromTableId === table.id);
    for (const fk of fks) {
      const fromCol = table.columns.find((c) => c.id === fk.fromColumnId);
      const toTable = tables.find((t) => t.id === fk.toTableId);
      const toCol = toTable?.columns.find((c) => c.id === fk.toColumnId);
      if (fromCol && toTable && toCol) {
        colDefs.push(
          `  FOREIGN KEY (\`${fromCol.name}\`) REFERENCES \`${toTable.name}\` (\`${toCol.name}\`)`
        );
      }
    }

    lines.push(colDefs.join(',\n'));
    lines.push(`)${table.comment ? ` COMMENT='${table.comment.replace(/'/g, "''")}'` : ''};`);
    lines.push('');
  }

  return lines.join('\n');
}
