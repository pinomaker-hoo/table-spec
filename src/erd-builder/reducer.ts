import type { ERDBuilderState, ERDBuilderSnapshot } from './types';
import { defaultDisplayOptions } from './types';
import type { ERDBuilderAction } from './actions';
import { generateId } from './utils/idGenerator';

const MAX_HISTORY = 50;

function createSnapshot(state: ERDBuilderState): ERDBuilderSnapshot {
  return {
    tables: structuredClone(state.tables),
    relationships: structuredClone(state.relationships),
  };
}

function pushHistory(state: ERDBuilderState): ERDBuilderState {
  const snapshot = createSnapshot(state);
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(snapshot);
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

export const initialState: ERDBuilderState = {
  tables: [],
  relationships: [],
  selectedTableId: null,
  selectedRelationshipId: null,
  pendingRelationship: null,
  zoom: 1,
  panX: 0,
  panY: 0,
  displayOptions: defaultDisplayOptions,
  history: [],
  historyIndex: -1,
};

export function erdBuilderReducer(state: ERDBuilderState, action: ERDBuilderAction): ERDBuilderState {
  switch (action.type) {
    case 'ADD_TABLE': {
      const s = pushHistory(state);
      const newTable = {
        id: generateId(),
        name: action.payload.name,
        comment: action.payload.comment || '',
        columns: (action.payload.columns || []).map((c) => ({ ...c, id: generateId() })),
        x: action.payload.x,
        y: action.payload.y,
      };
      return {
        ...s,
        tables: [...s.tables, newTable],
        selectedTableId: newTable.id,
        selectedRelationshipId: null,
      };
    }

    case 'UPDATE_TABLE': {
      const s = pushHistory(state);
      return {
        ...s,
        tables: s.tables.map((t) =>
          t.id === action.payload.tableId
            ? { ...t, name: action.payload.name, comment: action.payload.comment }
            : t
        ),
      };
    }

    case 'DELETE_TABLE': {
      const s = pushHistory(state);
      return {
        ...s,
        tables: s.tables.filter((t) => t.id !== action.payload.tableId),
        relationships: s.relationships.filter(
          (r) => r.fromTableId !== action.payload.tableId && r.toTableId !== action.payload.tableId
        ),
        selectedTableId: s.selectedTableId === action.payload.tableId ? null : s.selectedTableId,
      };
    }

    case 'MOVE_TABLE_START': {
      return pushHistory(state);
    }

    case 'MOVE_TABLE': {
      return {
        ...state,
        tables: state.tables.map((t) =>
          t.id === action.payload.tableId
            ? { ...t, x: action.payload.x, y: action.payload.y }
            : t
        ),
      };
    }

    case 'ADD_COLUMN': {
      const s = pushHistory(state);
      const newColumn = { ...action.payload.column, id: generateId() };
      return {
        ...s,
        tables: s.tables.map((t) =>
          t.id === action.payload.tableId
            ? { ...t, columns: [...t.columns, newColumn] }
            : t
        ),
      };
    }

    case 'UPDATE_COLUMN': {
      const s = pushHistory(state);
      return {
        ...s,
        tables: s.tables.map((t) =>
          t.id === action.payload.tableId
            ? {
                ...t,
                columns: t.columns.map((c) =>
                  c.id === action.payload.columnId
                    ? { ...c, ...action.payload.updates }
                    : c
                ),
              }
            : t
        ),
      };
    }

    case 'DELETE_COLUMN': {
      const s = pushHistory(state);
      return {
        ...s,
        tables: s.tables.map((t) =>
          t.id === action.payload.tableId
            ? { ...t, columns: t.columns.filter((c) => c.id !== action.payload.columnId) }
            : t
        ),
        relationships: s.relationships.filter(
          (r) =>
            !(r.fromTableId === action.payload.tableId && r.fromColumnId === action.payload.columnId) &&
            !(r.toTableId === action.payload.tableId && r.toColumnId === action.payload.columnId)
        ),
      };
    }

    case 'ADD_RELATIONSHIP': {
      const s = pushHistory(state);
      const newRel = { ...action.payload, id: generateId() };
      return {
        ...s,
        relationships: [...s.relationships, newRel],
        pendingRelationship: null,
      };
    }

    case 'DELETE_RELATIONSHIP': {
      const s = pushHistory(state);
      return {
        ...s,
        relationships: s.relationships.filter((r) => r.id !== action.payload.relationshipId),
        selectedRelationshipId:
          s.selectedRelationshipId === action.payload.relationshipId ? null : s.selectedRelationshipId,
      };
    }

    case 'SELECT_TABLE':
      return {
        ...state,
        selectedTableId: action.payload.tableId,
        selectedRelationshipId: action.payload.tableId ? null : state.selectedRelationshipId,
      };

    case 'SELECT_RELATIONSHIP':
      return {
        ...state,
        selectedRelationshipId: action.payload.relationshipId,
        selectedTableId: action.payload.relationshipId ? null : state.selectedTableId,
      };

    case 'SET_PENDING_RELATIONSHIP':
      return { ...state, pendingRelationship: action.payload };

    case 'SET_DISPLAY_OPTIONS':
      return {
        ...state,
        displayOptions: { ...state.displayOptions, ...action.payload },
      };

    case 'SET_ZOOM':
      return { ...state, zoom: action.payload.zoom };

    case 'SET_PAN':
      return { ...state, panX: action.payload.panX, panY: action.payload.panY };

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const prevIndex = state.historyIndex - 1;
      const snapshot = state.history[prevIndex];
      return {
        ...state,
        tables: structuredClone(snapshot.tables),
        relationships: structuredClone(snapshot.relationships),
        historyIndex: prevIndex,
        selectedTableId: null,
        selectedRelationshipId: null,
        pendingRelationship: null,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const nextIndex = state.historyIndex + 1;
      const snapshot = state.history[nextIndex];
      return {
        ...state,
        tables: structuredClone(snapshot.tables),
        relationships: structuredClone(snapshot.relationships),
        historyIndex: nextIndex,
        selectedTableId: null,
        selectedRelationshipId: null,
        pendingRelationship: null,
      };
    }

    case 'LOAD_STATE': {
      const s = pushHistory(state);
      return {
        ...s,
        tables: action.payload.tables,
        relationships: action.payload.relationships,
        selectedTableId: null,
        selectedRelationshipId: null,
        pendingRelationship: null,
      };
    }

    default:
      return state;
  }
}
