export interface ParsedColumn {
  name: string;
  dataType: string;
  nullable: boolean;
  defaultValue: string | null;
  comment: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isUnique: boolean;
  isAutoIncrement: boolean;
  foreignKeyRef?: {
    table: string;
    column: string;
  };
}

export interface ParsedTable {
  name: string;
  comment: string;
  columns: ParsedColumn[];
}
