import { useReducer, useState, useEffect, useCallback } from 'react';
import { erdBuilderReducer, initialState } from '../reducer';
import { defaultDisplayOptions } from '../types';
import { ERDBuilderContext } from '../context';
import ERDBuilderHeader from './ERDBuilderHeader';
import ERDBuilderToolbar from './ERDBuilderToolbar';
import ERDBuilderCanvas from './ERDBuilderCanvas';
import ERDBuilderSidebar from './ERDBuilderSidebar';
import AddTableModal from './AddTableModal';
import ImportModal from './ImportModal';
import ExportModal from './ExportModal';

const STORAGE_KEY = 'tablespec-erd-builder';

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const data = JSON.parse(saved);
    if (data.tables && Array.isArray(data.tables)) return data;
    return null;
  } catch {
    return null;
  }
}

export default function ERDBuilderPage() {
  const saved = loadSavedState();
  const init = saved
    ? { ...initialState, tables: saved.tables, relationships: saved.relationships || [], displayOptions: saved.displayOptions || defaultDisplayOptions }
    : initialState;

  const [state, dispatch] = useReducer(erdBuilderReducer, init);
  const [modal, setModal] = useState<'add-table' | 'import' | 'export' | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    const data = { tables: state.tables, relationships: state.relationships, displayOptions: state.displayOptions };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [state.tables, state.relationships, state.displayOptions]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedTableId) {
          dispatch({ type: 'DELETE_TABLE', payload: { tableId: state.selectedTableId } });
        } else if (state.selectedRelationshipId) {
          dispatch({ type: 'DELETE_RELATIONSHIP', payload: { relationshipId: state.selectedRelationshipId } });
        }
      } else if (e.key === 'Escape') {
        dispatch({ type: 'SET_PENDING_RELATIONSHIP', payload: null });
        dispatch({ type: 'SELECT_TABLE', payload: { tableId: null } });
        dispatch({ type: 'SELECT_RELATIONSHIP', payload: { relationshipId: null } });
      }
    },
    [state.selectedTableId, state.selectedRelationshipId]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <ERDBuilderContext.Provider value={{ state, dispatch }}>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#1A202C]">
        <ERDBuilderHeader
          onImport={() => setModal('import')}
          onExport={() => setModal('export')}
        />
        <div className="flex flex-1 overflow-hidden">
          <ERDBuilderToolbar
            onAddTable={() => setModal('add-table')}
          />
          <ERDBuilderCanvas />
          <ERDBuilderSidebar />
        </div>
      </div>

      {modal === 'add-table' && <AddTableModal onClose={() => setModal(null)} />}
      {modal === 'import' && <ImportModal onClose={() => setModal(null)} />}
      {modal === 'export' && <ExportModal onClose={() => setModal(null)} />}
    </ERDBuilderContext.Provider>
  );
}
