import { useCallback, useRef, useState, useMemo } from 'react';
import type { BuilderTable } from '../types';
import { useERDBuilder } from '../context';

const HEADER_HEIGHT = 28;
const ROW_HEIGHT = 20;
const ROW_HEIGHT_WITH_DETAIL = 32;
const NODE_MIN_WIDTH = 220;
const NODE_MAX_WIDTH = 380;

interface Props {
  table: BuilderTable;
  screenToCanvas: (screenX: number, screenY: number) => { x: number; y: number };
}

export default function ERDBuilderTableNode({ table, screenToCanvas }: Props) {
  const { state, dispatch } = useERDBuilder();
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isSelected = state.selectedTableId === table.id;
  const opts = state.displayOptions;

  const nodeWidth = useMemo(() => computeNodeWidth(opts), [opts]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({ type: 'SELECT_TABLE', payload: { tableId: table.id } });
      dispatch({ type: 'MOVE_TABLE_START', payload: { tableId: table.id } });

      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      dragOffset.current = { x: canvasPos.x - table.x, y: canvasPos.y - table.y };
      setIsDragging(true);

      const handleMove = (ev: MouseEvent) => {
        const pos = screenToCanvas(ev.clientX, ev.clientY);
        dispatch({
          type: 'MOVE_TABLE',
          payload: {
            tableId: table.id,
            x: Math.round(pos.x - dragOffset.current.x),
            y: Math.round(pos.y - dragOffset.current.y),
          },
        });
      };

      const handleUp = () => {
        setIsDragging(false);
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    },
    [table.id, table.x, table.y, screenToCanvas, dispatch]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({ type: 'SELECT_TABLE', payload: { tableId: table.id } });
    },
    [table.id, dispatch]
  );

  const handleConnectorMouseDown = useCallback(
    (e: React.MouseEvent, columnId: string) => {
      e.stopPropagation();

      if (state.pendingRelationship) {
        if (state.pendingRelationship.fromTableId !== table.id || state.pendingRelationship.fromColumnId !== columnId) {
          dispatch({
            type: 'ADD_RELATIONSHIP',
            payload: {
              fromTableId: state.pendingRelationship.fromTableId,
              fromColumnId: state.pendingRelationship.fromColumnId,
              toTableId: table.id,
              toColumnId: columnId,
            },
          });
        } else {
          dispatch({ type: 'SET_PENDING_RELATIONSHIP', payload: null });
        }
      } else {
        dispatch({
          type: 'SET_PENDING_RELATIONSHIP',
          payload: { fromTableId: table.id, fromColumnId: columnId },
        });
      }
    },
    [state.pendingRelationship, table.id, dispatch]
  );

  return (
    <div
      className={`absolute select-none ${isDragging ? 'opacity-90' : ''}`}
      style={{ left: table.x, top: table.y, width: nodeWidth }}
      onClick={handleClick}
    >
      <div
        className={`rounded-lg border overflow-hidden shadow-lg transition-shadow ${
          isSelected ? 'ring-2 ring-[#4DB8B0] border-[#4DB8B0]' : 'border-[#4A5568]'
        }`}
      >
        {/* Header */}
        <div
          className="bg-[#334155] px-3 flex items-center cursor-grab active:cursor-grabbing"
          style={{ height: HEADER_HEIGHT }}
          onMouseDown={handleMouseDown}
        >
          <span className="text-xs font-bold text-white truncate flex-1">{table.name}</span>
          {table.comment && (
            <span className="text-[8px] text-[#94A3B8] truncate ml-2 max-w-[80px]" title={table.comment}>
              {table.comment}
            </span>
          )}
        </div>

        {/* Columns */}
        <div className="bg-[#1E293B]">
          {table.columns.length === 0 ? (
            <div className="px-3 py-2 text-[10px] text-[#4A5568] italic">No columns</div>
          ) : (
            table.columns.map((col, i) => {
              const isPK = col.isPrimaryKey;
              const isFK = state.relationships.some(
                (r) =>
                  (r.fromTableId === table.id && r.fromColumnId === col.id) ||
                  (r.toTableId === table.id && r.toColumnId === col.id)
              );

              // Build constraint tags
              const tags: { label: string; color: string; bg: string }[] = [];
              if (opts.showConstraints) {
                if (isPK) tags.push({ label: 'PK', color: 'text-blue-400', bg: 'bg-blue-900/40' });
                if (isFK) tags.push({ label: 'FK', color: 'text-emerald-400', bg: 'bg-emerald-900/40' });
              }
              if (opts.showUnique && col.isUnique) tags.push({ label: 'UQ', color: 'text-purple-400', bg: 'bg-purple-900/40' });
              if (opts.showAutoIncrement && col.isAutoIncrement) tags.push({ label: 'AI', color: 'text-orange-400', bg: 'bg-orange-900/40' });

              // Build detail text for second line
              const details: string[] = [];
              if (opts.showNullable) details.push(col.nullable ? 'NULL' : 'NOT NULL');
              if (opts.showDefault && col.defaultValue) details.push(`DEFAULT ${col.defaultValue}`);
              if (opts.showComment && col.comment) details.push(col.comment);

              const showDetailRow = details.length > 0;
              const thisRowHeight = showDetailRow ? ROW_HEIGHT_WITH_DETAIL : ROW_HEIGHT;

              return (
                <div
                  key={col.id}
                  className={`relative px-1 group ${
                    isPK
                      ? 'bg-blue-900/20'
                      : isFK
                        ? 'bg-emerald-900/20'
                        : i % 2 === 0
                          ? 'bg-[#1E293B]'
                          : 'bg-[#1A202C]'
                  }`}
                  style={{ minHeight: thisRowHeight }}
                >
                  {/* Left connector */}
                  <div
                    className="absolute -left-[5px] w-[10px] h-[10px] rounded-full border-2 border-[#4A5568] bg-[#1A202C] opacity-0 group-hover:opacity-100 hover:border-[#4DB8B0] hover:bg-[#4DB8B0]/30 cursor-pointer transition-all z-10"
                    style={{ top: ROW_HEIGHT / 2, transform: 'translateY(-50%)' }}
                    onMouseDown={(e) => handleConnectorMouseDown(e, col.id)}
                  />

                  {/* Main row: badges + name + type */}
                  <div className="flex items-center" style={{ height: ROW_HEIGHT }}>
                    {tags.map((tag) => (
                      <span key={tag.label} className={`text-[8px] font-bold ${tag.color} ${tag.bg} px-1 rounded mr-0.5 shrink-0`}>
                        {tag.label}
                      </span>
                    ))}
                    <span className="text-[10px] text-[#E2E8F0] truncate flex-1 pl-1">{col.name}</span>
                    {opts.showDataType && (
                      <span className="text-[9px] text-[#64748B] truncate ml-1 pr-1">{col.dataType}</span>
                    )}
                  </div>

                  {/* Detail row (nullable, default, comment) */}
                  {showDetailRow && (
                    <div className="flex items-center px-1 pb-0.5" style={{ height: ROW_HEIGHT_WITH_DETAIL - ROW_HEIGHT }}>
                      <span className="text-[8px] text-[#4A5568] truncate pl-1">
                        {details.join(' | ')}
                      </span>
                    </div>
                  )}

                  {/* Right connector */}
                  <div
                    className="absolute -right-[5px] w-[10px] h-[10px] rounded-full border-2 border-[#4A5568] bg-[#1A202C] opacity-0 group-hover:opacity-100 hover:border-[#4DB8B0] hover:bg-[#4DB8B0]/30 cursor-pointer transition-all z-10"
                    style={{ top: ROW_HEIGHT / 2, transform: 'translateY(-50%)' }}
                    onMouseDown={(e) => handleConnectorMouseDown(e, col.id)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export function computeNodeWidth(opts: { showNullable: boolean; showDefault: boolean; showComment: boolean; showUnique?: boolean; showAutoIncrement?: boolean }) {
  const hasDetail = opts.showNullable || opts.showDefault || opts.showComment || opts.showUnique || opts.showAutoIncrement;
  let w = NODE_MIN_WIDTH;
  if (opts.showNullable || opts.showDefault) w = Math.max(w, 260);
  if (opts.showComment) w = Math.max(w, 300);
  if (hasDetail) w = Math.max(w, 280);
  return Math.min(w, NODE_MAX_WIDTH);
}

export { HEADER_HEIGHT, ROW_HEIGHT, ROW_HEIGHT_WITH_DETAIL, NODE_MIN_WIDTH as NODE_WIDTH };
