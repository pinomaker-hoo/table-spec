export interface ColumnEntry {
  name: string;
  dataType: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  foreignKeyRef?: { table: string; column: string };
}

export interface TableBox {
  tableName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  headerHeight: number;
  rowHeight: number;
  columns: ColumnEntry[];
  totalColumns: number;
}

export interface FKRelationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface ERDLayout {
  canvasWidth: number;
  canvasHeight: number;
  tableBoxes: Map<string, TableBox>;
  relationships: FKRelationship[];
}
