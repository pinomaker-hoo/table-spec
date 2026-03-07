import type { BuilderColumn, BuilderTable, BuilderRelationship, NodeDisplayOptions } from './types';

export type ERDBuilderAction =
  | { type: 'ADD_TABLE'; payload: { name: string; comment?: string; x: number; y: number; columns?: Omit<BuilderColumn, 'id'>[] } }
  | { type: 'UPDATE_TABLE'; payload: { tableId: string; name: string; comment: string } }
  | { type: 'DELETE_TABLE'; payload: { tableId: string } }
  | { type: 'MOVE_TABLE'; payload: { tableId: string; x: number; y: number } }
  | { type: 'MOVE_TABLE_START'; payload: { tableId: string } }

  | { type: 'ADD_COLUMN'; payload: { tableId: string; column: Omit<BuilderColumn, 'id'> } }
  | { type: 'UPDATE_COLUMN'; payload: { tableId: string; columnId: string; updates: Partial<BuilderColumn> } }
  | { type: 'DELETE_COLUMN'; payload: { tableId: string; columnId: string } }

  | { type: 'ADD_RELATIONSHIP'; payload: Omit<BuilderRelationship, 'id'> }
  | { type: 'DELETE_RELATIONSHIP'; payload: { relationshipId: string } }

  | { type: 'SELECT_TABLE'; payload: { tableId: string | null } }
  | { type: 'SELECT_RELATIONSHIP'; payload: { relationshipId: string | null } }
  | { type: 'SET_PENDING_RELATIONSHIP'; payload: { fromTableId: string; fromColumnId: string } | null }

  | { type: 'SET_ZOOM'; payload: { zoom: number } }
  | { type: 'SET_PAN'; payload: { panX: number; panY: number } }

  | { type: 'SET_DISPLAY_OPTIONS'; payload: Partial<NodeDisplayOptions> }

  | { type: 'UNDO' }
  | { type: 'REDO' }

  | { type: 'LOAD_STATE'; payload: { tables: BuilderTable[]; relationships: BuilderRelationship[] } };
