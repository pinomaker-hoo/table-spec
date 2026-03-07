import { useRef, useCallback, useState } from 'react';
import { useERDBuilder } from '../context';
import ERDBuilderTableNode from './ERDBuilderTableNode';
import ERDBuilderRelationshipLayer from './ERDBuilderRelationshipLayer';

export default function ERDBuilderCanvas() {
  const { state, dispatch } = useERDBuilder();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const screenToCanvas = useCallback(
    (screenX: number, screenY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (screenX - rect.left - state.panX) / state.zoom,
        y: (screenY - rect.top - state.panY) / state.zoom,
      };
    },
    [state.panX, state.panY, state.zoom]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(3, Math.max(0.1, state.zoom * delta));
      const scale = newZoom / state.zoom;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const newPanX = mouseX - (mouseX - state.panX) * scale;
      const newPanY = mouseY - (mouseY - state.panY) * scale;

      dispatch({ type: 'SET_ZOOM', payload: { zoom: newZoom } });
      dispatch({ type: 'SET_PAN', payload: { panX: newPanX, panY: newPanY } });
    },
    [state.zoom, state.panX, state.panY, dispatch]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only pan when clicking on the canvas background
      if (e.target === containerRef.current || (e.target as HTMLElement).dataset.canvasBg === 'true') {
        setDragging(true);
        setDragStart({ x: e.clientX - state.panX, y: e.clientY - state.panY });

        // Deselect everything
        dispatch({ type: 'SELECT_TABLE', payload: { tableId: null } });
        dispatch({ type: 'SELECT_RELATIONSHIP', payload: { relationshipId: null } });
        if (state.pendingRelationship) {
          dispatch({ type: 'SET_PENDING_RELATIONSHIP', payload: null });
        }
      }
    },
    [state.panX, state.panY, state.pendingRelationship, dispatch]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!dragging) return;
      dispatch({
        type: 'SET_PAN',
        payload: { panX: e.clientX - dragStart.x, panY: e.clientY - dragStart.y },
      });
    },
    [dragging, dragStart, dispatch]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{ cursor: dragging ? 'grabbing' : state.pendingRelationship ? 'crosshair' : 'grab' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Dotted grid background */}
      <div
        data-canvas-bg="true"
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #4A5568 1px, transparent 1px)',
          backgroundSize: `${20 * state.zoom}px ${20 * state.zoom}px`,
          backgroundPosition: `${state.panX % (20 * state.zoom)}px ${state.panY % (20 * state.zoom)}px`,
        }}
      />

      {/* Transform container */}
      <div
        className="absolute"
        style={{
          transform: `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Relationship lines (behind tables) */}
        <ERDBuilderRelationshipLayer mousePos={mousePos} containerRef={containerRef} />

        {/* Table nodes */}
        {state.tables.map((table) => (
          <ERDBuilderTableNode
            key={table.id}
            table={table}
            screenToCanvas={screenToCanvas}
          />
        ))}
      </div>

      {/* Empty state */}
      {state.tables.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[#718096] text-lg mb-2">No tables yet</p>
            <p className="text-[#4A5568] text-sm">Click + to add a table, or import a DDL file</p>
          </div>
        </div>
      )}
    </div>
  );
}
