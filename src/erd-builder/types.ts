export interface BuilderColumn {
  id: string;
  name: string;
  dataType: string;
  nullable: boolean;
  defaultValue: string | null;
  comment: string;
  isPrimaryKey: boolean;
  isUnique: boolean;
  isAutoIncrement: boolean;
}

export interface BuilderTable {
  id: string;
  name: string;
  comment: string;
  columns: BuilderColumn[];
  x: number;
  y: number;
}

export interface BuilderRelationship {
  id: string;
  fromTableId: string;
  fromColumnId: string;
  toTableId: string;
  toColumnId: string;
}

export interface NodeDisplayOptions {
  showDataType: boolean;
  showNullable: boolean;
  showDefault: boolean;
  showComment: boolean;
  showConstraints: boolean;
  showUnique: boolean;
  showAutoIncrement: boolean;
}

export const defaultDisplayOptions: NodeDisplayOptions = {
  showDataType: true,
  showNullable: false,
  showDefault: false,
  showComment: false,
  showConstraints: true,
  showUnique: false,
  showAutoIncrement: false,
};

export interface ERDBuilderSnapshot {
  tables: BuilderTable[];
  relationships: BuilderRelationship[];
}

export interface ERDBuilderState {
  tables: BuilderTable[];
  relationships: BuilderRelationship[];
  selectedTableId: string | null;
  selectedRelationshipId: string | null;
  pendingRelationship: {
    fromTableId: string;
    fromColumnId: string;
  } | null;
  zoom: number;
  panX: number;
  panY: number;
  displayOptions: NodeDisplayOptions;
  history: ERDBuilderSnapshot[];
  historyIndex: number;
}
