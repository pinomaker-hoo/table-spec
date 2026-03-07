import { useERDBuilder } from '../context';
import { useLanguage } from '../../i18n/LanguageContext';
import { computeAutoLayout } from '../utils/autoLayout';

interface Props {
  onAddTable: () => void;
}

export default function ERDBuilderToolbar({ onAddTable }: Props) {
  const { state, dispatch } = useERDBuilder();
  const { t } = useLanguage();

  const hasSelection = state.selectedTableId || state.selectedRelationshipId;

  const handleZoomIn = () => {
    dispatch({ type: 'SET_ZOOM', payload: { zoom: Math.min(3, state.zoom * 1.3) } });
  };

  const handleZoomOut = () => {
    dispatch({ type: 'SET_ZOOM', payload: { zoom: Math.max(0.1, state.zoom * 0.7) } });
  };

  const handleFit = () => {
    if (state.tables.length === 0) {
      dispatch({ type: 'SET_ZOOM', payload: { zoom: 1 } });
      dispatch({ type: 'SET_PAN', payload: { panX: 0, panY: 0 } });
      return;
    }
    // Calculate bounding box of all tables
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const t of state.tables) {
      minX = Math.min(minX, t.x);
      minY = Math.min(minY, t.y);
      maxX = Math.max(maxX, t.x + 220);
      maxY = Math.max(maxY, t.y + 200);
    }
    const contentW = maxX - minX + 100;
    const contentH = maxY - minY + 100;
    const viewW = window.innerWidth - 48; // minus toolbar width
    const viewH = window.innerHeight - 48; // minus header height
    const fitZoom = Math.min(viewW / contentW, viewH / contentH, 1.5);
    dispatch({ type: 'SET_ZOOM', payload: { zoom: fitZoom } });
    dispatch({ type: 'SET_PAN', payload: { panX: -minX * fitZoom + 50, panY: -minY * fitZoom + 50 } });
  };

  const handleDelete = () => {
    if (state.selectedTableId) {
      dispatch({ type: 'DELETE_TABLE', payload: { tableId: state.selectedTableId } });
    } else if (state.selectedRelationshipId) {
      dispatch({ type: 'DELETE_RELATIONSHIP', payload: { relationshipId: state.selectedRelationshipId } });
    }
  };

  return (
    <div className="w-12 bg-[#2D3748] border-r border-[#4A5568] flex flex-col items-center py-3 gap-2 shrink-0">
      {/* Add Table */}
      <button
        onClick={onAddTable}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[#A0AEC0] hover:bg-[#4A5568] hover:text-white transition-colors"
        title={t.addTable}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div className="w-6 h-px bg-[#4A5568]" />

      {/* Zoom controls */}
      <button
        onClick={handleZoomIn}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[#A0AEC0] hover:bg-[#4A5568] hover:text-white transition-colors"
        title="Zoom In"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <span className="text-[10px] text-[#718096]">{Math.round(state.zoom * 100)}%</span>

      <button
        onClick={handleZoomOut}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[#A0AEC0] hover:bg-[#4A5568] hover:text-white transition-colors"
        title="Zoom Out"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <button
        onClick={handleFit}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[#A0AEC0] hover:bg-[#4A5568] hover:text-white transition-colors"
        title={t.fitToScreen}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>

      <div className="w-6 h-px bg-[#4A5568]" />

      {/* Auto Layout */}
      <button
        onClick={() => {
          const updated = computeAutoLayout(state.tables);
          for (const t of updated) {
            dispatch({ type: 'MOVE_TABLE', payload: { tableId: t.id, x: t.x, y: t.y } });
          }
        }}
        disabled={state.tables.length === 0}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[#A0AEC0] hover:bg-[#4A5568] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title={t.autoLayout}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>

      <div className="w-6 h-px bg-[#4A5568]" />

      {/* Delete Selected */}
      <button
        onClick={handleDelete}
        disabled={!hasSelection}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[#A0AEC0] hover:bg-red-900/50 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title={t.deleteTable}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
